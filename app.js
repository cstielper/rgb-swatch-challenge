let gameSettings = {};

class Settings {
  constructor(numItems, numGuesses) {
    this.numItems = numItems;
    this.numGuesses = numGuesses;
    this.answerIndex = Helpers.createRandomNumber(0, numItems);
    this.answerVal = "";
  }
}

class Controls {
  static StartGame() {
    Colors.generateColors();
  }
}

class Helpers {
  static createRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static validateForm(form) {
    const array = Array.from(form);
    for (let i = 0; i < array.length; i++) {
      if (array[i].classList.contains("input")) {
        if (array[i].value == "") {
          array[i].classList.add("is-danger");
          Messages.generateMessage(
            "Please enter a number",
            "notification is-danger"
          );
          return false;
        } else {
          array[i].classList.remove("is-danger");
        }
      }
    }
    return true;
  }
}

class Colors {
  static generateColors() {
    const colors = [];
    for (let i = 0; i < gameSettings.numItems; i++) {
      let r = Helpers.createRandomNumber(0, 255),
        g = Helpers.createRandomNumber(0, 255),
        b = Helpers.createRandomNumber(0, 255);

      const color = `rgb(${r}, ${g}, ${b})`;
      colors.push(color);
    }

    gameSettings.answerVal = colors[gameSettings.answerIndex];
    UI.buildGrid(colors);
    UI.askQuestion();
  }
}

class Messages {
  static clearMessages() {
    const msgs = document.getElementById("messages");
    msgs.setAttribute("class", "");
    msgs.textContent = "";
  }

  static generateMessage(message, className) {
    const msgs = document.getElementById("messages");
    msgs.setAttribute("class", className);
    msgs.textContent = message;
  }
}

class UI {
  static buildGrid(arr) {
    arr.forEach(val => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.style.backgroundColor = val;
      item.textContent = "?";
      document.getElementById("grid").appendChild(item);
    });
  }

  static askQuestion() {
    const question = document.createElement("h3");
    question.innerHTML = `Click on the color that has a value of: <strong>${
      gameSettings.answerVal
    }</strong>`;
    const node = document.querySelector(".title").parentNode;
    node.appendChild(question);
  }
}

document.getElementById("start-game").addEventListener("click", function(evt) {
  const valid = Helpers.validateForm(document.forms[0]);
  if (valid) {
    const numberItems = parseInt(
      document.getElementById("number-of-items").value
    );
    const numberGuesses = parseInt(
      document.getElementById("number-of-guesses").value
    );
    gameSettings = new Settings(numberItems, numberGuesses);

    document.forms[0].style.display = "none";
    Messages.clearMessages();
    Controls.StartGame();
  }
  evt.preventDefault();
});

document.addEventListener("click", function(evt) {
  if (evt.target.classList.contains("item")) {
    if (gameSettings.numGuesses > 0) {
      if (evt.target.style.backgroundColor == gameSettings.answerVal) {
        alert("You Win!");
      } else {
        gameSettings.numGuesses = gameSettings.numGuesses - 1;
        if (gameSettings.numGuesses == 0) {
          alert("Sorry, out of guesses");
        } else {
          alert(`Try again... ${gameSettings.numGuesses} guess(es) left.`);
        }
      }
    } else {
      alert(`Sorry, out of guesses.`);
    }
  }
});
