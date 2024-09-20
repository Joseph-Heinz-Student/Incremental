function renderResource(amount, inner, elem) {
  elem.innerHTML = `${inner}${new numeral(amount).format("0[.]00a")}`;
  return true;
}

function renderTrade(_trade, id) {
  //console.log(_trade, id);
  marketTradeTableDOM.innerHTML += `
    <tr id="market-trade-${id}">
      <td>${capitalizeFirstLetter(_trade.input)}</td>
      <td>${capitalizeFirstLetter(_trade.output)}</td>
      <td>${_trade.rate}</td>
      <td><button onclick=\'trade(${JSON.stringify(
        _trade
      )})\'>Trade</button></td>
    </tr>
  `;
  return _trade;
}

function renderSell(_sell, id) {
  marketSellTableDOM.innerHTML += `
    <tr id="market-sell-${id}">
      <td>${capitalizeFirstLetter(_sell.input)}</td>
      <td>${_sell.output.toString()}</td>
      <td><button onclick=\'sell(${JSON.stringify(
        _sell
      )},${id})\'>Sell</button></td>
      <td><input type="number" placeholder="1" id="market-sell-${id}-input"></td>
    </tr>
  `;
  return _sell;
}

function renderUpgrade(_upgrade) {
  upgradesDOM.innerHTML += `
    <div id="upgrade-${_upgrade.id}">
      <strong>${_upgrade.name} x${new numeral(_upgrade.amount).format(
    "0[.]00a"
  )} - ${new numeral(_upgrade.cost).format("0[.]00a")}</strong><br>
      <span>${_upgrade.flavor}</span><br>
      <div class="upgrade-buttons-wrapper">
        <button onclick=\'buyUpgrade(${JSON.stringify(
          _upgrade
        )},1)\'>Buy 1</button>
      </div>
    </div>
  `;

  return _upgrade;
}

// not important
function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "flex";
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// runs and writes the save timer code
let timerStart = 0;
function writeTimer() {
  if (timerStart >= 30) {
    saveTimerDOM.innerHTML = "Game Saved!";
    setTimeout(() => {
      timerStart = 0;
      save(game);
      writeTimer();
    }, 2500);
  } else {
    saveTimerDOM.innerHTML = `${parseFloat(timerStart).toPrecision(3)}s`;
    timerStart += 0.1;
    setTimeout(writeTimer, 100);
  }
}

writeTimer();
