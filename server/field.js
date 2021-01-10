const figure = require('./figure');
const options = require('./option')

const END_ROW_CHAR = '|'
const END_FIELD_CHAR = '.'

const Field = function (w, h) {
    this.field = [];
    this.w  = w;
    this.h = h;
    for (let i = 0; i < w; i++){
        const row = [];
        for (let j = 0; j < h; j++){
            row.push(new figure.Figure());
        }
        this.field.push(row);
    }
}
Field.prototype.getField = function() {
    return this.field;
}
Field.prototype.getW = function(){
    return this.w;
}
Field.prototype.getH = function(){
    return this.h;
}
Field.prototype.getFigure = function (i, j){
    if (this.isInField(i, j) === true){
        return this.field[i][j];
    }
    return undefined;
}
Field.prototype.setFigure = function (i, j, figure){
    if (this.isInField(i, j) === true){
        this.field[i][j].setColor(figure.getColor());
        this.field[i][j].setType(figure.getType());
    }
}
Field.prototype.moveFigure = function (i1, j1, i2, j2){
    if (this.isInField(i1, j1) === true && this.isInField(i2, j2) === true) {
        this.setFigure(i2, j2, this.getFigure(i1, j1));
        this.setFigure(i1, j1, new figure.Figure())
    }
}


Field.prototype.searchKing = function (color){
    for (let i = 0; i < this.w; i++) {
        for (let j = 0; j < this.h; j++){
            if (this.getFigure(i, j).getType() === figure.TYPES[figure.KING] && this.getFigure(i, j).getColor() === color){
                return {i, j};
            }
        }
    }
    return undefined;
}
Field.prototype.CheckForChess = function(color){
    const kingPos = this.searchKing(color);
    for (let i = 0; i < this.w; i++){
        for (let j = 0; j < this.h; j++){
            if (this.getFigure(i, j).gotType() === true && this.getFigure(i, j).getColor() !== color){
                const options = new options.Option(this, i, j, false);
                if (options.getMove(kingPos.i, kingPos.j) === options.PUNCH_MOVE){
                    return true;
                }
            }
        }
    }
    return false;
}

Field.prototype.isInField = function (i, j){
    if (i >= 0 && i < this.w && j >= 0 && j < this.h){
        return true;
    }
    return false;
}
Field.prototype.toString = function(){
    let out = ''
    for (let i = 0; i < this.w; i++){
        for (let j = 0; j < this.h; j++){
            out += this.getFigure(i, j).toString();
        }
        out += END_ROW_CHAR
    }
    out += END_FIELD_CHAR;
    return out;
}

Field.prototype.copy = function(){
    let out = new Field(this.w, this.h);
    for (let i = 0; i < this.w; i++){
        for (let j = 0; j < this.j; j++){
            out.setFigure(i, j, this.getFigure(i, j))
        }
    }
    return out;
}

module.exports = {Field, END_ROW_CHAR, END_FIELD_CHAR}
