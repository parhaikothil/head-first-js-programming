// MVC
// Model - keeps track of the ships, where they are, if they've been hit, and if they've been sunk
// View - updates display w/ hits, missed and messages to user
// Controller - glues them together, gets user's input and executes game's logic

// object-oriented design

var view = {
    // this method takes a string and displays it in message window
    displayMessage: function(msg) {
        // first, get html element by id:
        var messageArea = document.getElementById('messageArea');
        // second, update text content to this element:
        messageArea.innerHTML = msg; // content is the function argument
    },

    // this method displays 'miss' when user's input is wrong
    displayMiss: function(location) {
        // add class="miss" to the cell after getting user's guess for location:
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss');
    },

    // this method displays 'ship' when user's input is right
    displayHit: function(location) {
        // add class="hit" to the cell:
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit');
    }

};

// testing View:
// view.displayMessage('Uh oh!');
// view.displayHit('00'); // A0
// view.displayMiss('34'); // D4


var model = {
    // properties:
    boardSize: 7, // size of the grid for the board
    numShips: 3, // # of ships in the game (we can change it later, e.g. next level)
    shipsSunk: 0,
    shipLength: 3,

    // ship locations and hits HARDCODED for testing:
    ships: [{ locations: ['31', '41', '51'], hits: ['', '', ''] },
            { locations: ['14', '24', '34'], hits: ['', 'hit', ''] },
            { locations: ['00', '01', '02'], hits: ['hit', '', ''] },],

    // //method to fire on a ship and figure out if 'hit' or 'miss':
    fire: function(guess) {
        for (var i=0; i < this.numShips; i++) {
            var ship = this.ships[i];
            // we could write a loop to go through 'locations' but .indexOf() is easier:
            var index = ship.locations.indexOf(guess); // it returns the index of the guess value
            // and if the value is not in the array, it returns '-1'

            if(ship.hits[index] === 'hit') {
                view.displayMessage('Oops, you already hit that location!');
                return true;
            } else if (index >= 0) { // if the value of user's guess was found in the array
                // we have a HIT!
                ship.hits[index] = 'hit'; // adds 'hit' to hits []
                console.log('HIT!');
                view.displayHit(guess); // updates View
                view.displayMessage('You hit my ship!'); // updates View

                // our isSunk() method here:
                if (this.isSunk(ship)) { // if isSunk() is true:
                    view.displayMessage('You sank my battleship!'); // updates View
                    this.shipsSunk++; // updates # of sunk ships above
                }
                return true;
            }
        }
        console.log('MISSED!');
        view.displayMiss(guess); // updates View
        view.displayMessage('Sorry, you missed!'); // updates View
        return false;
    },

    // this method will check if we have 3 hits and return true or false:
    // this method will then be used in fire() method above.
    isSunk: function(ship) {
        for (var i=0; i<this.numShips; i++) {
            if (ship.hits[i] !== 'hit') { // if this spot doesn't have 'hit' value,
                return false;
            }
        }
        return true; // otherwise, all spots = 'hit' and ship is sunk
    } // now we can use this method in our fire()
};


// testing Model:
// model.fire('31');
// console.log(model.shipsSunk);
// model.fire('41');
// console.log(model.shipsSunk);
// model.fire('51');
// console.log(model.shipsSunk);


// -----Controller--------
// gets a guess, process it and passes it to Model
// also keeps track of current # of guesses and player's progress
// updates Model with latest guess
// determines if games is over

var controller = {
    // properties:
    guesses: 0,

    // methods:
    // focus on: evaluate guess to make sure it's valid, process, then get it to Model
    processGuess: function(guess) { // guess as 'A3' form
        // evaluate guess for validity:
        var location = parseGuess(guess); // using helper function parseGuess()
        if (location) { // if location = string --> true, if location = null --> false
            this.guesses++; // update # of current guesses
            var hit = model.fire(location);
            // also check if the game is over (all ships are sunk):
            // if hit = true AND shipsSunk = numShips:
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage('You won!  All my battleships are sunk in ' + this.guesses + ' guesses!');
            }
        }

    }
};

// helper function to be used by the controller.processGuess()
function parseGuess(guess) {

    // helper array:
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

    // checking if guess is valid:
    if (guess === null || guess.length !== 2) {
        alert('Oops! Please enter a VALID guess: a letter and a number on the board.');
    } else {
        firstChar = guess.charAt(0); // grabs 1st character of guess
        var row = alphabet.indexOf(firstChar); // get a # (0-6) that corresponds to the letter
        var column = guess.charAt(1); // grabs 2nd character of guess

        // checks if guess is a number:
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board!");
        } else if ( row<0 || row >= model.boardSize || column<0 || column >= model.boardSize ) {
            alert("Oops, that's off the board!");
            // we're NOT using strict comparison operators b/c we need to convert string into number!
            // model.boardSize is a dynamic number!  No hardcoding!
        } else { // if all checks out:
            return row + column; // return 'guess' as 1 string
        }
    }
    return null; // if we get here, something failed one of the tests
}

// testing parseGuess():
console.log(parseGuess('A0')); // 00
// console.log(parseGuess('kf')); // null
// console.log(parseGuess('59')); // null
// console.log(parseGuess('B8')); // null
// console.log(parseGuess('F9')); // null
console.log(parseGuess('D6')); // 36

// Add event handler to 'Fire!' button to get user's input to Controller:









