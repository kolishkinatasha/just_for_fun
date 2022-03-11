 // переменная для работы с холстом, на котором будет нарисована игра
 const canvas = document.getElementById('game');
 const context = canvas.getContext('2d');

 const level1 = [
   [], [], [], [], [], [],
   ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
   ['R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
   ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
   ['G','G','G','G','G','G','G','G','G','G','G','G','G','G'],
   ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
   ['Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y'],
   ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
   ['O','O','O','O','O','O','O','O','O','O','O','O','O','O'],
 ];

 const colorMap = {
   'R': '#FF2300',
   'O': '#FF8100',
   'G': '#057D9F',
   'Y': '#FFB300'
 };

 const brickGap = 2;
 const brickWidth = 25;
 const brickHeight = 12;

 const wallSize = 12;
 
 const bricks = [];

 for (let row = 0; row < level1.length; row++) {
   for (let col = 0; col < level1[row].length; col++) {

     const colorCode = level1[row][col];

     bricks.push({
       x: wallSize + (brickWidth + brickGap) * col,
       y: wallSize + (brickHeight + brickGap) * row,
       color: colorMap[colorCode],
       width: brickWidth,
       height: brickHeight
     });
   }
 }

 const paddle = {
   x: canvas.width / 2 - brickWidth / 2,
   y: 440,
   width: brickWidth,
   height: brickHeight,
   dx: 0 //направление движения платформы
 };

 const ball = {
   x: 130,
   y: 260,
   width: 7,
   height: 7,
   speed: 2,
   dx: 0,
   dy: 0
 };

// проверка на пересечение объектов
function collides(obj1, obj2) {
 return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

 // главный цикл игры
 function loop() {
   // на каждом кадре — очищастка поля и перерисовка заново
   requestAnimationFrame(loop);
   context.clearRect(0,0,canvas.width,canvas.height);

   paddle.x += paddle.dx;

   // проверка на выход платформы за стены
   if (paddle.x < wallSize) {
     paddle.x = wallSize
   }
   else if (paddle.x + brickWidth > canvas.width - wallSize) {
     paddle.x = canvas.width - wallSize - brickWidth;
   }

   ball.x += ball.dx;
   ball.y += ball.dy;

   // проверка нахождения шарика в пределах стен
   if (ball.x < wallSize) {
     ball.x = wallSize;
     ball.dx *= -1;
   }
   else if (ball.x + ball.width > canvas.width - wallSize) {
     ball.x = canvas.width - wallSize - ball.width;
     ball.dx *= -1;
   }
   // проверяем верхнюю границу
   if (ball.y < wallSize) {
     ball.y = wallSize;
     ball.dy *= -1;
   }

   // перезагружаем шарик, если он улетел вниз, за край игрового поля
   if (ball.y > canvas.height) {
     ball.x = 130;
     ball.y = 260;
     ball.dx = 0;
     ball.dy = 0;
   }

   // проверяем, коснулся ли шарик платформы, которой управляет игрок. Если коснулся — меняем направление движения шарика по оси Y на противоположное
   if (collides(ball, paddle)) {
     ball.dy *= -1;

     // сдвигаем шарик выше платформы, чтобы на следующем кадре это снова не засчиталось за столкновение
     ball.y = paddle.y - ball.height;
   }

   // если шарик коснулся кирпича— меняем направление движения шарика в зависимости от стенки касания
   for (let i = 0; i < bricks.length; i++) {
     // берём очередной кирпич
     const brick = bricks[i];

     // если было касание
     if (collides(ball, brick)) {
       // убираем кирпич из массива
       bricks.splice(i, 1);

       // если шарик коснулся кирпича сверху или снизу — меняем направление движения шарика по оси Y
       if (ball.y + ball.height - ball.speed <= brick.y ||
           ball.y >= brick.y + brick.height - ball.speed) {
         ball.dy *= -1;
       }
       // в противном случае меняем направление движения шарика по оси X
       else {
         ball.dx *= -1;
       }
       // как нашли касание — сразу выходим из цикла проверки
       break;
     }
   }

   context.fillStyle = 'lightgrey';
   context.fillRect(0, 0, canvas.width, wallSize);
   context.fillRect(0, 0, wallSize, canvas.height);
   context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

   // если шарик в движении — рисуем его
   if (ball.dx || ball.dy) {
     context.fillRect(ball.x, ball.y, ball.width, ball.height);
   }

   bricks.forEach(function(brick) {
     context.fillStyle = brick.color;
     context.fillRect(brick.x, brick.y, brick.width, brick.height);
   });

   context.fillStyle = '057D9F';
   context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
 }

 document.addEventListener('keydown', function(e) {
   // стрелка влево
   if (e.which === 37) {
     paddle.dx = -3;
   }
   // стрелка вправо
   else if (e.which === 39) {
     paddle.dx = 3;
   }

   // обрабатываем нажатие на пробел - запуск шарика
   if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
     ball.dx = ball.speed;
     ball.dy = ball.speed;
   }
 });

 document.addEventListener('keyup', function(e) {
   if (e.which === 37 || e.which === 39) {
     paddle.dx = 0;
   }
 });

 // запуск игры
 requestAnimationFrame(loop);