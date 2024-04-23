//prerobeny project.js na web-based interface namiesto terminal based
let balance = 0;

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

function deposit() 
{
    const depositInput = document.getElementById('depositInput');         //connectuje depositInput do html file
    const depositAmount = parseFloat(depositInput.value);                // convertuje input na cislo

    const messageDisplay = document.getElementById('messageDisplay');     //display sprav (error alebo hocicoho potom) 

    if (isNaN(depositAmount) || depositAmount <= 0) 
    {
        messageDisplay.textContent = "Invalid deposit amount, try again.";
        messageDisplay.style.color = 'red';
    } 
    else 
    {
        balance = depositAmount;
        updateBalanceDisplay();
        messageDisplay.textContent = "Deposit successfull";                           //vycisti message display
        messageDisplay.style.color = 'green';
    }
};

function updateBalanceDisplay() 
{
    document.getElementById('balanceDisplay').textContent = `Balance: $${balance.toFixed(2)}`;       //da balance na 2 desatinne
};

function getBet() 
{
    const betInput = document.getElementById('betInput');
    const betAmount = parseFloat(betInput.value);
    const messageDisplay = document.getElementById('messageDisplay');

    if(isNaN(betAmount) || betAmount <= 0 || betAmount > balance) 
    {
        messageDisplay.textContent = "Invalid bet, try again.";
        messageDisplay.style.color = 'red';
        return null;
    } 
    else 
    {
        balance -= betAmount;
        updateBalanceDisplay();
        return betAmount;
    }
};

function spin()
{
    const symbols = [];
    Object.entries(SYMBOLS_COUNT).forEach(([symbol, count]) =>       //Object.entries berie SYMBOLS_COUNT object 
                                                                               // a spravi z neho array of arrays:
   //.forEach- executes a function: (([symbol, count]) => {for....}); 
                                                                    //[
                                                                    //  ["A", 2],                                         
    {                                                               //  ["K", 4],
        for (let i = 0; i < count; i++)                             //  ["Q", 6],
        {                                                           //  ["J", 8] 
                                                                    //]
            symbols.push(symbol);                       //symbol je addnuty do symbol arrayu 
        }
    });

    const reels = [];
    for(let i = 0; i < COLS;  i++) 
    {
        reels.push([]);                     //prida empty array for each reel v reels array
        const reelSymbols = [...symbols];    //creates a copy of the symbols array for each reel
        for(let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);      //selectne random symbol
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);        //removne symbol z reelSymbols aby uz nemohol byt selectnuty
        }
    }

    displayReels(reels);
    return reels;
};

function displayReels(reels) 
{
    const reelContainer = document.getElementById('reelContainer');
    reelContainer.innerHTML = '';
    
    reels.forEach((reel) => 
    {
        const reelElement = document.createElement('div');
        reelElement.className = 'reel';
        
        reel.forEach((symbol) => 
        {
            const symbolElement = document.createElement('div');
            symbolElement.textContent = symbol; 
            symbolElement.className = 'symbol'; 
            reelElement.appendChild(symbolElement);                     //appends the symbol element to the reel element
        });
        reelContainer.appendChild(reelElement);                       //adds the completed reel element to the reelContainer in the HTML document
    });
}

/*
[
    [A, B, C], // Reel 1        
    [D, E, F], // Reel 2
    [G, H, I]  // Reel 3
  ]
                                                    //transpose vysvetlena
  [ 
    [A, D, G],                                     //Reel 1 ktory sa musi rovnat pre jackpot je vlastne 
    [B, E, H],                                          prvy clen kazdeho novovytvoreneho arrayu
    [C, F, I]
  ]
*/
function transpose(reels)      //This operation rearranges the matrix so that rows become columns and columns become rows             
{
    const rows = [];          //array na rows - original cols

    for (let i = 0; i < ROWS; i++) 
    {  
        rows.push([]); 
        for (let j = 0; j < COLS; j++) 
        {  
            rows[i].push(reels[j][i]);  
        }
    }
    return rows;
};

function getWinnings(reels, bet) 
{
    let winnings = 0;
    const rows = transpose(reels);
    
    rows.forEach(row => 
    {
        if(row.every(symbol => symbol === row[0]))
        {
            winnings += bet * SYMBOL_VALUES[row[0]];
        }
    });

    return winnings;
};

function displayWinnings(winnings)
{
    balance += winnings; 
    updateBalanceDisplay(); 

    const messageDisplay = document.getElementById('messageDisplay'); 
    messageDisplay.textContent = winnings > 0 ? `Congratulations! You won $${winnings.toFixed(2)}` : 'Try again!';
    messageDisplay.style.color = winnings > 0 ? 'green' : 'red'; 

}

function setupGame() 
{
    updateBalanceDisplay();

    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', playGame);

    const playAgainButton = document.getElementById('playAgainButton');
    playAgainButton.addEventListener('click', () => 
    {
        playAgainButton.style.display = 'none'; 
        playGame();
    });
}

function playGame()
{
    const messageDisplay = document.getElementById('betInput');
    const betAmount = getBet();
    if (!betAmount) {
        return;
    }

    const reels = spin();
    displayReels(reels);

    const winnings = getWinnings(reels, betAmount);
    displayWinnings(winnings);

    if (balance <= 0) 
    {
        messageDisplay.textContent = "You ran out of money!";
        document.getElementById('playAgainButton').style.display = 'none';
    } 
    else 
    {
        document.getElementById('playAgainButton').style.display = 'block';
    }
};


document.addEventListener('DOMContentLoaded', () =>                        //DOM = event ktory sa stane po nacitani HTML 
{
    setupGame();            //mam v tom aj playGame
    const depositButton = document.getElementById('depositButton');
    if (depositButton) 
    {
        depositButton.addEventListener('click', deposit);
    } 
    else 
    {
        console.log("Deposit button not found");
    }

    const spinButton = document.getElementById('spinButton');
    if (spinButton) 
    {
        spinButton.addEventListener('click', playGame);
    }
    else 
    {
        console.log("Spin button not found");
    }

    const playAgainButton = document.getElementById('playAgainButton');
    if (playAgainButton) 
    {
        playAgainButton.addEventListener('click', () => 
        {
            playAgainButton.style.display = 'none';
            playGame();
        });
    } 
    else 
    {
        console.log("Play Again button not found");
    }
});
