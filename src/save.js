const ls = localStorage;

function save(_game) {
  ls.gameSave = JSON.stringify(_game);
  return ls.gameSave;
}

function load(_game) {
  if (
    !ls.defaultGame ||
    ls.defaultGame == null ||
    ls.defaultGame == "undefined"
  ) {
    ls.defaultGame = JSON.stringify(_game);
  }

  // checks to see if there is a valid localStorage save
  if (ls.gameSave != null && ls.gameSave != "undefined") {
    // copies the localStorage save
    let gameClone = JSON.parse(ls.gameSave);
    // iterates and adds new resources to account for updates
    // so saves don't break every update
    for (resource in _game.resources) {
      if (
        gameClone.resources[resource] == null ||
        gameClone.resources[resource] == "undefined"
      ) {
        gameClone.resources[resource] = _game.resources[resource];
      }
    }

    // if theres a general new thing from an update
    for (let thing in _game) {
      if (gameClone[thing] == null || gameClone[thing] == "undefined") {
        gameClone[thing] = _game[thing];
      }
    }

    for (let upgrade in _game.upgrades) {
      if (
        gameClone.upgrades[upgrade] == null ||
        gameClone.upgrades[upgrade] == "undefined"
      ) {
        gameClone.upgrades[upgrade] = _game.upgrades[upgrade];
      }
    }

    for (let item in _game.store) {
      if (
        gameClone.store[item] == null ||
        gameClone.store[item] == "undefined"
      ) {
        gameClone.store[item] = _game.store[item];
      }
    }

    // set the game to the updated storage version
    _game = gameClone;
  } else {
    return false;
  }

  return _game;
}

function reset(_game) {
  if (confirm("Are you sure you want to reset all progress?")) {
    _game = JSON.parse(ls.defaultGame);
  }
  save(_game);
  window.location = window.location;
  return _game;
}
