const axios = require('axios');

function axiosRequest(urlToCheck, axiosOptions, redirect) {
  var httpStatus = ['', 0, '', urlToCheck, ''];

  if (!redirect) {
    httpStatus[0] = urlToCheck;
  }

  return new Promise((resolve) => {
    axios
      .get(urlToCheck, axiosOptions)
      .then((response) => {
        httpStatus[2] = response.status;
        if (redirect) {
          httpStatus[1] = '';
        }

        resolve(httpStatus);
      })
      .catch(async (error) => {
        var statusLists = [];

        if (error.response && error.response.status) {
          httpStatus[2] = error.response.status;
          if (error.response.status >= 300 && error.response.status < 400) {
            const redUrl = error.response.headers.location;
            const checkType = await axiosRequest(redUrl, axiosOptions, true);

            httpStatus[3] = error.response.headers.location;
            statusLists[0] = httpStatus;

            if (redirect) {
              httpStatus[1] = '';
            } else if (typeof checkType[0] === 'object') {
              httpStatus[1] = checkType.length;
            } else {
              httpStatus[1] = 1;
            }

            if (!redirect && typeof checkType[0] === 'object') {
              let childLinks = 1;
              checkType.forEach((element) => {
                statusLists[childLinks] = element;
                childLinks += 1;
              });
            } else {
              statusLists[1] = checkType;
            }
          } else {
            statusLists = httpStatus;
          }
        } else {
          httpStatus[1] = '';
          httpStatus[3] = '';
          if (error.message) {
            httpStatus[4] = error.message;
          } else {
            httpStatus[4] = error;
          }

          statusLists = httpStatus;
        }

        resolve(statusLists);
      });
  });
}

async function checkStatusCode(urlToCheck, options, skip200) {
  console.log(`Status checking started for ${urlToCheck}`);
  const statusList = [];

  var axiosOptions = {
    maxRedirects: 0,
  };
  var statusArray = [];

  statusArray = await axiosRequest(urlToCheck, axiosOptions);
  if (typeof statusArray[0] === 'object') {
    statusArray.forEach((row) => {
      statusList.push(row);
    });
  } else {
    if (statusArray[2] !== 200 || !skip200) {
      statusList.push(statusArray);
    }
  }
  console.log('Status code checked!');
  return Promise.resolve(statusList);
}

module.exports = checkStatusCode;
