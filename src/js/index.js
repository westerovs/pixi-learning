const app = new PIXI.Application({
  width : 400,
  height: 400
})

const wrap = document.querySelector('.wrapper')
wrap.appendChild(app.view)

//  загружаются изображения асинхронно
const sprite = PIXI.Sprite.from('./src/img/sample.png')
app.stage.addChild(sprite)

