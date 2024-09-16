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

let mineBar = new ProgressBar(100, 100, document.querySelector("#test"));