const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const COLORS = [
    '#000000',  // empty
    '#FF0000',  // I piece
    '#00FF00',  // J piece
    '#0000FF',  // L piece
    '#FFFF00',  // O piece
    '#00FFFF',  // S piece
    '#FF00FF',  // T piece
    '#FFA500'   // Z piece
];

const SHAPES = {
    'I': [['0100', '0100', '0100', '0100']],
    'J': [['011', '001', '001']],
    'L': [['110', '001', '001']],
    'O': [['011', '011']],
    'S': [['011', '110']],
    'T': [['111', '010']],
    'Z': [['110', '011']]
};

let board = [...Array(ROWS)].map(() => Array(COLS).fill(0));
let currentPiece = null;
let currentPosition = { x: 0, y: 0 };

function drawBoard() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            ctx.fillStyle = COLORS[board[r][c]];
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#ccc';
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }
}

function drawPiece(piece, pos) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (piece[r][c] === '1') {
                ctx.fillStyle = COLORS[currentPiece];
                ctx.fillRect((pos.x + c) * BLOCK_SIZE, (pos.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#ccc';
                ctx.strokeRect((pos.x + c) * BLOCK_SIZE, (pos.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function movePieceDown() {
    if (!isCollision(currentPiece, { x: currentPosition.x, y: currentPosition.y + 1 })) {
        currentPosition.y++;
    } else {
        placePiece();
        clearLines();
        spawnPiece();
    }
}

function isCollision(piece, pos) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (piece[r][c] === '1') {
                let absRow = pos.y + r;
                let absCol = pos.x + c;
                if (absRow >= ROWS || absCol < 0 || absCol >= COLS || board[absRow][absCol] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placePiece() {
    for (let r = 0; r < currentPiece.length; r++) {
        for (let c = 0; c < currentPiece[r].length; c++) {
            if (currentPiece[r][c] === '1') {
                board[currentPosition.y + r][currentPosition.x + c] = currentPiece;
            }
        }
    }
}

function clearLines() {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
        }
    }
}

function spawnPiece() {
    currentPiece = randomPiece();
    currentPosition = { x: Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2), y: 0 };
    if (isCollision(currentPiece, currentPosition)) {
        gameOver();
    }
}

function randomPiece() {
    let keys = Object.keys(SHAPES);
    let key = keys[Math.floor(Math.random() * keys.length)];
    return SHAPES[key];
}

function gameOver() {
    alert('Game Over!');
    board = [...Array(ROWS)].map(() => Array(COLS).fill(0));
    spawnPiece();
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        if (!isCollision(currentPiece, { x: currentPosition.x - 1, y: currentPosition.y })) {
            currentPosition.x--;
        }
    } else if (event.key === 'ArrowRight') {
        if (!isCollision(currentPiece, { x: currentPosition.x + 1, y: currentPosition.y })) {
            currentPosition.x++;
        }
    } else if (event.key === 'ArrowDown') {
        movePieceDown();
    } else if (event.key === 'ArrowUp') {
        rotatePiece();
    }
});

function rotatePiece() {
    let rotatedPiece = [];
    for (let c = 0; c < currentPiece[0].length; c++) {
        let newRow = '';
        for (let r = currentPiece.length - 1; r >= 0; r--) {
            newRow += currentPiece[r][c];
        }
        rotatedPiece.push(newRow);
    }
    if (!isCollision(rotatedPiece, currentPosition)) {
        currentPiece = rotatedPiece;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece, currentPosition);
    movePieceDown();
    requestAnimationFrame(gameLoop);
}

spawnPiece();
gameLoop();
