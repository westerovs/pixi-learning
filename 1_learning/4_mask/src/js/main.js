// Create the application helper and add its render target to the page
let app = new PIXI.Application({ width: 640, height: 360 })
document.body.appendChild(app.view)

// Create window frame
let frame = new PIXI.Graphics()
frame.beginFill(0x666666)
frame.lineStyle({ color: 0xffffff, width: 4, alignment: 0 })
frame.drawRect(0, 0, 208, 208)
frame.position.set(320 - 100, 180 - 100)
app.stage.addChild(frame)

// create mask
let mask = new PIXI.Graphics()
mask.beginFill(0xffffff)
mask.drawRect(0,0,200,200)
mask.endFill()

// Добавить контейнер, в котором будет храниться наш замаскированный контент
let maskContainer = new PIXI.Container()
// Установите маску, чтобы использовать наш графический объект сверху
maskContainer.mask = mask
// Добавьте маску как дочернюю, чтобы маска располагалась относительно родительской
maskContainer.addChild(mask)
maskContainer.position.set(4,4)
frame.addChild(maskContainer)

let text = new PIXI.Text(
  `Этот текст будет прокручиваться вверх и маскироваться, чтобы вы могли видеть, как работает маскировка.
  "Вы можете положить в контейнер все, что угодно, и это будет замаскировано!`,
  {
    fontSize: 22,
    fill: 0x1010ff,
    wordWrap: true,
    wordWrapWidth: 180
  }
)
text.x = 20
maskContainer.addChild(text)

// Add a ticker callback to scroll the text up and down
let elapsed = 0.0
app.ticker.add((delta) => {
  // Update the text's y coordinate to scroll it
  elapsed += delta
  text.y = 10 + -100.0 + Math.cos(elapsed/50.0) * 100.0
})