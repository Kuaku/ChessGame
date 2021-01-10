const figure = require('./figure')
const field = require('./field')

const NULL_MOVE = 'I', PUNCH_MOVE = 'P', MOVE_MOVE = 'M';

const Option = function(field, x, y, check_for_chess){
    this.options = [];
    this.field = field;
    this.x = x;
    this.y = y;
    this.check_for_chess = check_for_chess
    this.color = field.getFigure(x, y).getColor()
    for (let i = 0; i < field.getW(); i++){
        let row = [];
        for (let j = 0; j < field.getH(); j++){
            row.push({move: NULL_MOVE})
        }
        this.options.push(row);
    }
}
Option.prototype.generateOptions = function() {
    switch(this.field.getFigure(this.x, this.y).getType()){
        case figure.TYPES[figure.PAWN]: this.generatePawnOptions();
            break;
        case figure.TYPES[figure.KING]: this.generateKingOptions();
            break;
        case figure.TYPES[figure.KNIGHT]: this.generateKnightOptions();
            break;
        case figure.TYPES[figure.ROOK]: this.generateRookOptions();
            break;
        case figure.TYPES[figure.BISHOP]: this.generateBishopOptions();
            break;
        case figure.TYPES[figure.QUEEN]: this.generateQueenOptions();
            break;
    }
}
Option.prototype.generatePunchOrMove = function (i, j){
    if (this.field.isInField(i, j)){
        if (this.field.getFigure(i, j).gotType() === false){
            this.options[i][j].move = this.generateMove(MOVE_MOVE, this.x - 1, this.y);
        } else if (this.field.getFigure(i, j).gotType() === true && this.field.getFigure(i, j).getColor() !== this.color) {
            this.options[i][j].move = this.generateMove(PUNCH_MOVE, i, j);
        }
    }
}
Option.prototype.generateLine = function(addI, addJ){
    let tempI = this.x + addI;
    let tempJ = this.y + addJ;
    while (this.field.isInField(tempI, tempJ)){
        if (!(tempI - addI === this.x && tempJ - addJ === this.y)){
            if (this.getMove(tempI - addI, tempJ - addJ) !== MOVE_MOVE){
                break;
            }
        }
        this.generatePunchOrMove(tempI, tempJ);
        tempI += addI;
        tempJ += addJ;
    }
}

Option.prototype.generatePawnOptions = function(){
    if (this.color === figure.COLORS[figure.WHITE]){
        if (this.field.isInField(this.x - 1, this.y) === true && this.field.getFigure(this.x - 1, this.y).gotType() === false){
            this.options[this.x-1][this.y].move = this.generateMove(MOVE_MOVE, this.x - 1, this.y);
        }
        if (this.x === 6 && this.options[this.x-1][this.y] !== NULL_MOVE && this.field.getFigure(this.x - 2, this.y).gotType() === false){
            this.options[this.x-2][this.y].move = this.generateMove(MOVE_MOVE, this.x -2, this.y);
        }
        if (this.field.isInField(this.x - 1, this.y - 1) && this.field.getFigure(this.x - 1, this.y - 1).gotType() === true && this.field.getFigure(this.x - 1, this.y - 1).gotColor() !== this.color){
            this.options[this.x - 1][this.y - 1].move = this.generateMove(PUNCH_MOVE, this.x - 1, this.y - 1);
        }
        if (this.field.isInField(this.x - 1, this.y + 1) && this.field.getFigure(this.x - 1, this.y + 1).gotType() === true && this.field.getFigure(this.x - 1, this.y + 1).gotColor() !== this.color){
            this.options[this.x - 1][this.y + 1].move = this.generateMove(PUNCH_MOVE, this.x - 1, this.y + 1);
        }
    } else {
        if (this.field.isInField(this.x + 1, this.y) === true && this.field.getFigure(this.x + 1, this.y).gotType() === false){
            this.options[this.x+1][this.y].move = this.generateMove(MOVE_MOVE, this.x + 1, this.y);
        }
        if (this.x === 1 && this.options[this.x+1][this.y] !== NULL_MOVE && this.field.getFigure(this.x + 2, this.y).gotType() === false){
            this.options[this.x+2][this.y].move = this.generateMove(MOVE_MOVE, this.x + 2, this.y);
        }
        if (this.field.isInField(this.x + 1, this.y - 1) && this.field.getFigure(this.x + 1, this.y - 1).gotType() === true && this.field.getFigure(this.x + 1, this.y - 1).gotColor() !== this.color){
            this.options[this.x + 1][this.y - 1].move = this.generateMove(PUNCH_MOVE, this.x + 1, this.y - 1);
        }
        if (this.field.isInField(this.x + 1, this.y + 1) && this.field.getFigure(this.x + 1, this.y + 1).gotType() === true && this.field.getFigure(this.x + 1, this.y + 1).gotColor() !== this.color){
            this.options[this.x + 1][this.y + 1].move = this.generateMove(PUNCH_MOVE, this.x + 1, this.y + 1);
        }
    }
}
Option.prototype.generateKnightOptions = function(){
    this.generatePunchOrMove(this.x - 2, this.y - 1)
    this.generatePunchOrMove(this.x + 2, this.y - 1)
    this.generatePunchOrMove(this.x - 2, this.y + 1)
    this.generatePunchOrMove(this.x + 2, this.y + 1)
    this.generatePunchOrMove(this.x - 1, this.y - 2)
    this.generatePunchOrMove(this.x - 1, this.y - 2)
    this.generatePunchOrMove(this.x + 1, this.y + 2)
    this.generatePunchOrMove(this.x + 1, this.y + 2)
}
Option.prototype.generateKingOptions = function(){
    this.generatePunchOrMove(this.x-1, this.y);
    this.generatePunchOrMove(this.x+1, this.y);
    this.generatePunchOrMove(this.x-1, this.y-1);
    this.generatePunchOrMove(this.x-1, this.y+1);
    this.generatePunchOrMove(this.x+1, this.y-1);
    this.generatePunchOrMove(this.x+1, this.y+1);
    this.generatePunchOrMove(this.x, this.y-1);
    this.generatePunchOrMove(this.x, this.y+1);
}
Option.prototype.generateRookOptions = function() {
    this.generateLine(1, 0)
    this.generateLine(-1, 0)
    this.generateLine(0, 1)
    this.generateLine(0, -1)
}
Option.prototype.generateBishopOptions = function() {
    this.generateLine(1, 1)
    this.generateLine(1, -1)
    this.generateLine(-1, 1)
    this.generateLine(-1, -1)
}
Option.prototype.generateQueenOptions = function() {
    this.generateLine(1, 0)
    this.generateLine(-1, 0)
    this.generateLine(0, 1)
    this.generateLine(0, -1)
    this.generateLine(1, 1)
    this.generateLine(1, -1)
    this.generateLine(-1, 1)
    this.generateLine(-1, -1)
}

Option.prototype.getMove = function (i, j){
    return this.options[i][j].move
}

Option.prototype.generateMove = function (move, i, j){
    if (this.check_for_chess === true){
        const fieldCopy = this.field.copy();
        fieldCopy.moveFigure(this.x, this.y, i, j);
        if (fieldCopy.CheckForChess(this.color) === false){
            return move;
        }
        return NULL_MOVE;
    } else {
        return move;
    }
}

Option.prototype.toString = function (){
    let out = ''
    for (let i = 0; i < this.options.length; i++){
        for (let j = 0; j < this.options[i].length; j++){
            out += this.options[i][j].move;
        }
        out += '|'
    }
    out += '.';
    return out;
}


module.exports = {Option, NULL_MOVE, PUNCH_MOVE, MOVE_MOVE}
