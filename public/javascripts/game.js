var socket = io();
var game = {};
var gameState = {
  players: 1,
  playerMap: {},
  resources: [],
  game:true
};

var player;
var userID;
const max_x = 800;
const max_y = 600;
var playerText;
var resourcesGroup;
var score = 0;
var scoreText;

var monsterMap = {};

window.onload = function() {
  game = new Phaser.Game(max_x, max_y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};


function preload () {
  game.load.spritesheet('resources', 'images/resources.png', 32, 32);
  game.load.image('tiles', '/images/tile.png');
  game.load.image('star', '/images/star.png');
  game.load.image('player', '/images/logo.png');
  game.load.image('monster', '/images/monster.png', 100, 100);
}

socket.on('game state change', function (newGameState) {
  gameState = newGameState;
});

socket.on('collectedFromServer', function (hashIndex) {
  resourcesGroup.hash[hashIndex].kill()
});

function create (){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  placeWalls(game);
  placeResources(game);

  game.stage.backgroundColor = '#d9f0f0';
  playerText = game.add.text(64, 362, "no user" , 16);
  othertext = game.add.text(64, 400, "no user" , 16);
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  stateText = game.add.text(100, 200, '', { fontSize: '64px', fill: '#000' });
  cursors = game.input.keyboard.createCursorKeys();
  endGame = game.input.keyboard.addKeys( { 'end': Phaser.KeyCode.T} );

  var x = Math.floor(Math.random() * (max_x-100)) + 50;
  var y = Math.floor(Math.random() * (max_y-100)) + 50;

  placeCharacter(x,y);
  userID = Math.floor(Math.random()*1000);
  userInfo = [userID, [x, y]]
  socket.emit("new user", userInfo);
  MonsterRollCall()

}

function update () {
  if(gameState.game == false){
    player.kill();
    stateText.text = "GAME OVER"
    socket.emit("gameOver", true);
  };

  resourcesGroup.hash.forEach(function(res) {
    game.physics.arcade.overlap(player, res, collectResource, null, this);
  });

  playerText.text = "Players : " + gameState.players;
  othertext.text = "this Players : " + userID;
  moveCharacter();
  MonsterRollCall()
  for(i in monsterMap){
    monsterMap[i].update()
  }
  if (endGame.end.isDown){
    socket.emit("Client : end the game", 0);
  }
}
