class Game {
  constructor() {
    this.app = null
    this.player = []
    this.keys = []
    this.keysDiv = document.querySelector('#keys')
  }
  
  startGame = () => {
    this.createGame()
    this.createPlayer()
    this.initHandlers()
  }
  
  createGame = () => {
    this.app = new PIXI.Application({
      width : 400,
      height: 400
    })
    this.app.stage.interactive = true
    this.app.ticker.add(this.gameLoop)
    
    const wrapper = document.querySelector('.wrapper')
    wrapper.appendChild(this.app.view)
  }
  
  createPlayer = () => {
    this.player = new PIXI.Sprite.from('./src/img/shuttle.png')
    this.player.anchor.set(0.5)
    this.player.scale.set(0.5)
    this.player.x = this.app.view.width / 2
    this.player.y = this.app.view.height / 2
    
    this.app.stage.addChild(this.player)
  }
  
  gameLoop = () => {
    this.keysDiv.innerHTML = JSON.stringify(this.keys)
  }
  
  initHandlers = () => {
    this.app.stage.on('pointermove', this.movePlayer)
    window.addEventListener('keydown', this.keysDown)
    window.addEventListener('keyup', this.keysUp)
  }
  
  movePlayer = (e) => {
    // const pos = e.data.global
    //
    // this.player.x = pos.x
    // this.player.y = pos.y
  }
  
  keysDown = (e) => {
    this.keys[e.keyCode] = true
  }
  
  keysUp = (e) => {
    this.keys[e.keyCode] = false
    
    // w
    if (this.keys['87']) {
      this.player.x -= 5
    }
    // s
    if (this.keys['65']) {
      this.player.x -= 5
    }
    // a
    if (this.keys['8']) {
      this.player.x += 5
    }
    // d
    if (this.keys['87']) {
      this.player.x += 5
    }
  }
  
}

new Game().startGame()



