var socket = io();
var game = {};
var gameState = {players: 1};

window.onload = function() {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};

socket.on('game state change', function (newGameState) {
  gameState = newGameState;
});

function preload () {
  game.load.image('logo', 'images/logo.png');
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
}

function update () {
  text.text = "Players : " + gameState.players;
}
