const game = {
  resources: {
    rock: 0,
  },
};

function progressBar(time, bar) {
  if (bar.active) return;

  bar.active = true;

  let interval = 50;
  let runs = 0;

  bar.setMax(time);
  bar.setValue(0);
  bar.setWidth();

  let dtime = Date.now();

  let intervalLoop = setInterval(() => {
    // move the bar 1/20 of 1s worth of width
    // not sure why i have to divide by time again
    // maybe ill figure it out eventually
    bar.setValue(((time / 20) * runs) / time);
    bar.setWidth();

    runs++;
    //console.log(runs, (time / 20) * (runs - 1), bar.value);

    if (runs >= time * 20) {
      clearInterval(intervalLoop);
      let now = Date.now();

      let elapsed = (now - dtime) / 1000;


      /* 
         this console log is doing a lot
         all of the math is just finding the percentage difference between the 
         inputted time and the actual elapsed time

         | time - elapsed |
         ------------------   x   100  =   Percent Difference
         [ time + elapsed ]
         [----------------]
         [       2        ]
        it gets converted to a substring so its not 20 characters long
      */
      console.log(
        `Time elapsed: ${elapsed}\n${
          ( abs((time - elapsed) / ((time + elapsed) / 2)) * 100 ).toString().substring(0,6)
        }% Variance`
      );
      bar.active = false;
    }
  }, interval);
}

function mine(resource) {
  switch (resource) {
    case "rock":
      let time = 10;
      progressBar(time, mineBar);
      break;
  }
}
