let market = {
  trades: [
    {
      input: "rock",
      output: "iron",
      rate: "5:1",
    },
    {
      input: "iron",
      output: "rock",
      rate: "1:5",
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
};

let history = {
  trades: [],
  sells: [[], []],
};

function createDataSet(_input, _index) {
  let _default = {};
  _default.label = capitalizeFirstLetter(_input.input);
  _default.data = history.sells[_index].map((row) => row[1]);
  return _default;
}

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
  },
});
Chart.defaults.borderColor = "#36A2EB";
Chart.defaults.color = "aliceblue";

let currentModes = {
  trades: [],
  sells: ["stable", "stable"],
};

let modes = ["slowRise", "slowFall", "stable", "fastRise", "fastFall"];
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
  ticks++;
  for (let sell in market.sells) {
    let currentMode = currentModes.sells[sell];
    if (getElemFromArr(chance25)) {
      let newMode = getElemFromArr(modes);
      while (newMode == currentMode) {
        newMode = getElemFromArr(modes);
      }
      console.log(currentMode, newMode, market.sells[sell].input);
    }
    let hypoNew = Number(
      new Decimal(market.sells[sell].output)
        .add(
          new Decimal(market.sells[sell].output).mul(
            new Decimal(chance.floating(modeMults[currentMode])).div(100)
          )
        )
        .toDecimalPlaces(2)
    );
    history.sells[sell].push([ticks, hypoNew]);
    market.sells[sell].output = hypoNew;
    updateMarket();
    console.log(hypoNew, market.sells[sell]);
  }
  console.log(history.sells.map((sub) => sub));
  for (let _sell in history.sells) {
    marketChart.data.labels = history.sells[_sell].map((subArray) => [
      subArray[0],
    ]);
  }
  marketChart.data.datasets = createSets();
  marketChart.update();
}, 5000);
