const ls = localStorage;

function save (_game) {
    ls.gameSave = JSON.stringify(_game);
    return ls.gameSave;
}

function load (_game) {
    return
}