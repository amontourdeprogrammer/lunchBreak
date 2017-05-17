var socket = io();
var game = {};
var gameState = {players: 1};

var player;
const max_x = 800;
const max_y = 600;

window.onload = function() {
  game = new Phaser.Game(max_x, max_y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};

socket.on('game state change', function (newGameState) {
  gameState = newGameState;
});

function preload () {
  game.load.image('player', 'images/logo.png');
  game.load.spritesheet('ressources', 'images/ressources.png', 228, 228);
}

function create (){
  game.stage.backgroundColor = '#D9F0F0';
  text = game.add.text(64, 362, "no user" , 16);
  cursors = game.input.keyboard.createCursorKeys();
  placeOne(100, 100, 1);
  var x = Math.floor(Math.random() * (max_x-100)) + 50;
  var y = Math.floor(Math.random() * (max_y-100)) + 50;
  placeCharacter(x,y);
  
}

function update () {
  text.text = "Players : " + gameState.players;
  moveCharacter(); 
}

function placeOne(x, y, frame) {
  var ressource = game.add.sprite(x, y, 'ressources', frame);
  ressource.anchor.setTo(0.5, 0.5);
  ressource.scale.setTo(0.5, 0.5);
}

function placeCharacter(x, y) {
  player = game.add.sprite(x, y, 'player');
  player.anchor.setTo(0.5, 0.5);
  player.scale.setTo(0.2, 0.2);

  game.physics.arcade.enable(player);
}

function moveCharacter() {
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  if (cursors.left.isDown)
  {
      player.body.velocity.x = -200;
  }
  else if (cursors.right.isDown)
  {
      player.body.velocity.x = 200;
  }

  if (cursors.up.isDown)
  {
      player.body.velocity.y = -200;
  }
  else if (cursors.down.isDown)
  {
      player.body.velocity.y = 200;
  }
}