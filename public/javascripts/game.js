var socket = io();

window.onload = function() {

    socket.emit('hello','Hello world');

};
