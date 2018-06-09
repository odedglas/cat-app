import request from './request';

const oParser = new DOMParser();

export default {
  getRandomCat: () => new Promise((resolve, reject) => {
    request.promise({ url: 'https://thecatapi.com/api/images/get?format=xml&results_per_page=1' })
      .then((response) => {
        const oDOM = oParser.parseFromString(
          response.data,
          'application/xml',
        );
        resolve(oDOM.querySelector('image > url').innerHTML);
      }).catch(e => reject(e));
  }),
};
