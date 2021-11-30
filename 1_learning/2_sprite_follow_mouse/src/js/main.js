class Game {
  constructor() {
    this.app = null
    this.player = null
  }
  
  start = () => {
    this.createGame()
    this.createPlayer()
    this.app.stage.on('pointermove', this.movePlayer)
  }
  
  createGame = () => {
    this.app = new PIXI.Application({
      width : 400,
      height: 400
    })
    
    this.app.stage.interactive = true
  
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
  
  movePlayer = (e) => {
    const pos = e.data.global
  
    this.player.x = pos.x
    this.player.y = pos.y
  }
  
}

new Game().start()



