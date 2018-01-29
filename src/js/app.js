// Store UI elements and classes
const UIElements = {
  header: document.querySelector('header'),
  msgPane: document.getElementById('messages'),
  grid: document.getElementById('grid'),
  gameSettingsForm: document.forms[name = 'game-settings'],
  cssClasses: {
    tile: 'tile',
    active: 'active',
    inactive: 'inactive',
    error: 'danger',
    warn: 'warn',
    success: 'success'
  }
};

// Store game mode options
const gameModeOpts = {
  easy: { items: 16, guesses: 12 },
  medium: { items: 16, guesses: 8 },
  hard: { items: 16, guesses: 4 }
};

// Create/update game settings
let gameSettings = {};
class Settings {
  constructor(numItems, numGuesses, answer) {
    this.items = numItems;
    this.guesses = numGuesses;
    this.answer = answer;
  }

  removeGuess() {
    this.guesses -= 1;
  }
}

// Game controls
class Controls {
  static startGame(level) {
    if (gameModeOpts.hasOwnProperty(level)) {
      // Create the colors for the game
      const colors = Colors.generate(gameModeOpts[level].items);

      // Update global game settings
      gameSettings = new Settings(
        gameModeOpts[level].items,
        gameModeOpts[level].guesses,
        colors[Helpers.createRandomNumber(0, gameModeOpts[level].items)]
      );

      // Build the UI
      UI.buildGrid(colors);
      UI.askQuestion();
      UI.showHideForm(
        UIElements.gameSettingsForm,
        UIElements.cssClasses.inactive
      );
    }
  }

  static CheckTiles(evt) {
    if (evt.target.classList.contains(UIElements.cssClasses.tile)) {
      if (gameSettings.guesses > 0) {
        if (evt.target.style.backgroundColor == gameSettings.answer) {
          Messages.generate(
            'You Win!',
            UIElements.cssClasses.active + ' ' + UIElements.cssClasses.success
          );
          UI.disableBoard();
          UI.gameOver();
        } else {
          gameSettings.removeGuess();
          if (gameSettings.guesses == 0) {
            Messages.generate(
              'Sorry, out of guesses. Game over!',
              UIElements.cssClasses.active + ' ' + UIElements.cssClasses.error
            );
            UI.disableBoard();
            UI.revealWinner();
            UI.gameOver();
          } else {
            evt.target.setAttribute('disabled', true);
            Messages.generate(
              `Try again... ${gameSettings.guesses} guess(es) left.`,
              UIElements.cssClasses.active + ' ' + UIElements.cssClasses.warn
            );
          }
        }
      }
    }
  }

  static resetGame(item) {
    UIElements.grid.innerHTML = '';
    UI.showHideForm(UIElements.gameSettingsForm, '');
    UIElements.header.lastChild.remove();
    Messages.clear();
    item.classList.remove(UIElements.cssClasses.active);
  }
}

// Helper functions
class Helpers {
  static createRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

// Colors
class Colors {
  static generate(numColors) {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      let r = Helpers.createRandomNumber(0, 255),
        g = Helpers.createRandomNumber(0, 255),
        b = Helpers.createRandomNumber(0, 255);

      const color = `rgb(${r}, ${g}, ${b})`;
      colors.push(color);
    }
    return colors;
  }
}

// Messaging
class Messages {
  static clear() {
    UIElements.msgPane.setAttribute('class', '');
    UIElements.msgPane.textContent = '';
  }

  static generate(message, className) {
    UIElements.msgPane.setAttribute('class', className);
    UIElements.msgPane.textContent = message;
  }
}

// UI
class UI {
  static buildGrid(array) {
    array.forEach(val => {
      const item = document.createElement('button');
      item.classList.add(UIElements.cssClasses.tile);
      item.style.backgroundColor = val;
      UIElements.grid.appendChild(item);
    });
  }

  static askQuestion() {
    const question = document.createElement('div');
    question.setAttribute('class', 'game-question');
    question.innerHTML = `Click on the color that has a value of: <span>${gameSettings.answer}</span>`;
    UIElements.header.appendChild(question);
    this.showTotalGuesses();
  }

  static showTotalGuesses() {
    UIElements.msgPane.textContent = `Make a selection. You have ${gameSettings.guesses} guesses.`;
    UIElements.msgPane.setAttribute('class', UIElements.cssClasses.active);
  }

  static showHideForm(form, className) {
    form.setAttribute('class', className);
  }

  static disableBoard() {
    const items = document.querySelectorAll(`.${UIElements.cssClasses.tile}`);
    items.forEach(item => {
      if (item.style.backgroundColor != gameSettings.answer) {
        item.setAttribute('disabled', true);
      }
    });
  }

  static revealWinner() {
    const items = document.querySelectorAll(`.${UIElements.cssClasses.tile}`);
    items.forEach(item => {
      if (item.style.backgroundColor == gameSettings.answer) {
        item.classList.add('winner');
      }
    });
  }

  static gameOver() {
    document.getElementById('play-again').classList.add(
      UIElements.cssClasses.active
    );
  }
}

// Event Listeners
const lvlBtns = document.querySelectorAll('.lvl-select');
lvlBtns.forEach(item => {
  item.addEventListener('click', function(evt) {
    Controls.startGame(this.value);
    evt.preventDefault();
  });
});

UIElements.grid.addEventListener('click', function(evt) {
  Controls.CheckTiles(evt);
  evt.preventDefault();
});

document.getElementById('play-again').addEventListener('click', function() {
  Controls.resetGame(this);
});
