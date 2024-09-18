const ls = localStorage;

function save(_game) {
  ls.gameSave = JSON.stringify(_game);
  return ls.gameSave;
}

function load(_game) {
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

    // set the game to the updated storage version
    _game = gameClone;
  } else {
    return false;
  }

  return _game;
}
