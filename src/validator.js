const validate = (xmlObject) => {
  // const parser = new DOMParser();
  // let doc = parser.parseFromString(xmlObject, 'application/xml');
  const testFeed = {};
  const list = [...xmlObject.querySelectorAll('item')];
  testFeed.description = xmlObject.querySelector('description').textContent;
  testFeed.title = xmlObject.querySelector('title').textContent;
  testFeed.link = xmlObject.querySelector('link').textContent;
  const newList = list.map((el) => {
    const description = el.querySelector('description').textContent;
    const title = el.querySelector('title').textContent;
    const link = el.querySelector('link').textContent;
    return { title, description, link };
  });
  testFeed.items = newList;
  return testFeed;
};

export default validate;
