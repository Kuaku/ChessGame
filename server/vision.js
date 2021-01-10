const figure = require('./figure')
const field = require('./field')

const NO_VISION_CHAR = 'X';

const Vision = function (field, color){
    this.vision = [];
    for (let i = 0; i < field.getW(); i++){
        let row = [];
        for (let j = 0; j < field.getH(); j++){
            row.push({vision: false, figure: new figure.Figure()})
        }
        this.vision.push(row);
    }
    for (let i = 0; i < field.getW(); i++){
        for (let j = 0; j < field.getH(); j++){
            if (field.getFigure(i, j).getColor() === color){
                for (let x = i - 1; x <= i + 1; x++){
                    for (let y = j - 1; y <= j + 1; y++){
                        if (x >= 0 && x <= field.getW() - 1 && y >= 0 && y <= field.getH() - 1 && this.vision[x][y].vision === false){
                            this.vision[x][y].vision = true;
                            this.vision[x][y].figure.setType(field.getFigure(x, y).getType())
                            this.vision[x][y].figure.setColor(field.getFigure(x, y).getColor())
                        }
                    }
                }
            }
        }
    }
}

Vision.prototype.toString = function (){
    let out = ''
    for (let i = 0; i < this.vision.length; i++){
        for (let j = 0; j < this.vision[i].length; j++){
            if (this.vision[i][j].vision === false){
                out += NO_VISION_CHAR + NO_VISION_CHAR;
            } else {
                out += this.vision[i][j].figure.toString();
            }
        }
        out += field.END_ROW_CHAR
    }
    out += field.END_FIELD_CHAR;
    return out;
}

module.exports = {Vision, NO_VISION_CHAR}
