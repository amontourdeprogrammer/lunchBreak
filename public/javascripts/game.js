var socket = io();
var game = {};
var gameState = {
  players: 1,
  playerMap: {},
  ressources: [],
  game:true
};

var player;
var userID;
const max_x = 800;
const max_y = 600;
var playerText;

var ressourcesGroup;
var score = 0;
var scoreText;

var monsterMap = {};

window.onload = function() {
  game = new Phaser.Game(max_x, max_y, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};


function preload () {
  game.load.spritesheet('ressources', 'images/ressources.png', 32, 32);
  game.load.image('tiles', '/images/tile.png');
  game.load.image('star', '/images/star.png');
  game.load.image('player', '/images/logo.png');
  game.load.image('monster', '/images/monster.png', 100, 100);
}

socket.on('game state change', function (newGameState) {
  gameState = newGameState;
});

function create (){
  game.physics.startSystem(Phaser.Physics.ARCADE);

  placeWalls(game);
  placeRessources(game);

  game.stage.backgroundColor = '#d9f0f0';
  playerText = game.add.text(64, 362, "no user" , 16);
  othertext = game.add.text(64, 400, "no user" , 16);
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
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
    game.destroy();
  };

  ressourcesGroup.hash.forEach(function(res) {
    game.physics.arcade.overlap(player, res, collectRessource, null, this);
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

function placeCharacter(x, y) {
  player = game.add.sprite(x, y, 'player');
  player.anchor.setTo(0.5, 0.5);
  player.scale.setTo(0.2, 0.2);

  game.physics.enable(player, Phaser.Physics.ARCADE);
}

function moveCharacter() {
  userInfo = [userID, [player.body.x, player.body.y]]
  
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  if (cursors.left.isDown) { 
    if (player.body.x > 0) {
      player.body.velocity.x = -200;
      socket.emit("new user", userInfo);
    } else {
      player.body.velocity.x = 0;
    }
  }
  else if (cursors.right.isDown) {
    if (player.body.x < max_x-80) {
      player.body.velocity.x = 200;
      socket.emit("new user", userInfo);
    } else {
      player.body.velocity.x = 0;
    }
  }

  if (cursors.up.isDown) {
    if (player.body.y > 0){ 
      player.body.velocity.y = -200;
      socket.emit("new user", userInfo);
    } else {
      player.body.velocity.y = 0;
    }
  }
  else if (cursors.down.isDown) {
    if (player.body.y < max_y-80){
      player.body.velocity.y = 200;
      socket.emit("new user", userInfo);
    } else {
      player.body.velocity.y = 0;
    }
  }

}

MonsterPlayer = function (userID, x ,y) {
  this.monster = game.add.sprite(x ,y, 'monster');

  game.physics.enable(this.monster, Phaser.Physics.ARCADE);

  this.monster.name = userID;
  this.monster.anchor.set(0.5);
  this.monster.scale.setTo(0.8, 0.8);
};

MonsterPlayer.prototype.update = function() {
  this.monster.body.x = gameState.playerMap[this.monster.name][0]
  this.monster.body.y = gameState.playerMap[this.monster.name][1]
}

function destroyMonster() {
    this.monster.destroy();
}

function MonsterRollCall(){
  playerList = gameState.playerMap
  for(foe in playerList){
    if (foe in monsterMap){
      
    }
    else if (foe == userID){ continue; } 
    else {
    monsterMap[foe] = new MonsterPlayer(foe, playerList[foe][0],playerList[foe][1] )
    }
  }
  for(foe in monsterMap){
    if (foe in playerList){
      continue;
    }else{
      monsterMap[foe].monster.destroy() ;
      delete monsterMap[foe]

    }
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
  ressourcesGroup = game.add.group();

  ressourcesGroup.enableBody = true;
  //ressourcesGroup.physicsBodyType = Phaser.physics.ARCADE;

  gameState.ressources.forEach(function (gsRessource) {
    var ressource = ressourcesGroup.create(gsRessource.x, gsRessource.y, 'star');
  });
}


function collectRessource (player, ressource) {
  ressource.kill();

  score += 10;
  scoreText.text = 'Score: ' + score;
}

