let game = {
  resources: {
    rock: 0,
    iron: 0,
  },
  money: 0,
  upgrades: {
    mineSpeed: {
      amount: 0,
      cost: 10,
      modifiers: [
        {
          stat: "speed",
          operation: "add",
          amount: 0.01,
        },
      ],
      name: "Mine Speed",
      unlocked: 1,
      hasun: false,
      flavor: "Upgrade your mining speed",
      id: "mineSpeed",
    },
  },
  store: {
    autoMine: {
      cost: 50,
      hasun: false,
      unlocked: 25,
      name: "Auto Mine",
      flavor: "Auto mine resources",
      id: "autoMine",
      purchased: false,
    },
  },
  stats: {
    speed: 1,
  },
};

const baseStats = {
  speed: 1,
};

function execAfter(time, func) {
  let waiter = setTimeout(() => {
    func();
    clearTimeout(waiter);
  }, time * 1000);
}

function mine(resource) {
  let time = 0;
  calculateStats();
  switch (resource) {
    case "rock":
      time = Number(new Decimal(5).div(game.stats.speed).toDecimalPlaces(3));
      progressBar(time, mineBar);
      mineBarDOM.setAttribute("data-mining", "rock");
      break;
    case "iron":
      time = Number(new Decimal(10).div(game.stats.speed).toDecimalPlaces(3));
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

    if (autoMineCheckboxDOM.checked) {
      mine(mineSelectDOM.value);
    }
  }
});

/*
const saveLoop = setInterval(() => {
  save(game);
}, 30000);
*/
const renderLoop = setInterval(() => {
  renderResource(game.money, "Money: $", moneyCounterDOM);
  renderResource(game.resources.rock, "🜘 Rock: ", rockCounterDOM);
  renderResource(game.resources.iron, "🜜 Iron: ", ironCounterDOM);
}, 50);

function trade(_trade) {
  _trade.rate = _trade.rate.split(":");

  /*
  a lot here
  checks to see if the player has enough of the input
  resource to trade, but makes sure it exists
  */
  if (
    game.resources[_trade.input] >= _trade.rate[0] &&
    game.resources[_trade.input] != null &&
    game.resources[_trade.input] != "undefined"
  ) {
    game.resources[_trade.input] = Number(
      new Decimal(game.resources[_trade.input]).sub(_trade.rate[0])
    );
    game.resources[_trade.output] = Number(
      new Decimal(game.resources[_trade.output]).add(_trade.rate[1])
    );
  } else {
    alert(`Not enough ${capitalizeFirstLetter(_trade.input)}`);
  }

  //console.log(_trade);
  return _trade;
}

function sell(_sell, id) {
  if (
    game.resources[_sell.input] >=
    document.querySelector(`#market-sell-${id}-input`).value
  ) {
    game.resources[_sell.input] -= Number(
      new Decimal(
        document.querySelector(`#market-sell-${id}-input`).value
      ).toDecimalPlaces(2)
    );
    game.money += Number(
      new Decimal(document.querySelector(`#market-sell-${id}-input`).value).mul(
        _sell.output
      )
    );
  } else {
    alert(`Not enough ${capitalizeFirstLetter(_sell.input)}`);
  }
  return true;
}

function updateUpgrades() {
  upgradesDOM.innerHTML = "";
  for (let upgrade in game.upgrades) {
    if (game.upgrades[upgrade].hasun) {
      renderUpgrade(game.upgrades[upgrade]);
    }
  }
  calculateStats();
  return true;
}

function buyUpgrade(_upgrade, amount) {
  if (game.money >= Number(new Decimal(_upgrade.cost).mul(amount))) {
    game.money =
      Number(new Decimal(game.money).toDecimalPlaces(2)) -
      Number(new Decimal(_upgrade.cost).mul(amount));
    game.upgrades[_upgrade.id].amount += amount;
    game.upgrades[_upgrade.id].cost = Number(
      new Decimal(game.upgrades[_upgrade.id].cost).mul(1.25).toDecimalPlaces(2)
    );
    updateUpgrades();
  } else {
    alert("Not enough money");
  }

  return true;
}

function runStoreFunctions() {
  checkAutoMine(game);
}

function updateStore() {
  storeDOM.innerHTML = "";
  for (let item in game.store) {
    if (game.store[item].hasun) {
      renderStore(game.store[item]);
    }
  }
  runStoreFunctions();
  return true;
}

function buyStoreItem(_item) {
  if (
    Number(new Decimal(game.money).toDecimalPlaces(2)) >=
      Number(new Decimal(_item.cost)) &&
    !_item.purchased
  ) {
    game.money =
      Number(new Decimal(game.money).toDecimalPlaces(2)) -
      Number(new Decimal(_item.cost));
    game.store[_item.id].purchased = true;
    updateStore();
  }
  return true;
}

function calculateStats() {
  for (let _upgrade in game.upgrades) {
    let _modifiers = game.upgrades[_upgrade].modifiers;
    for (let _mod in _modifiers) {
      let _statName = game.upgrades[_upgrade].modifiers[_mod].stat;
      let _op = _modifiers[_mod].operation;
      switch (_op) {
        case "add":
          game.stats[_statName] = Number(
            new Decimal(baseStats[_statName]).add(
              new Decimal(_modifiers[_mod].amount).mul(
                game.upgrades[_upgrade].amount
              )
            )
          );
          break;
      }
    }
  }
}

for (let _trade in market.trades) {
  renderTrade(market.trades[_trade], _trade);
}

for (let _sell in market.sells) {
  renderSell(market.sells[_sell], _sell);
}

if (load(game) != false) game = load(game);

const checkUpgradeUnlock = setInterval(() => {
  for (let upgrade in game.upgrades) {
    if (
      !game.upgrades[upgrade].hasun &&
      game.upgrades[upgrade].unlocked <= game.money
    ) {
      game.upgrades[upgrade].hasun = true;
      updateUpgrades();
    }
  }
}, 50);

const checkStoreUnlock = setInterval(() => {
  for (let item in game.store) {
    if (
      !game.store[item].hasun &&
      game.store[item].unlocked <= game.money &&
      !game.store[item].purchased
    ) {
      game.store[item].hasun = true;
      updateStore();
    }
  }
}, 50);

updateUpgrades();
updateStore();
