const board = document.getElementById('board');
const resultDisplay = document.getElementById('result');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');

let computerShips = [];
let playerHits = 0;
let computerHits = 0;
let playerBoard = Array(25).fill(null);
let computerGuesses = new Set();
let totalShips = 3; // Número total de barcos (1x1 e 1x2)

// Função para posicionar os barcos
function placeComputerShips() {
    computerShips = []; // Reinicia os barcos
    while (computerShips.length < totalShips) {
        let newShip = Math.floor(Math.random() * 25);
        if (!computerShips.includes(newShip)) {
            computerShips.push(newShip);
        }
    }
}

// Criar tabuleiro
function createBoard() {
    board.innerHTML = ''; // Limpa o tabuleiro anterior
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handlePlayerClick);
        board.appendChild(cell);
    }
}

// Jogada do jogador
function handlePlayerClick(e) {
    const index = e.target.dataset.index;

    if (playerBoard[index] !== null) {
        alert('Você já tentou esta posição! Escolha outra.');
        return;
    }

    playerBoard[index] = 'miss';
    if (computerShips.includes(parseInt(index))) {
        e.target.classList.add('hit');
        resultDisplay.textContent = 'Você acertou!';
        playerHits++;
    } else {
        e.target.classList.add('miss');
        resultDisplay.textContent = 'Você errou!';
    }

    e.target.removeEventListener('click', handlePlayerClick);
    
    // Verificar se o jogador ganhou
    if (playerHits === totalShips) {
        resultDisplay.textContent = 'Você ganhou!';
        return;
    }

    // Jogada da máquina
    computerTurn();
}

// Jogada da máquina
function computerTurn() {
    let computerGuess;
    do {
        computerGuess = Math.floor(Math.random() * 25);
    } while (computerGuesses.has(computerGuess));

    computerGuesses.add(computerGuess);
    const computerCell = board.children[computerGuess];

    if (computerShips.includes(computerGuess)) {
        computerCell.classList.add('hit');
        resultDisplay.textContent += ' A máquina acertou!';
        computerHits++;
    } else {
        computerCell.classList.add('miss');
        resultDisplay.textContent += ' A máquina errou!';
    }

    // Verificar se a máquina ganhou
    if (computerHits === totalShips) {
        resultDisplay.textContent += ' A máquina ganhou!';
    }
}

// Função para reiniciar o jogo
function resetGame() {
    playerHits = 0;
    computerHits = 0;
    playerBoard = Array(25).fill(null);
    computerGuesses = new Set();
    totalShips = difficultySelect.value === 'easy' ? 3 : 5; // Ajusta o número de barcos conforme a dificuldade
    placeComputerShips();
    createBoard();
    resultDisplay.textContent = '';
}

// Adiciona evento de clique no botão
startButton.addEventListener('click', resetGame);

// Inicializa o jogo ao carregar a página
resetGame();
