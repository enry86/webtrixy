goog.provide('boardView');
goog.require('cfConf');


function drawBoard () {
    drawContext.clearRect (0, 0, cfConf.WIDTH, cfConf.HEIGHT + cfConf.HEADER);
    drawContext.beginPath ();
    var stepX = cfConf.WIDTH / cfConf.COLS;
    var stepY = cfConf.HEIGHT / cfConf.ROWS;
    var startY = cfConf.HEADER;

    for (var x = 0; x <= cfConf.WIDTH; x += stepX) {
        drawContext.moveTo (x, cfConf.HEADER);
        drawContext.lineTo (x, cfConf.HEIGHT + cfConf.HEADER);
    }
    for (var y = cfConf.HEADER; y <= cfConf.HEIGHT + cfConf.HEADER; y += stepY) {
        drawContext.moveTo (0, y);
        drawContext.lineTo (cfConf.WIDTH, y);
    }
    drawContext.lineWidth = 1;
    drawContext.strokeStyle = "#ccc";
    drawContext.stroke ();
}



function drawModel () {
    var colWidth = (cfConf.WIDTH / cfConf.COLS);
    var rowHeight = (cfConf.HEIGHT / cfConf.ROWS);
    for (var r = 0; r < cfConf.ROWS; r++) {
        for (var c = 0; c < cfConf.COLS; c++) {
            var val = boardModel[r][c];
            if (val > 0) {
                var x = (c * colWidth) + (colWidth / 2);
                var y = (r * rowHeight) + (rowHeight / 2) + cfConf.HEADER;
                drawPiece (x, y, colors[val - 1]);
            }
        }
    }
}


boardView.resetMoveHint = function  () {
    drawContext.clearRect (0, 0, cfConf.WIDTH, cfConf.HEADER);
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
