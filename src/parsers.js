const parseItems = (doc) => {
  const items = [...doc.querySelectorAll('item')];
  const feedLink = doc.querySelector('link').textContent;
  const itemsData = items.map((el) => (
    {
      feedLink,
      title: el.querySelector('title').textContent,
      description: el.querySelector('description').textContent,
      link: el.querySelector('link').textContent,
    }));

  return itemsData;
};

const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const errorElement = doc.querySelector('parsererror');

  if (errorElement) {
    throw new Error('It isn\'t RSS url');
  } else {
    const feed = {
      title: doc.querySelector('title').textContent,
      link: doc.querySelector('link').textContent,
      description: doc.querySelector('description').textContent,
    };

    return { feed, items: parseItems(doc) };
  }
};

export default parse;
