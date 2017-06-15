'use strict';
const someArr = [3, 7, 8, 45, 70, 312, 768, 900];
console.log(search(someArr, 3));
console.log(search(someArr, 7));
console.log(search(someArr, 8));
console.log(search(someArr, 45));
console.log(search(someArr, 70));
console.log(search(someArr, 312));
console.log(search(someArr, 768));
console.log(search(someArr, 900));
// console.log(search(someArr, 1200));

function search(arr, value) {
  let result;
  let i = Math.floor(arr.length / 2);
  while (arr[i] !== value) {
    if (value > arr[i]) {
      if (i === (arr.length - 2)) {
        i += 1;
        break;
      }
      i = i + Math.ceil(i / 2);
    } else if (value < arr[i]) {
      i = Math.floor(i / 2);
    }
  }
  result = arr[i];
  return result;
}
