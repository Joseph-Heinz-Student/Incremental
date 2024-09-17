const ls = localStorage;

function save(_game) {
  ls.gameSave = JSON.stringify(_game);
  return ls.gameSave;
}

function load(_game) {
  if (ls.gameSave != null && ls.gameSave != "undefined") {
    let gameClone = JSON.parse(ls.gameSave);
    for (resource in gameClone.resources) {
        if (gameClone.resources[resource] == null) {
            gameClone.resources[resource] = _game.resources[resource];
        }
    }

    _game = gameClone;

    

  }

  return _game;
}
