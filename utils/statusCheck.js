const fetch = require('node-fetch');

async function checkStatusCode(urlToCheck) {
  console.log(`Status checking started for ${urlToCheck}`);
  async function makeRequest() {
    try {
      const response = await fetch(urlToCheck);

      console.log('response.status: ', response.status); // 👉️ 200
      console.log(response);
      return response.status;
    } catch (err) {
      console.log(err);
    }
  }

  console.log('Status code checked!');
  return makeRequest();
}

module.exports = checkStatusCode;
