
const chainChomp = document.querySelector('.chain-chomp');
const spike = document.querySelector('.spike');
const gameBoard = document.querySelector('.game-board');

const startModal = document.querySelector('#start-modal');
const gameOverModal = document.querySelector('#game-over-modal');

const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');

const originalImage = 'assets/ChainChomp.webp';
const deathImage = 'assets/ChainChompTeardrop.png';

const backgroundMusic = document.querySelector('#background-music');
backgroundMusic.volume = 0.4;

let gameState = 'waiting';
let jumpTimeout;
const resetAnimations = () => {
    gameBoard.style.animation = 'none';
    spike.style.animation = 'none';
    gameBoard.style.backgroundPosition = '0 center';
    spike.style.right = '-80px';
    spike.style.left = 'auto';
    void gameBoard.offsetHeight;
    gameBoard.style.animation = '';
    spike.style.animation = '';
};

const jump = () => {
    if (gameState !== 'playing') return;
    if (chainChomp.classList.contains('jump')) return;
    chainChomp.classList.add('jump');
    clearTimeout(jumpTimeout);
    jumpTimeout = setTimeout(() => {
        chainChomp.classList.remove('jump');
    }, 500);
};

const startGame = () => {
    clearTimeout(jumpTimeout);
    gameState = 'playing';
    startModal.hidden = true;
    gameOverModal.hidden = true;
    chainChomp.src = originalImage;
    chainChomp.style.animation = '';
    chainChomp.style.bottom = '20px';
    chainChomp.classList.remove('jump');
    resetAnimations();
    document.body.classList.add('playing');
    backgroundMusic.play().catch((error) => {
    console.error('Não foi possível reproduzir a música:', error);
    });
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
            console.error('Erro ao iniciar a música:', error);
        });
    }  
};

const gameOver = () => {
    if (gameState !== 'playing') return;
    const chompPosition = window.getComputedStyle(chainChomp).bottom;
    gameState = 'over';
    document.body.classList.remove('playing');
    clearTimeout(jumpTimeout);
    chainChomp.classList.remove('jump');
    chainChomp.style.animation = 'none';
    chainChomp.style.bottom = chompPosition;
    chainChomp.src = deathImage;
    gameOverModal.hidden = false;
};

const checkCollision = () => {
    if (gameState !== 'playing') return;
    const chompRect = chainChomp.getBoundingClientRect();
    const spikeRect = spike.getBoundingClientRect();
    const chompHitbox = {
        left: chompRect.left + 20,
        right: chompRect.right - 15,
        top: chompRect.top + 20,
        bottom: chompRect.bottom - 10
    };
    const spikeHitbox = {
        left: spikeRect.left - 20,
        right: spikeRect.right - 10,
        top: spikeRect.top - 4,
        bottom: spikeRect.bottom - 5
    };
    const collision =
        chompHitbox.left < spikeHitbox.right &&
        chompHitbox.right > spikeHitbox.left &&
        chompHitbox.top < spikeHitbox.bottom &&
        chompHitbox.bottom > spikeHitbox.top;
    if (collision) {
        gameOver();
    }
};

setInterval(checkCollision, 10);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        jump();
    }
});