console.log("server started")
const chess = require('./chess')
const figure = require('./figure')
const chessGame = new chess.ChessGame();
chessGame.initWhiteFirstRow('RBNKQNBR');
chessGame.initBlackFirstRow('RBNKQNBR');
chessGame.start()
chessGame.getField().setFigure(4, 4, new figure.Figure('W', 'Q'))
console.log(chessGame.getField().toString())
console.log(chessGame.getWhiteVision());
console.log(chessGame.getBlackVision());
//console.log(chessGame.getOptions(6, 0))
console.log(chessGame.getOptions(4, 4).toString())
