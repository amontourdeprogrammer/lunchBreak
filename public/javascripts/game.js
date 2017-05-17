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
  game.load.spritesheet('ressources', 'images/ressources.png', 228, 228);
}

function create (){
  game.stage.backgroundColor = '#D9F0F0';
  text = game.add.text(64, 362, "no user" , 16);
  placeOne(100, 100, 1)
}

function update () {
  text.text = "Players : " + gameState.players;
}

function placeOne(x, y, frame) {
  var ressource = game.add.sprite(x, y, 'ressources', frame);
  ressource.anchor.setTo(0.5, 0.5);
  ressource.scale.setTo(0.5, 0.5);
}

