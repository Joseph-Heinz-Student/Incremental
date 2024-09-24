const clamp = (value, min, max) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  }
  return value;
};

const abs = (value) => {
  if (value < 0) {
    return value * -1;
  }
  return value;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getElemFromArr(arr) {
  let elem = arr[Math.floor(Math.random() * arr.length)];
  return elem;
}

function max(num1, num2) {
  if (num1 > num2) return num1;
  if (num1 < num2) return num2;
}

/*
Events
*/

// the event that triggers when a bar gets filled
const barFill = new CustomEvent("barFill", {
  detail: {
    resource: "e",
  },
});
