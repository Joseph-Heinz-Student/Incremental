class ProgressBar {
  constructor(value, max, element) {
    this.value = value;
    this.max = max;
    this.element = element;
    this.active = false;
  }

  setWidth() {
    this.element.style.width = `${(this.value / this.max) * 100}%`;
    //console.log(this.element.style.width);

    return this.element.style.width;
  }

  setValue(input) {
    this.value = clamp(input, 0, this.max);
    return this.value;
  }

  setMax(input) {
    this.max = input;
    if (this.value > this.max) {
      this.value = this.max;
    }
    return this.max;
  }
}

function progressBar(time, bar) {
  if (bar.active) return;

  bar.active = true;

  let interval = 50;
  //let oppInterval = 1000 / interval;
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
      bar.setValue(bar.max);
      bar.setWidth();
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
        `Time elapsed: ${elapsed}\n${(
          abs((time - elapsed) / ((time + elapsed) / 2)) * 100
        )
          .toString()
          .substring(0, 6)}% Variance`
      );
      bar.active = false;
      bar.element.dispatchEvent(barFill);
    }
  }, interval);
}

let mineBar = new ProgressBar(100, 100, mineBarDOM);
