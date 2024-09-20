function addResult(inputAsString, output) {
    const outputAsString =
      output instanceof Array ? `[${output.join(", ")}]` : JSON.stringify(output).toString();
    const inputLogElement = document.createElement("div");
    const outputLogElement = document.createElement("div");
  
    inputLogElement.classList.add("console-input-log");
    outputLogElement.classList.add("console-output-log");
  
    inputLogElement.textContent = `> ${inputAsString}`;
    outputLogElement.textContent = outputAsString;
  
    historyContainer.append(inputLogElement, outputLogElement);
  }
  
  consoleInput.addEventListener("keyup", (e) => {
    const code = consoleInput.value.trim();
  
    if (code.length === 0) {
      return;
    }
  
    if (e.key === "Enter") {
      try {
        addResult(code, eval(code));
      } catch (err) {
        addResult(code, err);
      }
  
      consoleInput.value = "";
      historyContainer.scrollTop = historyContainer.scrollHeight;
    }
  });
  
  hotkeys("alt+shift+a", function(event, handler){
      if(consoleDOM.style.display == "flex"){
          consoleDOM.style.display = "none";
      }else{
          consoleDOM.style.display = "flex";
      }
      
  })