let market = {
  trades: [
    {
      input: "rock",
      output: "iron",
      rate: "2:1",
    },
    {
      input: "iron",
      output: "rock",
      rate: "1:2",
    },
  ],
  sells: [
    {
      input: "rock",
      output: 10,
    },
    {
      input: "iron",
      output: 25,
    },
  ],
  unlocked: false,
};

let history = {
  trades: [],
  sells: [[], []],
};

// create a dataset from an input of history
function createDataSet(_input, _index) {
  let _default = {};
  _default.label = capitalizeFirstLetter(_input.input);
  _default.data = history.sells[_index].map((row) => row[1]);
  return _default;
}

// put all the datasets into one for the chart
function createSets() {
  let sets = [];
  for (let sell in market.sells) {
    sets.push(createDataSet(market.sells[sell], sell));
  }
  return sets;
}

const marketChart = new Chart(marketChartCanvasDOM, {
  type: "line",
  data: {
    labels: history.sells.map((row) => row[0]),
    datasets: createSets(),
  },
  options: {
    responsive: true,
    animation: {
      duration: 0, // Disable animation to immediately reflect the new data
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  },
});
Chart.defaults.borderColor = "#36A2EB";
Chart.defaults.color = "aliceblue";

let currentModes = {
  trades: [],
  sells: ["stable", "stable"],
};

let modes = ["slowRise", "slowFall", "stable", "fastRise", "fastFall"];
// ranges for the different modes
let modeMults = {
  slowRise: { min: 0.1, max: 5 },
  slowFall: { min: -0.1, max: -5 },
  stable: { min: -2.5, max: 2.5 },
  fastRise: { min: 5, max: 15 },
  fastFall: { min: -5, max: -15 },
};
let chance25 = [true, false, false, false];

let ticks = 0;
const marketTick = setInterval(() => {
  if (!market.unlocked) return false;
  ticks++;
  for (let sell in market.sells) {
    let currentMode = currentModes.sells[sell];
    // update mode if 25% chance
    if (getElemFromArr(chance25)) {
      let newMode = getElemFromArr(modes);
      while (newMode == currentMode) {
        newMode = getElemFromArr(modes);
      }
      //console.log(currentMode, newMode, market.sells[sell].input);
    }
    // get new price
    let hypoNew = Number(
      new Decimal(market.sells[sell].output)
        .add(
          new Decimal(market.sells[sell].output).mul(
            new Decimal(chance.floating(modeMults[currentMode])).div(100)
          )
        )
        .toDecimalPlaces(2)
    );
    // keeps the price from getting too low
    hypoNew = max(
      hypoNew,
      Number(
        new Decimal(JSON.parse(ls.defaultMarket).sells[sell].output)
          .div(2)
          .toDecimalPlaces(2)
      )
    );
    // update history
    history.sells[sell].push([ticks, hypoNew]);
    market.sells[sell].output = hypoNew;
    updateMarket();
    //console.log(hypoNew, market.sells[sell]);
  }
  //console.log(history.sells.map((sub) => sub));
  for (let _sell in history.sells) {
    // get just the last 10 ticks of data
    if (history.sells[_sell].length >= 10) {
      history.sells[_sell] = history.sells[_sell].slice(-10);
    }

    marketChart.data.labels = history.sells[_sell].map(
      (subArray) => `Tick ${subArray[0]}`
    );
  }
  // update the chart with the new costs from history
  marketChart.data.datasets = createSets();
  marketChart.update();
}, 30_000);
