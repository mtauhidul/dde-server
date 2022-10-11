const express = require('express');
const app = express();
const cors = require('cors');
const checkHttpStatus = require('check-http-status');
const axios = require('axios');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

app.post('/api', async (req, res) => {
  const domains = req.body.domains;
  console.log(domains);
  const promises = domains.map((domain) => {
    return axios.get(
      `http://web.archive.org/cdx/search/cdx?url=${domain}*&output=json&`
    );
  });
  Promise.all(promises)
    .then((responses) => Promise.all(responses.map((r) => r)))
    .then((data) => {
      const result = data.map((d) => {
        return d.data.map((e) => {
          return e[2];
        });
      });

      const updatedData = result.map((domainData, index) => {
        const domainDataArray = domainData.slice(1);
        return {
          domain: domains[index],
          urls: domainDataArray,
        };
      });

      // Remove :80 from the urls
      const updatedData2 = updatedData.map((domainData) => {
        const urls = domainData.urls.map((url) => {
          return url.replace(':80', '');
        });
        return {
          domain: domainData.domain,
          urls: urls,
        };
      });

      // Remove duplicate urls
      const updatedData3 = updatedData2.map((domainData) => {
        const urls = domainData.urls.filter(
          (url, index, self) =>
            self.indexOf(url) === index &&
            url !== '' &&
            url !== 'null' &&
            url !== 'undefined' &&
            url !== 'NaN' &&
            url !== ' '
        );
        return {
          domain: domainData.domain,
          urls: urls,
        };
      });

      let finalData = [];

      // CHECK HTTP STATUS CODES
      Promise.all(
        updatedData3.map(async (domainData) => {
          const urls = await domainData.urls.map(async (url) => {
            const status = await checkHttpStatus({ urls: [url] });
            return {
              url: url,
              status: status[0][2],
            };
          });
          const newArray = Promise.all(urls).then((updatedUrls) => {
            return {
              domain: domainData.domain,
              urls: updatedUrls,
            };
          });
          return newArray;
        })
      ).then((data) => {
        res.send(data);
      });
    });
});

module.exports = app;
