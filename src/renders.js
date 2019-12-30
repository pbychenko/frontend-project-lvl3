export const renderErrors = (error) => {
  return error ? `<div class="alert alert-primary" role="alert">${error}</div>` : '';
};

const renderNews = (item) => {
  return `<li class="list-group-item">
    <a href="${item.link}">${item.title}</a>
    <div><button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="${item.description}">Show News</button></div>
  </li>`;
};

const renderFeed = (feed) => {
  return `<li class="list-group-item">
    <a href="${feed.link}">${feed.title}</a>
    <p>${feed.description}</p>
  </li>`;
};

export const renderAllNews = (feeds, news) => {
  const newsList = document.querySelector('.news');
  newsList.innerHTML = feeds.map((feed) => {
    const feedNews = news.filter((e) => e.url === feed.url);
    return feedNews.map(renderNews).join('');
  }).join('');
};

export const renderFeeds = (feeds, news) => {
  const input = document.querySelector('#input-rss');
  const feedList = document.querySelector('.feeds');
  input.value = '';
  feedList.innerHTML = feeds.map(renderFeed).join('');
  renderAllNews(feeds, news);
};
