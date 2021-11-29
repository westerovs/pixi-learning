const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function loadImage(path) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = path
  });
}

function getTop(el) {
  if (el.offsetParent) {
    return getTop(el.offsetParent) + el.offsetTop;
  }
  return el.offsetTop;
}

function getLeft(el) {
  if (el.offsetParent) {
    return getLeft(el.offsetParent) + el.offsetLeft;
  }
  return el.offsetLeft;
}

Promise.all([
  fetch('/map.json').then(r => r.json()),
  loadImage('https://cdn.glitch.com/bf08baaa-913a-4fd3-af23-ba148998403d%2Fnature-paltformer-tileset-16x16.png?v=1562185449857')
]).then(init).catch(e => console.error(e));

const TILESIZE = 16;
const SCALE = 2;

let dbg = document.querySelector('pre');
let mapArea = document.querySelector('.map-area');
let layerSelect = document.querySelector('.layer').elements.layer;
let copyButton = document.querySelector('.copy');
let currentTile = 0;

function init([map, tileSet]) {
  
  let tilesWidth = (tileSet.width / TILESIZE | 0);
  let tileCount = tilesWidth * (tileSet.height / TILESIZE | 0);
  let drawing = false;
  let drawValue = null;
  
  function draw(x, y) {
    if (!map[layerSelect.value]) {
      throw new Error('*** SELECT LAYER ! ***')
      return
    }
    
    map[layerSelect.value][y * map.width + x] = drawValue;
  }
  
  function flood(x, y) {
    let {width, height} = map;
    let pos = (y * width + x);
    let layer = map[layerSelect.value];
    let sampledValue = layer[pos];
    let floodValue = currentTile;
    
    if (layerSelect.value === 'collision') {
      floodValue = 1 - sampledValue;
    }
    
    let seen = new Set();
    let stack = [pos];
    
    while (stack.length) {
      let p = stack.pop();
      seen.add(p);
      
      layer[p] = floodValue;
      
      let x = p % width;
      let y = p / width | 0;
      
      if (!seen.has(p + 1) &&
        x < width - 1 &&
        layer[p + 1] === sampledValue) {
        stack.push(p + 1);
      }
      if (!seen.has(p - 1) &&
        x > 0 &&
        layer[p - 1] === sampledValue) {
        stack.push(p - 1);
      }
      if (!seen.has(p + width) &&
        y < height - 1 &&
        layer[p + width] === sampledValue) {
        stack.push(p + width);
      }
      if (!seen.has(p - width) &&
        y > 0 &&
        layer[p - width] === sampledValue) {
        stack.push(p - width);
      }
    }
  }
  
  function drawMap() {
    mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    for (let i = 0; i < map.stage.length; i++) {
      let x = i % map.width;
      let y = i / map.width | 0;
      if (map.sky[i] !== 12)
        drawTile(x * TILESIZE * SCALE, y * TILESIZE * SCALE, map.sky[i]);
      if (map.background[i] !== 12)
        drawTile(x * TILESIZE * SCALE, y * TILESIZE * SCALE, map.background[i]);
      if (map.stage[i] !== 12)
        drawTile(x * TILESIZE * SCALE, y * TILESIZE * SCALE, map.stage[i]);
      if (map.collision[i]) {
        mapCtx.fillStyle = 'rgba(255,0,0,0.25)';
        mapCtx.fillRect(x * TILESIZE * SCALE, y * TILESIZE * SCALE, TILESIZE * SCALE, TILESIZE * SCALE);
      }
    }
  }
  
  function drawTile(x, y, tile) {
    mapCtx.drawImage(
      tileSet,
      (tile % tilesWidth) * TILESIZE,
      (tile / tilesWidth | 0) * TILESIZE,
      TILESIZE, TILESIZE,
      x, y, TILESIZE * SCALE, TILESIZE * SCALE
    );
  }
  
  function drawTiles() {
    tileCtx.clearRect(0, 0, tileCanvas.width, tileCanvas.height);
    tileCtx.drawImage(tileSet, 0, 0, tileCanvas.width, tileCanvas.height);
    tileCtx.strokeStyle = 'red';
    tileCtx.lineWidth = 2;
    let x = (currentTile % tilesWidth) * TILESIZE * SCALE;
    let y = (currentTile / tilesWidth | 0) * TILESIZE * SCALE;
    tileCtx.strokeRect(x + .5, y + .5, TILESIZE * SCALE - 1, TILESIZE * SCALE - 1);
    tileCtx.strokeStyle = '#000';
  }
  
  function getMapCoords(e) {
    return [
      (e.pageX - getLeft(mapCanvas) + mapArea.scrollLeft) / TILESIZE / SCALE | 0,
      (e.pageY - getTop(mapCanvas) + mapArea.scrollTop) / TILESIZE / SCALE | 0,
    ];
  }
  
  function getTileCoords(e) {
    return [
      (e.pageX - getLeft(tileCanvas)) / TILESIZE / SCALE | 0,
      (e.pageY - getTop(tileCanvas)) / TILESIZE / SCALE | 0,
    ];
  }
  
  let mapCanvas = document.querySelector('.map');
  mapCanvas.width = map.width * TILESIZE * SCALE;
  mapCanvas.height = map.height * TILESIZE * SCALE;
  let mapCtx = mapCanvas.getContext('2d');
  mapCtx.imageSmoothingEnabled = false;
  drawMap();
  
  mapCanvas.addEventListener('mousemove', function (e) {
    let [x, y] = getMapCoords(e);
    dbg.innerText = [x, y];
    drawMap();
    mapCtx.strokeRect(x * TILESIZE * SCALE, y * TILESIZE * SCALE, TILESIZE * SCALE, TILESIZE * SCALE);
    if (drawing) {
      draw(x, y);
      drawMap();
    }
  });
  
  mapCanvas.addEventListener('mousedown', function (e) {
    if (shift) {
      return;
    }
    drawing = true;
    let [x, y] = getMapCoords(e);
    let pos = y * map.width + x;
    if (layerSelect.value === 'collision') {
      drawValue = 1 - map.collision[pos];
    } else {
      drawValue = currentTile;
    }
    draw(x, y);
    drawMap();
  });
  
  mapCanvas.addEventListener('mouseup', function (e) {
    drawing = false;
  });
  
  mapCanvas.addEventListener('click', function (e) {
    if (shift) {
      let [x, y] = getMapCoords(e);
      flood(x, y);
      drawMap();
    }
  });
  
  let shift = false;
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Shift') {
      shift = true;
    }
  });
  window.addEventListener('keyup', function (e) {
    if (e.key === 'Shift') {
      shift = false;
    }
  });
  
  let tileCanvas = document.querySelector('.tiles');
  tileCanvas.width = tileSet.width * SCALE;
  tileCanvas.height = tileSet.height * SCALE;
  let tileCtx = tileCanvas.getContext('2d');
  tileCtx.imageSmoothingEnabled = false;
  drawTiles();
  
  copyButton.addEventListener('click', e => {
    copyToClipboard(JSON.stringify(map));
  });
  
  tileCanvas.addEventListener('mousemove', function (e) {
    let [x, y] = getTileCoords(e);
    drawTiles();
    tileCtx.strokeRect(x * TILESIZE * SCALE, y * TILESIZE * SCALE, TILESIZE * SCALE, TILESIZE * SCALE);
  });
  
  tileCanvas.addEventListener('click', function (e) {
    let [x, y] = getTileCoords(e);
    currentTile = y * tilesWidth + x;
    drawTiles();
  });
  
  
}
