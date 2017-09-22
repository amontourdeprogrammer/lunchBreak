function placeResources(game) {
  resourcesGroup = game.add.group();

  resourcesGroup.enableBody = true;
  //resourcesGroup.physicsBodyType = Phaser.physics.ARCADE;

  gameState.resources.forEach(function (gsResource) {
    var resource = resourcesGroup.create(gsResource.x, gsResource.y, 'star');
  });
}

function collectResource(player, resource) {
  resource.kill();
  socket.emit("collectedFromClient", resourcesGroup.hash.indexOf(resource));
  score += 10;
  scoreText.text = 'Score: ' + score;
}
