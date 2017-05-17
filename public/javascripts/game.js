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
  game.load.spritesheet('ressources', 'images/ressources.png', 32, 32);
}

function create (){
  map = game.add.tilemap();
  map.addTilesetImage('ressources');
  layer_background = map.create('space_backgrounds', 40, 30, 32, 32);
  map.putTile(0,24,0, layer_background);
  map.putTile(1,2,3, layer_background);

  game.stage.backgroundColor = '#D1EDEC';
  text = game.add.text(64, 362, "no user" , 16);

  cursors = game.input.keyboard.createCursorKeys();
  var x = Math.floor(Math.random() * (max_x-100)) + 50;
  var y = Math.floor(Math.random() * (max_y-100)) + 50;
  placeCharacter(x,y);

}

function update () {
  text.text = "Players : " + gameState.players;
  moveCharacter();
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
