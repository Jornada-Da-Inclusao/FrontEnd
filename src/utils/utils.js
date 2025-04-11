/**
 * Randomize an array
 * @param {any[]} arr - Array to be randomized
 * @returns {any[]}
 */
export function randomizeArr(arr) {
  let currIndex = arr.length;

  while (currIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currIndex);
    currIndex--;

    [arr[currIndex], arr[randomIndex]] = [arr[randomIndex], arr[currIndex]];
  }

  return arr;
}

/**
 * Generate a random number limited to num
 * @param {Number} num - Limit
 * @returns {Number}
 */
export function randomizeNum(num) {
  return Math.floor(Math.random() * num);
}
