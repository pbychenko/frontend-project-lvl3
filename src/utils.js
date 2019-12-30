const getDiff = (data1, data2) => {
  const data2Titles = data2.map((el) => el.title);
  return data1.filter((el) => !data2Titles.includes(el.title));
};

export default getDiff;
