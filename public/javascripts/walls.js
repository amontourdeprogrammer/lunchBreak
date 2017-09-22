var wallTiles = [];

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
      wallTiles.push([x, y+i]);

    }
  } else if(direction==='horizontal') {
    for(i=0; i<tileLength; i++) {
      wallsMap.putTile(0, x + i, y, layer);
      wallTiles.push([x + i, y]);
    }
  }
}

function isThisTileAWall(tileCoordinates, wallTiles){
    function matchCoordinates(element, index, array) {
      return element[0] == tileCoordinates[0] && element[1] == tileCoordinates[1];
    }
    return wallTiles.some(matchCoordinates);
}

module.exports = { isThisTileAWall };
