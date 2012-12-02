goog.provide('connectFour');

goog.require('cfConf');
goog.require('boardView');
goog.require('cfAjax');

//ConnectFour Board and Interface controller

var boardElement = null;
var resultElement = null;
var drawContext = null;
var boardModel = null;

var colors = ["#FD0", "#F30"];
var currentPlayer = 1;
var gamePlaying = true;
var humanTurn = true;

function initBoard (boardName, resultName) {
    var board = document.getElementById (boardName);
    var result = document.getElementById (resultName);
    if (board != null && result != null) {
        resultElement = result;
        boardElement = board;
        boardElement.width = cfConf.WIDTH;
        boardElement.height = cfConf.HEIGHT + cfConf.HEADER;
        drawContext = boardElement.getContext ("2d");
        drawBoard ();
        initListeners ();
        initBoardModel ();
    }

}

function initListeners () {
    boardElement.addEventListener ("mousemove", hintMove, false);
    boardElement.addEventListener ("mouseout", boardView.resetMoveHint, false);
    boardElement.addEventListener ("click", humanMove, false);
}

function hintMove (e) {
    var colWidth = (cfConf.WIDTH / cfConf.COLS);
    var pos = getPosition (e);
    var move = getMove (pos);

    boardView.resetMoveHint ();
    var legal = isMoveLegal (move);
    drawHint ((move * colWidth) + colWidth / 2, cfConf.HEADER / 2, legal);
}

function isMoveLegal (move) {
    return (gamePlaying && boardModel[0][move] == 0 && humanTurn);
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
    x = Math.min(x, cfConf.WIDTH);
    y = Math.min(y, cfConf.HEIGHT + cfConf.HEADER);
    var pos = {
        "posX" : x,
        "posY" : y
    }
    return pos;
}

function getMove (pos)  {
    var colWidth = (cfConf.WIDTH / cfConf.COLS);
    var x = pos["posX"];
    var move = Math.floor (x / colWidth);
    return move;
}

function initBoardModel () {
    gamePlaying = true;
    boardModel = new Array ();
    for (var r = 0; r < cfConf.ROWS; r++) {
        boardModel[r] = new Array();
        for (var c = 0; c < cfConf.COLS; c++) {
            boardModel[r][c] = 0;
        }
    }
}

function humanMove (e) {
    var pos = getPosition (e);
    var move = getMove (pos);
    var moved = storeMove (move);
    if (moved) {
        humanTurn = false;
        updateGame ();
    }
}

function brainMove (move) {
    alert(move);
    var moved = storeMove (move);
    if (moved) {
        humanTurn = true;
        updateGame();
    }
}

function updateGame () {
    currentPlayer = (currentPlayer % 2) + 1;
    drawBoard ();
    drawModel ();
    var win = checkWinner();
    if (win > 0) endGame (win);
    else if (!humanTurn) cfAjax.getMove(boardModel, brainMove);
}


function storeMove (move) {
    var found = false;

    if (isMoveLegal(move)) {
        for (var r = cfConf.ROWS - 1; r >= 0 && !found; r-- ) {
            if (boardModel[r][move] == 0) {
                found = true;
                boardModel[r][move] = currentPlayer;
            }
        }
    }
    return found;
}

function checkWinner () {
    var win = checkHoriz ();
    if (win == 0) win = checkVert ();
    if (win == 0) win = checkDiagLeft ();
    if (win == 0) win = checkDiagRight ();
    return win;
}

function checkHoriz () {
    var win = 0;
    var found = false;

    for (var r = 0; r < cfConf.ROWS && !found; r++) {
        var currWin = 0;
        var count = 0;
        for (var c = 0; c < cfConf.COLS && !found; c++) {
            var val = boardModel[r][c];
            if (val == currWin && val > 0) {
                count++;
                if (count == cfConf.WINCOND) found = true;
            }
            else {
                currWin = val;
                count = 1;
            }
        }
    }
    if (count == cfConf.WINCOND && currWin != 0) win = currWin;
    return win;
}

function checkVert () {
    var win = 0;
    var found = false;
    var currWin = 0;
    var count = 0;
    for (var c = 0; c < cfConf.COLS && !found; c++) {
        currWin = 0;
        count = 0;
        for (var r = 0; r < cfConf.ROWS && !found; r++) {
            var val = boardModel[r][c];
            if (val == currWin && val > 0) {
                count++;
                if (count == cfConf.WINCOND) found = true;
            }
            else {
                currWin = val;
                count = 1;
            }
        }
    }
    if (count == cfConf.WINCOND && currWin != 0) win = currWin;
    return win;
}

function checkDiagLeft () {
    var win = 0;
    var found = false;
    var currWin = 0;
    var currWin2 = 0;
    var count = 0;
    var count2 = 0;

    var shift = 0;

    for (var startRow = cfConf.ROWS - 1; startRow >= cfConf.WINCOND - 1 && !found; startRow--) {
        var c = 0;
        var r = startRow;
        currWin = 0;
        count = 0;
        currWin2 = 0;
        count2 = 0;

        while (r >= 0 && !found) {
            var val = boardModel[r][c];
            if (val == currWin && val > 0) {
                count++;
                if (count == cfConf.WINCOND) found = true;
            }
            else {
                currWin = val;
                count = 1;
            }

            val = boardModel[r + shift][c + shift + 1];
            if (val == currWin2 && val > 0) {
                count2++;
                if (count2 == cfConf.WINCOND) {
                    found = true;
                    currWin = currWin2;
                }
            }
            else {
                currWin2 = val;
                count2 = 1;
            }
            r--;
            c++;
        }
        shift++;
    }
    if (found) win = currWin;
    return win;
}

function checkDiagRight () {
    var win = 0;
    var found = false;
    var currWin = 0;
    var currWin2 = 0;
    var count = 0;
    var count2 = 0;

    var shift = 0;

    for (var startRow = cfConf.ROWS - 1; startRow >= cfConf.WINCOND - 1 && !found; startRow--) {
        var c = cfConf.COLS - 1;
        var r = startRow;
        currWin = 0;
        count = 0;
        currWin2 = 0;
        count2 = 0;

        while (r >= 0 && !found) {
            var val = boardModel[r][c];
            if (val == currWin && val > 0) {
                count++;
                if (count == cfConf.WINCOND) found = true;
            }
            else {
                currWin = val;
                count = 1;
            }

            val = boardModel[r + shift][c - (shift + 1)];
            if (val == currWin2 && val > 0) {
                count2++;
                if (count2 == cfConf.WINCOND) {
                    found = true;
                    currWin = currWin2;
                }
            }
            else {
                currWin2 = val;
                count2 = 1;
            }
            r--;
            c--;
        }
        shift++;
    }
    if (found) win = currWin;
    return win;
}

function endGame (win) {
    gamePlaying = false;
    var str = "Player " + win + " won the game!";
    resultElement.innerHTML = str;
}