const express = require('express');
const app = express();
const path = require('path');

const cors = require('cors');
const axios = require('axios');
const checkStatusCode = require('./utils/statusCheck');

app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client', 'build')));

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
});

app.post('/api', async (req, res) => {
  const domains = req.body.domains;
  const timeFrame = req.body.timeFrame;
  const limit = req.body.limit;

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const results = await Promise.all(
    domains.map(async (domain) => {
      const result = await axios.get(
        `http://web.archive.org/cdx/search/cdx?url=${domain}&matchType=domain&filter=mimetype:text/html&collapse=urlkey&fl=original&output=json&${
          timeFrame === 'all' ? '' : `&from=${previousYear}&to=${currentYear}`
        }${limit > 0 ? `&limit=${limit}` : ''}`
      );
      console.log(`${domain} sent ${result.data.length} urls`);
      return {
        domain,
        urls: result.data.slice(1).flat(),
      };
    })
  );

  const domainFilteredResults = results.map((result) => {
    return {
      ...result,
      urls: result.urls.filter((url) => !url.includes('embed?url=')),
    };
  });

  const filteredResults = domainFilteredResults.map((result) => {
    return {
      domain: result.domain,
      urls: result.urls
        .map((url) => url.replace(':80', ''))
        .filter((url, index, self) => self.indexOf(url) === index)
        .filter(
          (url) =>
            !url.includes('.min.js') &&
            !url.includes('.min.css') &&
            !url.includes('.js') &&
            !url.includes('.css') &&
            !url.includes('.jpeg') &&
            !url.includes('.jpg') &&
            !url.includes('.png') &&
            !url.includes('.svg') &&
            !url.includes('.gif') &&
            !url.includes('.ico') &&
            !url.includes('.php') &&
            !url.includes('.xml') &&
            !url.includes('.json') &&
            !url.includes('.woff') &&
            !url.includes('.woff2') &&
            !url.includes('.ttf') &&
            !url.includes('.eot') &&
            !url.includes('.otf') &&
            !url.includes('.txt') &&
            !url.includes('.mp4')
        ),
    };
  });

  const statusResults = await Promise.all(
    filteredResults.map(async (result) => {
      const urls = await Promise.all(
        result.urls.map(async (url) => {
          const statusCode = await checkStatusCode(url);
          return {
            url,
            status: statusCode[0][2] || 200,
          };
        })
      );
      // Console progress
      return {
        id: Date.now(),
        domain: result.domain[0],
        urls,
      };
    })
  );
  if (statusResults) {
    console.log('Data send successfully!');
  }
  res.send(statusResults).end();
});

module.exports = app;
