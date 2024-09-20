function checkAutoMine(_game) {
  if (_game.store.autoMine.purchased) {
    autoMineDOM.style.display = "inline-flex";
    return true;
  } else {
    autoMineDOM.style.display = "none";
    return false;
  }
}
