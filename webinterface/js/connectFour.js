//ConnectFour Board and Interface controller

var WIDTH = 700;
var HEIGHT = 600;
var HEADER = 50;

var COLS = 7;
var ROWS = 6;

var boardElement = null;
var drawContext = null;
var boardModel = null;

var colors = ["FD0", "F30"];
var currentPlayer = 1;

function initBoard (boardName) {
    var ele = document.getElementById (boardName);
    if (ele != null) {
        boardElement = ele;
        boardElement.width = WIDTH;
        boardElement.height = HEIGHT + HEADER;
        drawContext = boardElement.getContext ("2d");
        drawBoard ();
        initListeners ();
        initBoardModel ();
    }

}

function drawBoard () {
    drawContext.clearRect (0, 0, WIDTH, HEIGHT + HEADER);
    drawContext.beginPath ();
    var stepX = WIDTH / COLS;
    var stepY = HEIGHT / ROWS;
    var startY = HEADER;

    for (var x = 0; x <= WIDTH; x += stepX) {
        drawContext.moveTo (x, HEADER);
        drawContext.lineTo (x, HEIGHT + HEADER);
    }
    for (var y = HEADER; y <= HEIGHT + HEADER; y += stepY) {
        drawContext.moveTo (0, y);
        drawContext.lineTo (WIDTH, y);
    }
    drawContext.lineWidth = 1;
    drawContext.strokeStyle = "#ccc";
    drawContext.stroke ();
}

function drawModel () {
    var colWidth = (WIDTH / COLS);
    var rowHeight = (HEIGHT / ROWS);
    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
            var val = boardModel[r][c];
            if (val > 0) {
                var x = (c * colWidth) + (colWidth / 2);
                var y = (r * rowHeight) + (rowHeight / 2) + HEADER;
                drawPiece (x, y, colors[val - 1]);
            }
        }
    }
}

function initListeners () {
    boardElement.addEventListener ("mousemove", hintMove, false);
    boardElement.addEventListener ("mouseout", resetMoveHint, false);
    boardElement.addEventListener ("click", performMove, false);
}

function hintMove (e) {
    var colWidth = (WIDTH / COLS);
    var pos = getPosition (e);
    var move = getMove (pos);

    resetMoveHint ();
    var legal = isMoveLegal (move);
    drawHint ((move * colWidth) + colWidth / 2, HEADER / 2, legal);
}

function isMoveLegal (move) {
    return boardModel[0][move] == 0;
}

function resetMoveHint () {
    drawContext.clearRect (0, 0, WIDTH, HEADER);
}

function drawHint (x, y, legal) {
    drawContext.beginPath ();
    drawContext.arc (x, y, 15, 0, Math.PI * 2, false);
    drawContext.closePath ();
    drawContext.lineWidth =  4;
    var color = "#F30"
    if (legal) color = "#09F"
    drawContext.strokeStyle = color;
    drawContext.stroke ();
}

function drawPiece (x, y, col) {
    drawContext.beginPath ();
    drawContext.arc (x, y, 40, 0, Math.PI * 2, false);
    drawContext.closePath ();
    drawContext.fillStyle = col;
    drawContext.fill ();
}


function getPosition (e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= boardElement.offsetLeft;
    y -= boardElement.offsetTop;
    x = Math.min(x, WIDTH);
    y = Math.min(y, HEIGHT + HEADER);
    var pos = {
        "posX" : x,
        "posY" : y
    }
    return pos;
}

function getMove (pos)  {
    var colWidth = (WIDTH / COLS);
    var x = pos["posX"];
    var move = Math.floor (x / colWidth);
    return move;
}

function initBoardModel () {
    boardModel = new Array ();
    for (var r = 0; r < ROWS; r++) {
        boardModel[r] = new Array();
        for (var c = 0; c < COLS; c++) {
            boardModel[r][c] = 0;
        }
    }
}

function performMove (e) {
    var pos = getPosition (e);
    var move = getMove (pos);
    var moved = storeMove (move);
    if (moved) {
        currentPlayer = (currentPlayer % 2) + 1;
        drawBoard ();
        drawModel ();
    }
}

function storeMove (move) {
    var found = false;

    if (isMoveLegal(move)) {
        for (var r = ROWS - 1; r >= 0 && !found; r-- ) {
            if (boardModel[r][move] == 0) {
                found = true;
                boardModel[r][move] = currentPlayer;
            }
        }
    }
    return found;
}