export const getFeedData = (url, xmlObject) => {
  const errorElement = xmlObject.querySelector('parsererror');
  if (errorElement) {
    throw new Error('It is\'nt RSS url');
  } else {
    return {
      url,
      title: xmlObject.querySelector('title').textContent,
      link: xmlObject.querySelector('link').textContent,
      description: xmlObject.querySelector('description').textContent,
    };
  }
};

export const getNewsData = (url, xmlObject) => {
  const items = [...xmlObject.querySelectorAll('item')];
  const newsData = items.map((el) => (
    {
      url,
      title: el.querySelector('title').textContent,
      description: el.querySelector('description').textContent,
      link: el.querySelector('link').textContent,
    }));

  return newsData;
};

export const getDomDoc = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  return doc;
};
