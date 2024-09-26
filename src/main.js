let devMode = true;

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
    moreMineLuck: {
      amount: 0,
      cost: 100,
      modifiers: [
        {
          stat: "miningLuck",
          operation: "add",
          amount: 0.025,
        },
      ],
      name: "More Mining Luck",
      unlocked: 50,
      hasun: false,
      flavor: "Upgrade your mining luck",
      id: "moreMineLuck",
    },
  },
  store: {
    pickaxe: {
      cost: 0,
      hasun: true,
      unlocked: 0,
      name: "Pickaxe",
      flavor: "Allows you to mine rock",
      id: "pickaxe",
      purchased: false,
    },
    rockPickaxe: {
      cost: 100,
      hasun: false,
      unlocked: 50,
      name: "Rock Pickaxe",
      flavor: "Allows you to mine iron",
      id: "rockPickaxe",
      purchased: false,
    },
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
    miningLuck: 1,
  },
};

const baseStats = {
  speed: 1,
  miningLuck: 1,
};

const statIcons = {
  speed: "&#10023;",
  miningLuck: "&#9831;",
};

const minerOres = {
  pickaxe: "rock",
  rockPickaxe: "iron",
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
    let _add = new Decimal(chance.integer({ min: 5, max: 100 }))
      .mul(game.stats.miningLuck)
      .div(100)
      .toDecimalPlaces(2);
    let _new = new Decimal(game.resources[e.srcElement.dataset.mining])
      .plus(_add)
      .toDecimalPlaces(2);
    // then we add a javascript number version of the new resource to the player
    game.resources[e.srcElement.dataset.mining] = Number(_new);

    const x = e.offsetX;
    const y = e.offsetY;

    const div = document.createElement("div");
    div.innerHTML = `+${Number(_add)}`;
    div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;`;
    miningPanelDOM.appendChild(div);
    div.classList.add("fade-up");

    execAfter(0.8, () => {
      div.remove();
    });

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
  statsDOM.innerHTML = "";
  for (let _stat in game.stats) {
    renderStat(
      game.stats[_stat],
      statIcons[_stat],
      capitalizeFirstLetter(_stat)
    );
  }
  if (!market.unlocked) {
    marketButton.textContent = "🔒 Market";
    marketButton.disabled = true;
    if (game.resources.rock >= 1) {
      market.unlocked = true;
      marketButton.disabled = false;
    }
  } else {
    marketButton.textContent = "Market";
  }
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

// runs through the market sell listings and checks if the
// arg is the current item
// if so, it returns the id
function getItemFromMarketSell(_item) {
  for (let item in market.sells) {
    if (
      market.sells[item].input == _item.input &&
      market.sells[item].output == _item.output
    ) {
      return [item, _item];
    }
  }
  return false;
}

function sell(_sell, id) {
  if (
    game.resources[_sell.input] >=
    document.querySelector(`#market-sell-${id}-input`).value
  ) {
    // remove items from player
    game.resources[_sell.input] -= Number(
      new Decimal(
        document.querySelector(`#market-sell-${id}-input`).value
      ).toDecimalPlaces(2)
    );
    // give player money
    game.money += Number(
      new Decimal(document.querySelector(`#market-sell-${id}-input`).value).mul(
        _sell.output
      )
    );
    // take money away from price - supply/demand
    let sellId = getItemFromMarketSell(_sell)[0];
    console.log(sellId);
    market.sells[sellId].output = Number(
      new Decimal(market.sells[sellId].output)
        .sub(
          new Decimal(0.005)
            .mul(document.querySelector(`#market-sell-${id}-input`).value)
            .toDecimalPlaces(2)
        )
        .toDecimalPlaces(2)
    );
    updateMarket();
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

function checkForMiner(_miner) {
  let item = minerOres[_miner.id];
  let child = null;
  for (let _child of mineSelectDOM.children) {
    if (_child.value == item) {
      child = _child;
    }
  }
  if (!_miner.purchased) {
    document.querySelector(`#${item}-counter`).style.display = "none";
    child.style.display = "none";
  } else {
    document.querySelector(`#${item}-counter`).style.display = "block";
    child.style.display = "block";
  }
  return true;
}

function runStoreFunctions() {
  checkAutoMine(game);
  for (let _miner in minerOres) {
    if (game.store[_miner]) {
      checkForMiner(game.store[_miner]);
    }
  }
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

function updateMarket() {
  marketSellTableDOM.innerHTML = "";
  marketTradeTableDOM.innerHTML = "";
  for (let _trade in market.trades) {
    renderTrade(market.trades[_trade], _trade);
  }

  for (let _sell in market.sells) {
    renderSell(market.sells[_sell], _sell);
  }
  renderDatasetSwitches(marketChart);
}

if (load(game) != false) game = load(game);
if (loadMarket(market) != false) market = loadMarket(market);

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

if (Notification.permission === "granted" && !devMode) {
  const noti = new Notification("asdf");
} else if (Notification.permission !== "denied" && !devMode) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const notification = new Notification("Hi there, test noti");
    }
  });
}

saveButtonDOM.addEventListener("click", () => {
  save(game, market);
});

updateUpgrades();
updateStore();
updateMarket();
