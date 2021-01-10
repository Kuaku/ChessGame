const NULL_CHAR = 'O'

const PAWN = 0, KNIGHT = 1, ROOK = 2, BISHOP = 3, QUEEN = 4, KING = 5;
const WHITE = 0, BLACK = 1;
const TYPES = [ 'P',
                'N',
                'R',
                'B',
                'Q',
                'K']

const COLORS = ['W',
                'B']

const Figure = function (color, type) {
    if (isColor(color) === true) {
        this.color = color;
    }
    if (isType(type) === true) {
        this.type = type;
    }
}
Figure.prototype.getColor = function (){
    return this.color;
}
Figure.prototype.getType = function (){
    return this.type;
}
Figure.prototype.setColor = function (color){
    if (isColor(color) === true){
        this.color = color;
    }
}
Figure.prototype.setType = function (type){
    if (isType(type) === true){
        this.type = type;
    }
}
Figure.prototype.gotType = function (){
    if (this.type === undefined){
        return false;
    }
    return true;
}
Figure.prototype.gotColor = function() {
    if (this.type === undefined){
        return false;
    }
    return true;
}
Figure.prototype.toString = function() {
    let out = ''
    if (this.color === undefined){
       out += NULL_CHAR
    } else {
        out += this.color
    }
    if (this.type === undefined){
        out += NULL_CHAR
    } else {
        out += this.type;
    }
    return out;
}


const isColor = (color) => {
    for (let i = 0; i < COLORS.length; i++){
        if (COLORS[i] === color){
            return true;
        }
    }
    return false;
}
const isType = (type) => {
    for (let i = 0; i < TYPES.length; i++){
        if (TYPES[i] === type){
            return true;
        }
    }
    return false;
}


module.exports = {Figure, TYPES, COLORS, BISHOP, KING, QUEEN, PAWN, ROOK, KNIGHT, BLACK, WHITE};
