import axios from 'axios';

const API_URL = '';
const instance = axios.create({
  baseURL: API_URL,
});
instance.all = axios.all;
export default {
  promise: config => instance(config),
  promiseAll: (requests) => {
    const promises = [];
    for (let i = 0; i < requests.length; i++) {
      const requestConfig = requests[i];
      promises.push(instance(requestConfig));
    }
    return instance.all(promises);
  },
};
