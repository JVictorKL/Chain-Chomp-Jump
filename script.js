
const chainChomp = document.querySelector('.chain-chomp');
const pipe = document.querySelector('.pipe');
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

// Reinicia as animações para que comecem do início
const resetAnimations = () => {
    gameBoard.style.animation = 'none';
    pipe.style.animation = 'none';

    gameBoard.style.backgroundPosition = '0 center';
    pipe.style.right = '-80px';
    pipe.style.left = 'auto';

    // Força o navegador a aplicar a reinicialização
    void gameBoard.offsetHeight;

    gameBoard.style.animation = '';
    pipe.style.animation = '';
};

// Faz o personagem pular
const jump = () => {
    if (gameState !== 'playing') return;

    // Impede um novo pulo enquanto o atual não terminar
    if (chainChomp.classList.contains('jump')) return;

    chainChomp.classList.add('jump');

    clearTimeout(jumpTimeout);

    jumpTimeout = setTimeout(() => {
        chainChomp.classList.remove('jump');
    }, 500);
};

// Inicia ou reinicia o jogo
const startGame = () => {
    clearTimeout(jumpTimeout);

    gameState = 'playing';

    startModal.hidden = true;
    gameOverModal.hidden = true;

    // Restaura o personagem e sua posição
    chainChomp.src = originalImage;
    chainChomp.style.animation = '';
    chainChomp.style.bottom = '20px';
    chainChomp.classList.remove('jump');

    // Reinicia o cenário e o cano
    resetAnimations();

    // Libera as animações
    document.body.classList.add('playing');

    backgroundMusic.play().catch((error) => {
    console.error('Não foi possível reproduzir a música:', error);
    });
    // Inicia a música apenas se ainda não estiver tocando
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
            console.error('Erro ao iniciar a música:', error);
        });
    }  
};

// Encerra o jogo após a colisão
const gameOver = () => {
    if (gameState !== 'playing') return;

    // Guarda a posição vertical no momento da colisão
    const chompPosition = window.getComputedStyle(chainChomp).bottom;

    gameState = 'over';

    // Interrompe todas as animações do jogo
    document.body.classList.remove('playing');

    clearTimeout(jumpTimeout);
    chainChomp.classList.remove('jump');

    // Mantém o personagem na altura em que morreu
    chainChomp.style.animation = 'none';
    chainChomp.style.bottom = chompPosition;

    // Exibe a imagem de morte
    chainChomp.src = deathImage;

    // Exibe o modal de Game Over
    gameOverModal.hidden = false;
};

// Verifica a colisão entre o personagem e o cano
const checkCollision = () => {
    if (gameState !== 'playing') return;

    const chompRect = chainChomp.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    // Área de colisão reduzida do personagem
    const chompHitbox = {
        left: chompRect.left + 20,
        right: chompRect.right - 15,
        top: chompRect.top + 20,
        bottom: chompRect.bottom - 10
    };

    // Área de colisão reduzida do cano
    const pipeHitbox = {
        left: pipeRect.left - 20,
        right: pipeRect.right - 10,
        top: pipeRect.top - 4,
        bottom: pipeRect.bottom - 5
    };

    const collision =
        chompHitbox.left < pipeHitbox.right &&
        chompHitbox.right > pipeHitbox.left &&
        chompHitbox.top < pipeHitbox.bottom &&
        chompHitbox.bottom > pipeHitbox.top;

    if (collision) {
        gameOver();
    }
};

// Verifica a colisão continuamente
setInterval(checkCollision, 10);

// Eventos dos botões
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Permite pular com o teclado
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        event.preventDefault();
        jump();
    }
});
