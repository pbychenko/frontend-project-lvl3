const parseNews = (url, doc) => {
  const items = [...doc.querySelectorAll('item')];
  const newsData = items.map((el) => (
    {
      url,
      title: el.querySelector('title').textContent,
      description: el.querySelector('description').textContent,
      link: el.querySelector('link').textContent,
    }));

  return newsData;
};

const parse = (url, data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  const errorElement = doc.querySelector('parsererror');

  if (errorElement) {
    throw new Error('It isn\'t RSS url');
  } else {
    const feed = {
      url,
      title: doc.querySelector('title').textContent,
      link: doc.querySelector('link').textContent,
      description: doc.querySelector('description').textContent,
    };

    return { feed, news: parseNews(url, doc) };
  }
};

export default parse;
