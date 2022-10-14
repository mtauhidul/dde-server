const express = require('express');
const app = express();

const cors = require('cors');
const axios = require('axios');
const checkStatusCode = require('./utils/statusCheck');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.post('/api', async (req, res) => {
  const domains = req.body.domains;
  console.log(domains);
  const results = await Promise.all(
    domains.map(async (domain) => {
      const result = await axios.get(
        `http://web.archive.org/cdx/search/cdx?url=${domain}*&fl=original&output=json&`
      );
      return {
        domain,
        urls: result.data.slice(1).flat(),
      };
    })
  );

  const filteredResults = results.map((result) => {
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
            !url.includes('.txt')
        ),
    };
  });

  const statusResults = await Promise.all(
    filteredResults.map(async (result) => {
      const urls = await Promise.all(
        result.urls.map(async (url) => {
          const statusCode = await checkStatusCode(url, {}, false);
          return {
            url,
            status: statusCode[0][2] || 503,
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

  res.send(statusResults);
  if (statusResults) {
    console.log('Data send successfully!');
  }
});

module.exports = app;
