console.log("server started")
const mang = require('./lobbymanager')

const id1 = 'abc', id2 = 'cba';
const lobbys = new mang.LobbyManager();

lobbys.createLobby(id1);
lobbys.joinLobby(id2, lobbys.getInfo(id1).key)
lobbys.setReady(id1);
lobbys.setReady(id2);
lobbys.selectFirstRow(id1, 'RBNKQNBR')
lobbys.selectFirstRow(id2, 'RBNKQNBR')
if (lobbys.getOptions(id1, 6, 2) !== undefined){
    console.log(lobbys.getOptions(id1, 6, 2).toString())
    console.log(lobbys.getInfo(id1));
    console.log(lobbys.getInfo(id2));
    lobbys.makeMove(id1, 6, 2, 4, 2);
    console.log(lobbys.getInfo(id1));
    console.log(lobbys.getInfo(id2));
} else {
    console.log("Not")
}
