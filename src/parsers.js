export const getFeedData = (url, xmlObject) => {
  const errorElement = xmlObject.querySelector('parsererror');
  if (errorElement) {
    throw new Error('It is\'nt RSS url');
  } else {
    const title = xmlObject.querySelector('title').textContent;
    const link = xmlObject.querySelector('link').textContent;
    const description = xmlObject.querySelector('description').textContent;
    return { url, title, link, description };
  }
};

export const getNewsData = (url, xmlObject) => {
  const items = [...xmlObject.querySelectorAll('item')];
  const newsData = items.map((el) => {
    const description = el.querySelector('description').textContent;
    const title = el.querySelector('title').textContent;
    const link = el.querySelector('link').textContent;
    return { url, title, description, link };
  });

  return newsData;
};

export const getDomDoc = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  return doc;
};
