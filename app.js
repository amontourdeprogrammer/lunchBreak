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
  resources: [],
  game : true
};

var playerSockets= [];
var howManyResources = 16
for (var i = 0; i < howManyResources; i++) {
  var resource = {
    x: Math.floor(Math.random() * 725 + 25),
    y: Math.floor(Math.random() * 550 + 25),
    frame: i
  }
  gameState.resources.push(resource);
}

var howManyResourcesLeft = howManyResources

app.setIo = function(io) {
  io.on('connection', function(socket){
    gameState.players += 1;
    io.emit('game state change', gameState);

    socket.on("new user", function(userInfo){
      user_id = userInfo[0]
      user_coordinates = userInfo[1]
      if (userInfo[0] in gameState.playerMap){

      }else{
        playerSockets.push([user_id, socket.id ])
      }
      gameState.playerMap[user_id] = user_coordinates;
      io.emit('game state change', gameState);

    });

    socket.on("collectedFromClient", function(hashIndex){
      howManyResourcesLeft -= 1
      if (howManyResourcesLeft < 1){
        endOfGame(io)
      }
     io.emit("collectedFromServer", hashIndex);
    });

    socket.on("Client : end the game", function(content){
      endOfGame(io)
    });
    socket.on("gameOver", function(content){
      gameState.game = true;
      howManyResourcesLeft = howManyResources
    });

    socket.on('disconnect', function(){
      gameState.players -= 1;
      for (var i = 0 ; i < playerSockets.length; i++){
        if (playerSockets[i][1] == socket.id){
            delete gameState.playerMap[playerSockets[i][0]]
            playerSockets.splice(i,1)
        }
      }
      io.emit('game state change', gameState);
      if (gameState.players == 0){
          gameState.game = true;
          gameState.playerMap = {};
          howManyResourcesLeft = howManyResources
      };
    });
  });
};

module.exports = app;

function endOfGame(io){
    gameState.game = false;
    io.emit('game state change', gameState)
    gameState.playerMap = {};
}
