
window.onload = function() {

  var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
                             { preload: preload });

  function preload () {
    game.load.image('logo', 'images/logo.png');
    //game.load.spritesheet('tiles', 'images/tiles.png', 32, 32);
  }

  
};