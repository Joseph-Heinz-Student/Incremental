const game = {
  resources: {
    rock: 0,
  },
};

function mine(resource) {
  let time = 0;
  switch (resource) {
    case "rock":
      time = 5;
      progressBar(time, mineBar);
      break
  }
}
