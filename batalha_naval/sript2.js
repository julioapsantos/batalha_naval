const board = document.getElementById('board');
const resultDisplay = document.getElementById('result');
const startButton = document.getElementById('startButton');
const difficultySelect = document.getElementById('difficulty');
const scoreDisplay = document.getElementById('score');
const playerScoreDisplay = document.getElementById('playerScore');
const computerScoreDisplay = document.getElementById('computerScore');
const historyList = document.getElementById('historyList');

let computerShips = [];
let playerHits = 0;
let computerHits = 0;
let playerBoard = [];
let computerGuesses = new Set();
let totalShips = 3; // Número total de barcos
let playerScore = 0;
let computerScore = 0;
let gameActive = true; // Variável para controlar o estado do jogo
let boardSize = 5; // Tamanho padrão do tabuleiro

// Função para posicionar os barcos
function placeComputerShips() {
    computerShips = []; // Reinicia os barcos
    while (computerShips.length < totalShips) {
        let newShip = Math.floor(Math.random() * (boardSize * boardSize));
        if (!computerShips.includes(newShip)) {
            computerShips.push(newShip);
        }
    }
}

// Criar tabuleiro
function createBoard() {
    board.innerHTML = ''; // Limpa o tabuleiro anterior
    playerBoard = Array(boardSize * boardSize).fill(null); // Ajusta o tamanho do tabuleiro

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', handlePlayerClick);
        board.appendChild(cell);
    }
}

// Revelar todas as células
function revealCells() {
    for (let i = 0; i < board.children.length; i++) {
        const cell = board.children[i];
        if (computerShips.includes(i)) {
            cell.classList.add('hit'); // Adiciona classe de acerto para células com barcos
        } else {
            cell.classList.add('miss'); // Adiciona classe de erro para células sem barcos
        }
    }
}

// Jogada do jogador
function handlePlayerClick(e) {
    if (!gameActive) return; // Impede jogadas se o jogo não estiver ativo

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
        playerScore += 200; // Aumenta a pontuação do jogador
    } else {
        e.target.classList.add('miss');
        resultDisplay.textContent = 'Você errou!';
        playerScore -= 50; // Diminui a pontuação do jogador
    }

    e.target.removeEventListener('click', handlePlayerClick);
    
    // Exibir pontuação após o primeiro tiro
    scoreDisplay.style.display = 'block';
    playerScoreDisplay.textContent = Math.max(0, playerScore); // Não permitir pontuação negativa

    // Verificar se o jogador ganhou
    if (playerHits === totalShips) {
        resultDisplay.textContent = 'Você ganhou!';
        gameActive = false; // Finaliza o jogo
        revealCells(); // Revela todas as células
        return;
    }

    // Jogada da máquina
    computerTurn();
}

// Jogada da máquina
function computerTurn() {
    if (!gameActive) return; // Impede jogadas se o jogo não estiver ativo

    let computerGuess;
    do {
        computerGuess = Math.floor(Math.random() * (boardSize * boardSize));
    } while (computerGuesses.has(computerGuess));

    computerGuesses.add(computerGuess);
    const computerCell = board.children[computerGuess];

    // Registra a jogada da máquina
    const guessText = `Máquina tentou a posição ${computerGuess}. `;
    historyList.innerHTML += `<li>${guessText}</li>`;

    if (computerShips.includes(computerGuess)) {
        computerHits++;
        computerScore += 200; // Aumenta a pontuação da máquina
        resultDisplay.textContent += ' A máquina acertou!'; // Mostra no resultado
    } else {
        computerScore -= 50; // Diminui a pontuação da máquina
        resultDisplay.textContent += ' A máquina errou!'; // Mostra no resultado
    }

    // Atualiza a pontuação da máquina
    computerScoreDisplay.textContent = Math.max(0, computerScore); // Não permitir pontuação negativa

    // Verificar se a máquina ganhou
    if (computerHits === totalShips) {
        resultDisplay.textContent += ' A máquina ganhou!';
        gameActive = false; // Finaliza o jogo
        revealCells(); // Revela todas as células
    }
}

// Função para reiniciar o jogo
function resetGame() {
    playerHits = 0;
    computerHits = 0;
    playerScore = 0;
    computerScore = 0;
    gameActive = true; // Reinicia o estado do jogo
    scoreDisplay.style.display = 'none'; // Oculta a pontuação inicialmente

    // Ajusta o número de barcos e o tamanho do tabuleiro conforme a dificuldade
    if (difficultySelect.value === 'easy') {
        totalShips = 3;
        boardSize = 5; // Tamanho 5x5 para fácil
    } else {
        totalShips = 5;
        boardSize = 10; // Tamanho 10x10 para difícil
    }

    placeComputerShips();
    createBoard();
    resultDisplay.textContent = '';
    playerScoreDisplay.textContent = playerScore;
    computerScoreDisplay.textContent = Math.max(0, computerScore);
    historyList.innerHTML = ''; // Limpa o histórico
}

// Adiciona evento de clique no botão
startButton.addEventListener('click', resetGame);

// Evento para mudar a dificuldade
difficultySelect.addEventListener('change', function() {
    const difficulty = this.value === 'easy' ? 'Fácil' : 'Difícil';
    alert(`Dificuldade escolhida: ${difficulty}`);
});

// Inicializa o jogo ao carregar a página
resetGame();
