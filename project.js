


const prompt = require("prompt-sync")();

const ROWS = 3; 
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    K: 4,
    Q: 6,
    J: 8
}

const SYMBOL_VALUES = {
    A: 5,
    K: 4,
    Q: 3,
    J: 2
}


const deposit = () => {
    while(true) {
        const depositAmount = prompt("Enter a deposit amount: ")
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while(true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ")
        const numberOfLines = parseFloat(lines);

        if(isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while(true) {
        const bet = prompt("Enter the bet amount per line: ")
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
}

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    console.log(symbols);
};
spin();
let balance = deposit();
const numberOfLines = getNumberOfLines();
const bet =  getBet(balance, numberOfLines);
