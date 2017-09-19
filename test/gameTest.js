var game = require("../public/javascripts/game.js");
var assert = require('assert');


describe('Truth', function() {
    it('should return True', function() {
      assert.equal(44, 44);
    });
  });

describe('Check if a set of coordinates are on the right tile', function() {
  it('should return an array of tile coordinates', function() {
    var widthInPixels = 800;
    var tileSize = 32;
    var heightInPixels = 600;
    var tileHeight = 32;
    var x = 410;
    var y = 310;
    var xTile = 21;
    var yTile = 16;
    assert.equal(game.
      whichTile([x,y]), [xTile, yTile]);
  });
});
