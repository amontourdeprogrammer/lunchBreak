var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var gameState = {
  players: 0,
  playerMap: {},
  ressources: [],
  game : true
};

var playerSockets= [];

for (var i = 0; i < 16; i++) {
  var ressource = {
    x: Math.floor(Math.random() * 24),
    y: Math.floor(Math.random() * 18),
    frame: i
  }
  gameState.ressources.push(ressource);
}

app.setIo = function(io) {
  console.log('set.io running');
  io.on('connection', function(socket){
    gameState.players += 1;
    io.emit('game state change', gameState);

    socket.on("new user", function(userInfo){
      //console.log("user info: ", userInfo);
      if (userInfo[0] in gameState.playerMap){
        console.log('yep');
      }else{
        console.log("new player")
        console.log("player map is", gameState.playerMap)
        playerSockets.push([userInfo[0], socket])
      }
      gameState.playerMap[userInfo[0]] = userInfo[1];
      io.emit('game state change', gameState);
      console.log(gameState.playerMap)

    });

    socket.on("Client : end the game", function(content){
      endOfGame(io)
    });

    socket.on('disconnect', function(socket){
      gameState.players -= 1;
      console.log("before deleting : ", playerSockets)
      for (i in range(playerSockets.length)-1){
        if (playerSockets[i][1] == socket){
            delete gameState.playerMap[playerSockets[i][0]]
            playerSockets.splice(i,1)
        }
      }
      console.log("after deleting : ", playerSockets)
      io.emit('game state change', gameState);

      if (gameState.players == 0){
          gameState.game = true;
          gameState.playerMap = {};
      };
    });
  });
};

module.exports = app;

function endOfGame(io){
    gameState.game = false
    io.emit('game state change', gameState)
    gameState.game = true
    gameState.playerMap = {};
}
