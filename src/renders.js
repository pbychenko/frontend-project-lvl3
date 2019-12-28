import addModalButton from './utils';

export const renderErrors = (error) => {
  return error ? `<div class="alert alert-primary" role="alert">${error}</div>` : '';
};

const renderNews = (item) => {
  return `<li class="list-group-item">
    <a href="${item.link}">${item.title}</a>
    <div>${addModalButton(item.description)}</div>
  </li>`;
};

const renderFeed = (feed) => {
  return `<li class="list-group-item">
    <a href="${feed.data.link}">${feed.data.title}</a>
    <p>${feed.data.description}</p>
  </li>`;
};

export const render = (feeds) => {
  const feedList = document.querySelector('.feeds');
  const newsList = document.querySelector('.news');
  feedList.innerHTML = feeds.map(renderFeed).join('');
  newsList.innerHTML = feeds.map((feed) => feed.data.items.map(renderNews).join('')).join('');
};

// const feedli = document.createElement('li');
// const feeda1 = document.createElement('a');
// const feedp2 = document.createElement('p');

// feedli.classList.add('list-group-item');
// feeda1.textContent = feed.data.title;
// feeda1.href = feed.data.link;

// feedp2.textContent = feed.data.description;
// feedli.append(feeda1);
// feedli.append(feedp2);
// feedList.append(feedli);

// feed.data.items.forEach((item) => {
//   const newli = document.createElement('li');
//   const newa1 = document.createElement('a');
//   const newp2 = document.createElement('p');
//   const newdiv = document.createElement('div');

//   newli.classList.add('list-group-item');
//   newa1.textContent = item.title;
//   newa1.href = item.link;
//   newdiv.innerHTML = addModal(item.description);


//   newli.append(newa1);
//   newli.append(newp2);
//   newli.append(newdiv);
//   newsList.append(newli);
