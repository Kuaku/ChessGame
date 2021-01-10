const field = require('./field')
const figure = require('./figure')
const vision = require('./vision')
const option = require('./option')

const ChessGame = function () {
    this.field = new field.Field(8, 8);
    this.started = false;
    this.whiteInit = false;
    this.blackInit = false;

    this.turn = 0;

    this.initPawnRows()
}

ChessGame.prototype.initPawnRows = function (){
    this.initBlackPawnRow()
    this.initWhitePawnRow()
}
ChessGame.prototype.getField = function(){
    return this.field;
}
ChessGame.prototype.isStarted = function() {
    return this.started;
}
ChessGame.prototype.initWhiteFirstRow = function(firstRowString){
    if (validatedFirstRow(firstRowString) === true){
        for (let j = 0; j < firstRowString.length; j++){
            this.field.setFigure(7, j, new figure.Figure(figure.COLORS[figure.WHITE], firstRowString.charAt(j)))
        }
        this.whiteInit = true;
        return true;
    }
    return false;
}
ChessGame.prototype.initBlackFirstRow = function(firstRowString){
    if (validatedFirstRow(firstRowString) === true){
        for (let j = 0; j < firstRowString.length; j++){
            this.field.setFigure(0, j, new figure.Figure(figure.COLORS[figure.BLACK], firstRowString.charAt(j)))
        }
        this.blackInit = true;
        return true;
    }
    return false;
}
ChessGame.prototype.start = function() {
    if (this.blackInit === true && this.whiteInit === true){
        this.started = true;
        return true;
    }
    return false;
}
ChessGame.prototype.initBlackPawnRow = function () {
    for (let j = 0; j < 8; j++){
        this.field.setFigure(1, j, new figure.Figure(figure.COLORS[figure.BLACK], figure.TYPES[figure.PAWN]))
    }
}
ChessGame.prototype.initWhitePawnRow = function () {
    for (let j = 0; j < 8; j++){
        this.field.setFigure(6, j, new figure.Figure(figure.COLORS[figure.WHITE], figure.TYPES[figure.PAWN]))
    }
}
ChessGame.prototype.isFigureColor = function (i, j, color){
    if (this.field.getFigure(i, j).getColor() === color){
        return true;
    }
    return false;
}
ChessGame.prototype.getTurn = function (){
    return this.turn;
}

ChessGame.prototype.getOptions = function (i, j){
    if (this.field.getFigure(i, j).gotType() && this.field.getFigure(i, j).color === figure.COLORS[this.turn] && this.isStarted()){
        const out = new option.Option(this.field, i, j, true);
        out.generateOptions();
        return out;
    }
    return undefined;
}

ChessGame.prototype.checkForChess = function (){
    return this.field.CheckForChess(figure.COLORS[this.turn]);
}
ChessGame.prototype.checkForOptions = function(){
    for (let i = 0; i < 8; i++){
        for (let j = 0; j < 8; j++){
            if (this.field.getFigure(i, j).getColor() === figure.COLORS[this.turn]){
                const tempOptions = new option.Option(this.field, i, j, true);
                tempOptions.generateOptions();
                for (let x = 0; x < 8; x++){
                    for (let y = 0; y < 8; y++){
                        if (tempOptions.getMove(x, y) !== option.NULL_MOVE){
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

ChessGame.prototype.makeMove = function (i1, j1, i2, j2, special){
    if (this.field.getFigure(i1, j1).gotType() && this.field.getFigure(i1, j1).color === figure.COLORS[this.turn] && this.isStarted()){
        const options = this.getOptions(i1, j1);
        if (options.getMove(i2, j2) !== option.NULL_MOVE) {
            if (this.field.getFigure(i1, j1).getType() === figure.TYPES[figure.PAWN] &&
                ((this.field.getFigure(i1, j1).getColor() === figure.COLORS[figure.WHITE] && i2 === 0) ||
                (this.field.getFigure(i1, j1).getColor() === figure.COLORS[figure.BLACK] && i2 === 7))) {
                if (special === figure.TYPES[figure.KNIGHT] || special === figure.TYPES[figure.QUEEN] || special === figure.TYPES[figure.BISHOP] || special === figure.TYPES[figure.ROOK]){
                    this.field.moveFigure(i1, j1, i2, j2);
                    this.field.getFigure(i2, j2).setType(special);
                    this.turn = (this.turn + 1) % 2;
                } else {
                    return false;
                }
            } else {
                this.field.moveFigure(i1, j1, i2, j2);
                this.turn = (this.turn + 1) % 2;
                return true;
            }
        }
    }
    return false;
}

ChessGame.prototype.getWhiteVision = function (){
    return new vision.Vision(this.field, figure.COLORS[figure.WHITE]).toString();
}
ChessGame.prototype.getBlackVision = function (){
    return new vision.Vision(this.field, figure.COLORS[figure.BLACK]).toString();
}

const validatedFirstRow = (firstRowString) => {
    if (firstRowString.length != 8){
        return false;
    }
    let count = {K: 0, Q: 0, B: 0, N: 0, R: 0};
    for (let i = 0; i < firstRowString.length; i++){
        switch (firstRowString.charAt(i)){
            case 'K': if (count.K === 1) return false;
                        count.K++;
                        break;
            case 'Q': if (count.Q === 1) return false;
                        count.Q++;
                        break;
            case 'N': if (count.N === 2) return false;
                count.N++;
                break;
            case 'R': if (count.R === 2) return false;
                count.R++;
                break;
            case 'B': if (count.B === 2) return false;
                count.B++;
                break;
            default: return false;
        }
    }
    return true;
}

module.exports = {ChessGame}
