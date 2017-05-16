var socket = io();

window.onload = function() {

  //var game = new Phaser.Game(800, 600, Phaser.AUTO, '',
    //                         { preload: preload, create: create });
  socket.emit('hello', 'Hello world');


  // function onPlaced(info) {
  //   placeOne(info.x, info.y, info.frame);
  // }
};
