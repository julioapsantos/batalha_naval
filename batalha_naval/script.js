const boardeasy = document.getElementById('tabelafacil');
const boardhard = document.getElementById('tabeladificil');
const resultDisplay = document.getElementById('resultado');
const startButton = document.getElementById('botaoinicio');
const difficultySelect = document.getElementById('dificuldade');
const scoreDisplay = document.getElementById('pontuacao');
const playerScoreDisplay = document.getElementById('pontuacaojogador');
const computerScoreDisplay = document.getElementById('pontuacaocomputador'); 
const historyList = document.getElementById('historicoLista');
const playerHitsDisplay = document.getElementById('acertosjogador');
const playerMissesDisplay = document.getElementById('errosjogador');

let computerShips = [];
let acertosjogador = 0;
let errosjogador = 0; 
let acertosmaquina = 0;
let playerBoard = [];
let computerGuesses = new Set();
let totalShips = 3; 
let pontuacaojogador = 0;
let pontuacaomaquina = 0;
let gameActive = true; 
let boardSize = 5; 

function placeComputerShips() {
    computerShips = []; 
    while (computerShips.length < totalShips) {
        let newShip = Math.floor(Math.random() * (boardSize * boardSize));
        if (!computerShips.includes(newShip)) {
            computerShips.push(newShip);
        }
    }
}

function createBoard() {
    const board = difficultySelect.value === 'facil' ? boardeasy : boardhard; 
    board.innerHTML = ''; 
    playerBoard = Array(boardSize * boardSize).fill(null); 

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handlePlayerClick);
        board.appendChild(cell);
    }
}

function revealCells() {
    const board = difficultySelect.value === 'facil' ? boardeasy : boardhard; 
    for (let i = 0; i < board.children.length; i++) {
        const cell = board.children[i];
        if (computerShips.includes(i)) {
            cell.classList.add('hit'); 
        } else {
            cell.classList.add('miss'); 
        }
    }
}

function handlePlayerClick(e) {
    if (!gameActive) return; 

    const index = e.target.dataset.index;

    if (playerBoard[index] !== null) {
        alert('Você já tentou esta posição! Escolha outra.');
        return;
    }

    playerBoard[index] = 'miss';
    if (computerShips.includes(parseInt(index))) {
        e.target.classList.add('hit');
        resultDisplay.textContent = 'Você acertou!';
        acertosjogador++;
        pontuacaojogador += 1000;
    } else {
        e.target.classList.add('miss');
        resultDisplay.textContent = 'Você errou!';
        errosjogador++; 
        pontuacaojogador -= 50; 
    }

    e.target.removeEventListener('click', handlePlayerClick);
    
    scoreDisplay.style.display = 'block';
    playerScoreDisplay.textContent = pontuacaojogador; 
    playerHitsDisplay.textContent = acertosjogador; 
    playerMissesDisplay.textContent = errosjogador; 

    if (acertosjogador === totalShips) {
        resultDisplay.textContent = 'Você ganhou!';
        gameActive = false; 
        revealCells(); 
        return;
    }

    computerTurn();
}

function computerTurn() {
    if (!gameActive) return; 

    let computerGuess;
    do {
        computerGuess = Math.floor(Math.random() * (boardSize * boardSize));
    } while (computerGuesses.has(computerGuess));

    computerGuesses.add(computerGuess);
    const board = difficultySelect.value === 'facil' ? boardeasy : boardhard;
    const computerCell = board.children[computerGuess];

    const guessText = `Máquina tentou a posição ${computerGuess}. `;
    historyList.innerHTML += `<li>${guessText}</li>`;

    if (computerShips.includes(computerGuess)) {
        acertosmaquina++;
        pontuacaomaquina += 1000; 
        resultDisplay.textContent += ' A máquina acertou!';
    } else {
        pontuacaomaquina -= 50; 
        resultDisplay.textContent += ' A máquina errou!';
    }

    computerScoreDisplay.textContent = pontuacaomaquina; 
    
    if (acertosmaquina === totalShips) { 
        resultDisplay.textContent += ' A máquina ganhou!';
        gameActive = false; 
        revealCells(); 
    }
}

function resetGame() {
    acertosjogador = 0;
    errosjogador = 0; 
    acertosmaquina = 0;
    pontuacaojogador = 0;
    pontuacaomaquina = 0;
    gameActive = true; 
    scoreDisplay.style.display = 'none'; 

    if (difficultySelect.value === 'facil') {
        totalShips = 5;
        boardSize = 5; 
        boardeasy.style.display = 'grid'; 
        boardhard.style.display = 'none'; 
    } else {
        totalShips = 10;
        boardSize = 10;
        boardhard.style.display = 'grid'; 
        boardeasy.style.display = 'none';
    }

    placeComputerShips();
    createBoard();
    resultDisplay.textContent = '';
    playerScoreDisplay.textContent = pontuacaojogador; 
    computerScoreDisplay.textContent = pontuacaomaquina; 
    playerHitsDisplay.textContent = acertosjogador; 
    playerMissesDisplay.textContent = errosjogador; 
    historyList.innerHTML = '';
}

startButton.addEventListener('click', resetGame); 

difficultySelect.addEventListener('change', function() {
    const dificuldade = this.value === 'facil' ? 'Fácil' : 'Difícil';
    alert(`Dificuldade escolhida: ${dificuldade}`);
    resetGame();
});

resetGame();
