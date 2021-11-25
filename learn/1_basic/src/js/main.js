const app = new PIXI.Application({
  width : 400,
  height: 400
})

const wrap = document.querySelector('.wrapper')
wrap.appendChild(app.view)
