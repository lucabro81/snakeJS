export const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomInt = (min, max) => {
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.floor(max);
  return Math.floor(Math.random() * (roundedMax - roundedMin + 1)) + roundedMin;
};
