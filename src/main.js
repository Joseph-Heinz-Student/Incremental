let game = {
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
      mineBarDOM.setAttribute("data-mining", "rock");
      break;
  }
}

mineBar.element.addEventListener("barFill", (e) => {
  if (e.srcElement.dataset.mining && e.srcElement.dataset.mining !== "none") {
    game.resources[e.srcElement.dataset.mining]++;
  }
});

/*
const saveLoop = setInterval(() => {
  save(game);
}, 30000);
*/
const renderLoop = setInterval(() => {
  renderResource(game.resources.rock, "Rock: ", rockCounterDOM);
}, 50);

if (load() != false) game = load();
