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
