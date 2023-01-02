/**
 *
 * @param {{
 *  length: string | number | undefined,
 *  whitelist: string | undefined,
 * }} options
 * @returns
 */
module.exports.specialCharacter = (options = {}) => {
  options.length = options.length || 5;
  options.whitelist = options.whitelist || "!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~\\";

  let newSetOfChars = "";

  for (let i = 0; i < options.length; i++) {
    newSetOfChars +=
      options.whitelist[generateRandom(0, options.whitelist.length)];
  }

  return newSetOfChars;
};

/**
 *
 * @param {number} min
 * @param {number} max
 * @description Returns random number between min(inclusive) and max(exclusive).
 */
const generateRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max - 1);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
