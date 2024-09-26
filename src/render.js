function renderResource(amount, inner, elem) {
  elem.innerHTML = `${inner}${new numeral(
    new Decimal(amount).toDecimalPlaces(2)
  ).format("0[.]00a")}`;
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
  )} <br> Cost: \$${new numeral(_upgrade.cost).format("0[.]00a")}</strong><br>
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

function renderStore(_item) {
  if (_item.purchased) {
    return false;
  }
  storeDOM.innerHTML += `
    <div id="store-item-${_item.id}">
      <strong>${_item.name} - \$${_item.cost}</strong>
      <span>${_item.flavor}</span>
      <button onclick=\'buyStoreItem(${JSON.stringify(
        _item
      )})\'>Purchase</button>
    </div>
  `;
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
    save(game, market);
    setTimeout(() => {
      timerStart = 0;
      writeTimer();
    }, 2500);
  } else {
    saveTimerDOM.innerHTML = `${new numeral(parseFloat(timerStart)).format(
      "0.0"
    )}s`;
    timerStart += 0.1;
    setTimeout(writeTimer, 100);
  }
}

const renderResourcesMarket = setInterval(() => {
  marketResourcesDOM.innerHTML = "";
  for (let resource in game.resources) {
    marketResourcesDOM.innerHTML += `${capitalizeFirstLetter(
      resource
    )}: ${new numeral(
      new Decimal(game.resources[resource]).toDecimalPlaces(2)
    ).format("0[.]00a")} | `;
  }
}, 50);

function renderStat(_stat, icon, name) {
  statsDOM.innerHTML += `
    <span>${icon} ${name}: ${new numeral(new Decimal(_stat)).format(
    "0[.]00%"
  )}</span>
  `;
}

function renderDatasetSwitches(chart) {
  datasetButtonsDOM.innerHTML = "";
  let datasets = chart.data.datasets;
  for (let dataset in datasets) {
    let divElement = document.createElement("div");
    divElement.id = `dataset-switch-${dataset}`;
    divElement.classList.add("dataset-switch");
    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = `dataset-switch-input-${dataset}`;
    inputElement.checked = true;
    chart.data.datasets[dataset].hidden = false;
    inputElement.onchange = function () {
      console.log(chart.data.datasets[dataset])
      if(
      chart.data.datasets[dataset].hidden){

        chart.data.datasets[dataset].hidden = false;
      } else {
        chart.data.datasets[dataset].hidden = true;
      }
      chart.update();
    };
    let textName = document.createElement("span");
    textName.textContent = chart.data.datasets[dataset].label;
    divElement.appendChild(inputElement);
    divElement.appendChild(textName);
    datasetButtonsDOM.appendChild(divElement);
  }
  chart.update();
  return true;
}

writeTimer();
