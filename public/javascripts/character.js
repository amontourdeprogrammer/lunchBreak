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
