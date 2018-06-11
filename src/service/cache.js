const cache = {
  cats: [],
};

export default {
  get: key => JSON.parse(localStorage.getItem(key)),
  set: (key, value) => {
    cache[key] = value;
    localStorage.setItem(key, JSON.stringify((value)));
  },
};
