const lobby = require('./lobby');
const crypto = require('crypto')

const LobbyManager = function (){
    this.lobbys = [];
}

LobbyManager.prototype.isKey = function (key){
    for (let i = 0; i < this.lobbys.length; i++){
        if (this.lobbys[i].getKey() === key){
            return i;
        }
    }
    return -1;
}

LobbyManager.prototype.findIDLobby = function (id){
    for (let i = 0; i < this.lobbys.length; i++){
        if (this.lobbys[i].isUser(id) !== -1){
            return i;
        }
    }
    return -1;
}

LobbyManager.prototype.leaveLobby = function (id){
    const lobbyID = this.findIDLobby(id);
    if (lobbyID !== -1){
        this.lobbys[lobbyID].removeUser(id);
        if (this.lobbys[lobbyID].getStage() > lobby.READY_STAGE || this.lobbys[lobbyID].hasUser() === false){
            this.lobbys.splice(lobbyID, 1);
            return true;
        }
    }
    return false;
}

LobbyManager.prototype.createLobby = function (id){
    this.leaveLobby(id);
    let key = crypto.randomBytes(4).toString('hex');
    while (this.isKey(key) !== -1) {
        key = crypto.randomBytes(4).toString('hex');
    }
    this.lobbys.push(new lobby.Lobby(key, id))
    return key;
}
LobbyManager.prototype.joinLobby = function (id, key){
    this.leaveLobby(id);
    const lobbyID = this.isKey(key);
    if (lobbyID !== -1){
        if (this.lobbys[lobbyID].addUser(id) === true){
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
LobbyManager.prototype.setReady = function (id){
    const lobbyID = this.findIDLobby(id);
    if (lobbyID !== -1){
        if (this.lobbys[lobbyID].changeReady(id) !== -1){
            this.lobbys[lobbyID].setSelectState()
            return true;
        }
        return false;
    }
    return false;
}
LobbyManager.prototype.selectFirstRow = function (id, firstRow){
    const lobbyID = this.findIDLobby(id);
    if (lobbyID !== -1){
        if (this.lobbys[lobbyID].selectFirstRow(id, firstRow) === true){
            this.lobbys[lobbyID].setGameState();
            return true;
        }
        return false;
    }
    return false;
}
LobbyManager.prototype.getOptions = function (id, i, j){
    const lobbyID = this.findIDLobby(id);
    if (lobbyID !== -1){
        return this.lobbys[lobbyID].getOptions(id, i, j)
    }
    return undefined;
}

LobbyManager.prototype.makeMove = function (id, i1, j1, i2, j2){
    const lobbyID = this.findIDLobby(id);
    if (lobbyID !== -1){
        if (this.lobbys[lobbyID].makeMove(id, i1, j1, i2, j2) === true){
            if (this.lobbys[lobbyID].checkForEnd() !== -1){

            }
            return true;
        }
        return false;
    }
    return false;
}

LobbyManager.prototype.getInfo = function (id){
    const lobbyID = this.findIDLobby(id);
    if (lobbyID !== -1){
        let out = {};
        out.opponent = {};
        out.opponent.id = this.lobbys[lobbyID].getOtherUser(id);
        if (this.lobbys[lobbyID].getStage() === lobby.READY_STAGE) {
            out.stage = 0;
            out.key = this.lobbys[lobbyID].getKey();
            out.isReady = this.lobbys[lobbyID].readyState(id);
            if (out.opponent.id !== undefined) {
                out.opponent.isReady = this.lobbys[lobbyID].readyState(out.opponent.id);
            }
        } else if (this.lobbys[lobbyID].getStage() === lobby.SELECT_STAGE) {
            out.stage = 1;
            out.color = this.lobbys[lobbyID].getColor(id);
            out.isSelected = this.lobbys[lobbyID].selectState(id);
            if (out.opponent.id !== undefined) {
                out.opponent.isSelected = this.lobbys[lobbyID].selectState(out.opponent.id);
            }
        } else if (this.lobbys[lobbyID].getStage() === lobby.GAME_STAGE){
            out.stage = 2;
            out.color = this.lobbys[lobbyID].getColor(id);
            out.vision = this.lobbys[lobbyID].getVision(id);
            out.turn = this.lobbys[lobbyID].getTurn(id);
        } else if (this.lobbys[lobbyID].getStage() === lobby.END_STAGE){
            out.stage = 3;
            out.color = this.lobbys[lobbyID].getColor(id);
            if (this.lobbys[lobbyID].end === lobby.REMIS){
                out.score = 0;
            } else {
                if (this.lobbys[lobbyID].isWinner(id) === false){
                    out.score = 1;
                } else {
                    out.score = 2;
                }
            }
        }
        return out;
    }
    return {stage: -1};
}

module.exports = {LobbyManager}
