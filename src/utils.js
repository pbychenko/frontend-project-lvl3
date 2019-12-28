export const addModalButton = (description) => {
  return `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="${description}">Show News</button>`;
};

export const getDiff = (data1, data2) => {
  const data2Titles = data2.map((el) => el.title);
  return data1.filter((el) => !data2Titles.includes(el.title));
};
