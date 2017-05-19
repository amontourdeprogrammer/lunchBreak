var socket = io();
var game = {};
var gameState = {players: 1};

var player;
const max_x = 800;
const max_y = 600;

var playerMapClient = {};

window.onload = function() {
  game = new Phaser.Game(max_x, max_y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};

socket.on('game state change', function (newGameState) {
  gameState = newGameState;
  console.log(gameState);
});

function preload () {
  game.load.spritesheet('ressources', 'images/ressources.png', 32, 32);
  game.load.image('tiles', '/images/tile.png');
  game.load.image('player', '/images/logo.png');
}

function create (){

  placeWalls(game);
  placeRessources(game);

  game.stage.backgroundColor = '#D1EDEC';
  text = game.add.text(64, 362, "no user" , 16);

  cursors = game.input.keyboard.createCursorKeys();
  var x = Math.floor(Math.random() * (max_x-100)) + 50;
  var y = Math.floor(Math.random() * (max_y-100)) + 50;
  placeCharacter(x,y);
  userID = Math.random() * 1000;
  socket.emit("new user",{userObj:userID, xObj:x, yObj:y});
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

function placeWalls(game) {
  wallsMap = game.add.tilemap();
  wallsMap.addTilesetImage('tiles');

  wallsLayer = wallsMap.create('walls', 40, 30, 32, 32);

  placeWall(10, 10, 'vertical', 3, wallsLayer);
  placeWall(3, 0, 'vertical', 7, wallsLayer);
  placeWall(10, 9, 'horizontal', 4, wallsLayer);
  placeWall(20, 5, 'horizontal', 5, wallsLayer);
  placeWall(18, 13, 'vertical', 5, wallsLayer);
  placeWall(15, 0, 'vertical', 8, wallsLayer);
  placeWall(0, 14, 'horizontal', 6, wallsLayer);
}

function placeWall(x, y, direction, tileLength, layer) {
  if(direction==='vertical') {
    for(i=0; i<tileLength; i++) {
      wallsMap.putTile(0, x, y + i, layer);
    }
  } else if(direction==='horizontal') {
    for(i=0; i<tileLength; i++) {
      wallsMap.putTile(0, x + i, y, layer);
    }
  }
}

function placeRessources(game) {
  ressourcesMap = game.add.tilemap();
  ressourcesMap.addTilesetImage('ressources');

  ressourcesLayer = ressourcesMap.create('space_backgrounds', 40, 30, 32, 32);

  gameState.ressources.forEach(function (ressource) {
    ressourcesMap.putTile(ressource.frame, ressource.x ,ressource.y, ressourcesLayer);

  });
}
