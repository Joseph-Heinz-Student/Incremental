const game = {
  resources: {
    rock: 0,
  },
};

function execAfter(time, func) {
  let waiter = setTimeout(() => {
    func();
  }, time * 1000);
}

function mine(resource) {
  let time = 0;
  switch (resource) {
    case "rock":
      time = 5;
      progressBar(time, mineBar);
      execAfter(time, () => {
        game.resources.rock++;
        renderResource(game.resources.rock, "Rock: ", rockCounterDOM);
      });
      break;
  }
}

const saveLoop = setInterval(() => {
  save(game);
}, 30000)