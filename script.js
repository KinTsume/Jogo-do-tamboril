
//--------------Game related functions--------------

let startGame = () => {
    loopInterval = setInterval(() =>{
        gameLoop();
    }, 100);
}

let gameLoop = () => {

    enemyList.forEach(item => {
        moveEnemy(item);
    });

    movePlayer();
}

//----------Enemy functions-------------

let enemyList = [];

let createEnemy = ()=> {
    let newEnemy = document.createElement('img');
    newEnemy.src = './img/tamboril.png';
    newEnemy.classList.add('enemy');
    let createdEnemy = document.getElementById('game').appendChild(newEnemy);
    createdEnemy.style.top = 0;
    createdEnemy.style.left = 0
    let enemy = {
        direction: [1, 1],
        position: [0,0],
        speed: 1,
        reference: createdEnemy
    }
    enemyList.push(enemy);
}

let rotateEnemy = (enemy) => {
    let direction = enemy.direction;

    let abs = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2))
    let normalizedDirection = [direction[0] / abs, direction[1] / abs];

    let rotationAngle = Math.acos(normalizedDirection[0]) * normalizedDirection[1] / Math.abs(normalizedDirection[1]) + Math.PI;
    enemy.reference.style.transform = 'rotate('+rotationAngle+'rad)';
}

let moveEnemy = (enemy) => {
    let direction = enemy.direction;
    let position = enemy.position;
    let speed = enemy.speed;
    enemy.position = [position[0] + direction[0] * speed, position[1] + direction[1] * speed];

    enemy.reference.style.left = position[0] +"px";
    enemy.reference.style.top =  position[1] +"px";
    rotateEnemy(enemy);
}

//----------------Player functions-----------------

let player = {
    reference: document.getElementById('player'),
    position: [0, 0],
    direction: [0, 0],
    accel: 5
}

let movePlayer = () => {
    let position = player.position;
    let direction = player.direction;

    player.position.left = position[0] + direction[0];
    player.position.top = position[1] + direction[1];

    player.reference.style.left = player.position[0]+"px";
    player.reference.style.top = player.position[1]+"px";
}


//------------On page load initialization-------------

let startMenu = document.getElementById('game-start');

startMenu.addEventListener('click', () => {
    startGame();
    startMenu.classList.add('hidden');
    createEnemy();
});

window.addEventListener('keydown', movePlayer);
