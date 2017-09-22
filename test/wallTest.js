var { isThisTileAWall }= require("../public/javascripts/walls.js");
var assert = require('assert');


describe('Truth', function() {
    it('should return True', function() {
      assert.equal(44, 44);
    });
  });

describe('check if tile is a wall', function(){ it('should return true is tile is a wall', function(){
	var wallTiles = [[10,10]]
	assert.equal(isThisTileAWall([10,10], wallTiles), true)
})

})
