const axios = require('axios');

async function callService(method, url, headers, data = null) {
  try {
    const config = {
      method: method,
      url: url,
      headers: headers,
      data: data
    };
    const response = await axios(config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers
    };
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return {
        status: 500,
        data: { error: 'No response received from target service' },
        headers: {}
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      return {
        status: 500,
        data: { error: 'Error setting up request' },
        headers: {}
      };
    }
  }
}

module.exports = {
  callService
};
