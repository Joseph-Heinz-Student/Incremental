let game = {
  resources: {
    rock: 0,
    iron: 0,
  },
};

function execAfter(time, func) {
  let waiter = setTimeout(() => {
    func();
    clearTimeout(waiter);
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
    case "iron":
      time = 10;
      progressBar(time, mineBar);
      mineBarDOM.setAttribute("data-mining", "iron");
      break;
  }
}

/*
  Mine bar waits to receive an event emitted when the progress 
  bar is done filling up

  it then takes the stored information in the mine bar for the
  current mining resource and trys to add to the player's resources

  this fixes issues with setinterval not perfectly lining up with a timer
  to receieve resources
*/
mineBar.element.addEventListener("barFill", (e) => {
  if (e.srcElement.dataset.mining && e.srcElement.dataset.mining !== "none") {
    /* 
    this fixes floating point errors by using decimaljs
    it creates a new Decimal from the current resources, then adds a random int
    that is then divided by 100 to make it a decimal, which is then cut to 2 decimal
    places, hopefully fully preventing floating point errors
    */
    let _new = new Decimal(game.resources[e.srcElement.dataset.mining])
      .plus(new Decimal(chance.integer({ min: 5, max: 100 })).div(100))
      .toDecimalPlaces(2);
    // then we add a javascript number version of the new resource to the player
    game.resources[e.srcElement.dataset.mining] = Number(_new);
  }
});

/*
const saveLoop = setInterval(() => {
  save(game);
}, 30000);
*/
const renderLoop = setInterval(() => {
  renderResource(game.resources.rock, "Rock: ", rockCounterDOM);
  renderResource(game.resources.iron, "Iron: ", ironCounterDOM);
}, 50);

if (load(game) != false) game = load(game);
