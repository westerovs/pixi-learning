const app = new PIXI.Application({
  width : 400,
  height: 400
})

const wrap = document.querySelector('.wrapper')
wrap.appendChild(app.view)

//  загружаются изображения асинхронно
const sprite = PIXI.Sprite.from('./src/img/sample.png')
app.stage.addChild(sprite)

// Переменную для подсчета секунд
let elapsed = 0.0;
const slowing = 40
// Сообщить тикеру нашего приложения, чтобы он запускал новый обратный вызов каждый кадр
app.ticker.add((delta) => {
  // Добавить время к общему затраченному времени
  elapsed += delta;
  // Обновите положение X спрайта на основе косинуса нашего прошедшего времени.
  // elapsed делим на 50, чтобы немного замедлить анимацию
  sprite.x = 100 + Math.sin(elapsed / slowing) * 100;
});
