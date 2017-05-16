
window.onload = function() {

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
                             { preload: preload, create: create });

  function preload () {
    game.load.image('logo', 'images/logo.png');
    game.load.spritesheet('ressources', 'images/ressources.png', 228, 228);
  }
  function create (){
    game.stage.backgroundColor = '#D9F0F0';
    //game.add.image(400, 300, 'ressources').anchor.setTo(0.5, 0.5);
    placeOne(100, 100, 1)
  }
  function placeOne(x, y, frame) {
    var ressource = game.add.sprite(
      x,
      y,
      'ressources',
      frame);
    ressource.anchor.setTo(0.5, 0.5);
    ressource.scale.setTo(0.5, 0.5);
  }
  
};