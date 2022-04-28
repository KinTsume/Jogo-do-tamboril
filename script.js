
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
        direction: [0, 1],
        position: [0,0],
        speed: 5,
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

    let enemyWidth = parseInt (window.getComputedStyle(enemy.reference).getPropertyValue("width"));
    let enemyHeight = parseInt (window.getComputedStyle(enemy.reference).getPropertyValue("height"));

    if(position[0] >= 0){
        if((position[0] + enemyWidth) <= 600){
            enemy.position[0] = position[0] + direction[0] * speed;           
        }else{
            enemy.position[0] = 600 - enemyWidth;
            enemy.direction[0] = -direction[0];
        }
    } else {
        enemy.position[0] = 0;
        enemy.direction[0] = -direction[0];
    }

    if(position[1] >= 0){
        if((position[1] + enemyHeight) <= 600){
            enemy.position[1] = position[1] + direction[1] * speed;           
        }else{
            enemy.position[1] = 600 - enemyHeight;
            enemy.direction[1] = -direction[1];
        }
    } else {
        enemy.position[1] = 0;
        enemy.direction[1] = -direction[1];
    }

    enemy.reference.style.left = position[0] +"px";
    enemy.reference.style.top =  position[1] +"px";
    rotateEnemy(enemy);
}

//----------------Player functions-----------------

let player = {
    reference: document.getElementById('player'),
    position: [0, 0],
    direction: [1, 1],
    accel: 5
}

let movePlayer = () => {
    let position = player.position;
    let direction = player.direction;

    let playerWidth = parseInt (window.getComputedStyle(player.reference).getPropertyValue("width"));
    let playerHeight = parseInt (window.getComputedStyle(player.reference).getPropertyValue("height"));
    if(position[0] >= 0){
        if((position[0] + playerWidth) <= 600){
            player.position[0] = position[0] + direction[0];           
        }else{
            player.position[0] = 600 - playerWidth;
            player.direction[0] = 0;
        }
    } else {
        player.position[0] = 0;
        player.direction[0] = 0;
    }

    if(position[1] >= 0){
        if((position[1] + playerHeight) <= 600){
            player.position[1] = position[1] + direction[1];           
        }else{
            player.position[1] = 600 - playerHeight;
            player.direction[1] = 0;
        }
    } else {
        player.position[1] = 0;
        player.direction[1] = 0;
    }

    player.reference.style.left = player.position[0]+"px";
    player.reference.style.top = player.position[1]+"px";
}

let playerControls = (event) => {
    if(event.key === "w"){
        player.direction[1] -= 0.1;
        console.log("decreasing!");
    } else if(event.key === "s"){
        player.direction[1] += 0.1;
    }

    if(event.key === "d"){
        player.direction[0] += 0.1;
    } else if(event.key === "a"){
        player.direction[0] -= .1;
    }
}


//------------On page load initialization-------------

let startMenu = document.getElementById('game-start');

startMenu.addEventListener('click', () => {
    startGame();
    startMenu.classList.add('hidden');
    createEnemy();
});

window.addEventListener('keydown', playerControls);
