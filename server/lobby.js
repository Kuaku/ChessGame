const chess = require('./chess')
const MAX_LOBBY_SIZE = 2;
const READY_STAGE = 0, SELECT_STAGE = 1, GAME_STAGE = 2, END_STAGE = 3;
const REMIS = 0, CHESS = 1;

const Lobby = function(key, userID) {
    this.key = key;
    this.user = [{userID, ready: false}]
    this.stage = 0;
    this.white = 0;
    this.end = -1;
    this.winner = -1;
    this.chessGame = new chess.ChessGame();
}
Lobby.prototype.getKey = function(){
    return this.key;
}
Lobby.prototype.addUser = function(userID){
    if (this.user.length > MAX_LOBBY_SIZE){
        return false;
    } else {
        for (let i = 0; i < this.user.length; i++){
            this.user[i].ready = false;
        }
        this.user.push({userID, ready: false});
        return true;
    }
}
Lobby.prototype.getVision = function (userID){
    if (this.stage === GAME_STAGE && this.isUser(userID) !== -1){
        if (this.isUser(userID) === this.white){
            return this.chessGame.getWhiteVision()
        } else {
            return this.chessGame.getBlackVision()
        }
    }
    return undefined;
}
Lobby.prototype.getTurn = function (userID){
    if (this.isUser(userID) !== -1) {
        return this.chessGame.getTurn()
    }
    return undefined;
}
Lobby.prototype.getColor = function(userID){
    if (this.isUser(userID) !== -1){
        if (this.isUser(userID) === this.white){
            return 0;
        } else {
            return 1;
        }
    }
}

Lobby.prototype.getStage = function (){
    return this.stage;
}

Lobby.prototype.setSelectState = function (){
    if (this.stage === READY_STAGE && this.user.length === MAX_LOBBY_SIZE){
        for (let i = 0; i < this.user.length; i++){
            if (this.user[i].ready === false){
                return false;
            }
        }
        this.stage = SELECT_STAGE;
        this.white = Math.round(Math.random()*1);
        return true;
    }
    return false;
}
Lobby.prototype.setGameState = function (){
    if (this.stage === SELECT_STAGE && this.chessGame.start() === true){
        this.stage = GAME_STAGE;
        return true;
    }
    return false;
}

Lobby.prototype.selectFirstRow = function (userID, firstRow){
    if (this.stage === SELECT_STAGE && this.isUser(userID) !== -1){
        if (this.isUser(userID) === this.white){
            if (this.chessGame.initWhiteFirstRow(firstRow) === true){
                return true;
            }
        } else {
            if (this.chessGame.initBlackFirstRow(firstRow) === true){
                return true;
            }
        }
    }
    return false;
}
Lobby.prototype.getOptions = function (userID, i, j){
    if (this.stage === GAME_STAGE && this.isUser(userID) !== -1){
        if (this.chessGame.getTurn() === 0 && this.isUser(userID) === this.white){
            return this.chessGame.getOptions(i, j)
        } else if (this.chessGame.getTurn() === 1 && this.isUser(userID) !== this.white){
            return this.chessGame.getOptions(i, j)
        }     
    }
    return undefined;
}
Lobby.prototype.makeMove = function (userID, i1, j1, i2, j2, special){
    if (this.stage === GAME_STAGE && this.isUser(userID) !== -1){
        if (this.chessGame.getTurn() === 0 && this.isUser(userID) === this.white){
            return this.chessGame.makeMove(i1, j1, i2, j2, special)
        } else if (this.chessGame.getTurn() === 1 && this.isUser(userID) !== this.white){
            return this.chessGame.makeMove(i1, j1, i2, j2, special)
        }
    }
    return false;
}
Lobby.prototype.checkForEnd = function (){
    if (this.stage === GAME_STAGE && this.chessGame.checkForOptions() === false){
        this.stage = END_STAGE
        if (this.chessGame.checkForChess() === true){
            this.end = CHESS;
            this.winner = Math.abs(this.getTurn() - 1);
            return CHESS;
        } else {
            this.end = REMIS;
            return REMIS;
        }
    }
    return -1;
}

Lobby.prototype.isWinner = function (userID){
    if (this.stage === END_STAGE && this.isUser(userID) !== -1){
        if (this.isUser(userID) === this.winner){
            return true;
        } else {
            return false;
        }
    }
    return false;
}

Lobby.prototype.changeReady = function (userID){
    if (this.stage === READY_STAGE && this.isUser(userID) !== -1){
        if (this.user[this.isUser(userID)].ready === false){
            this.user[this.isUser(userID)].ready = true;
            return 1;
        } else {
            this.user[this.isUser(userID)].ready = false;
            return 0;
        }
    }
    return -1;
}
Lobby.prototype.isUser = function (userID){
    for (let i = 0; i < this.user.length; i++){
        if (userID === this.user[i].userID){
            return i;
        }
    }
    return -1;
}
Lobby.prototype.removeUser = function (userID){
    if (this.isUser(userID) !== -1){
        this.user.splice(this.isUser(userID), 1);
        for (let i = 0; i < this.user.length; i++){
            this.user[i].ready = false;
        }
        return true;
    }
    return false;
}
Lobby.prototype.hasUser = function(){
    if (this.user.length === 0){
        return false;
    }
    return true;
}

Lobby.prototype.getOtherUser = function(userID){
    if (this.isUser(userID) !== -1){
        if (this.user.length === 2){
            return this.user[Math.abs(this.isUser(userID)-1)].userID;
        }
    }
    return undefined;
}
Lobby.prototype.readyState = function(userID){
    if (this.isUser(userID) !== -1){
        return this.user[this.isUser(userID)].ready;
    }
    return false;
}
Lobby.prototype.selectState = function (userID){
    if (this.isUser(userID) !== -1){
        if (this.isUser(userID) === this.white){
            return this.chessGame.whiteInit;
        } else {
            return this.chessGame.blackInit;
        }
    }
    return false;
}

module.exports = {Lobby, READY_STAGE, GAME_STAGE, MAX_LOBBY_SIZE, CHESS, REMIS, SELECT_STAGE, END_STAGE}
