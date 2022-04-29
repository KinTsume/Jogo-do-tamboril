
//--------------Game related functions--------------

let loopInterval;
let enemyInterval;
let score = 0;

let startGame = () => {
    createEnemy()

    loopInterval = setInterval(() =>{
        gameLoop();
    }, 100);

    enemyInterval = setInterval(() => {
        createEnemy();
    }, 5000);
}

let gameLoop = () => {

    enemyList.forEach(item => {
        moveEnemy(item);
        if(soundWave.isInGame && !item.enraged){
            attractEnemy(item);
        }

        if(verifyCollision(player, item)){
            gameover();
        }
    });

    movePlayer();
    moveScout();

    if(soundWave.isInGame){
        propagateSound();
    }

    updateScore();
}

let mousePos = [];
let getMousePos = (e) => {

    mousePos = [e.clientX - gameDivPos[0], e.clientY - gameDivPos[1]];
}

let verifyCollision = (obj1, obj2) => {
    let size1 = [
        parseInt(getComputedStyle(obj1.reference).width),
        parseInt(getComputedStyle(obj1.reference).height)
    ];

    let size2 = [
        parseInt(getComputedStyle(obj2.reference).width),
        parseInt(getComputedStyle(obj2.reference).height)
    ];

    

    let centerPos1 = [
        obj1.position[0] + size1[0] / 2,
        obj1.position[1] + size1[1] / 2
    ];

    let centerPos2 = [
        obj2.position[0] + size2[0] / 2,
        obj2.position[1] + size2[1] / 2
    ];

    let distanceVector = [Math.abs(centerPos1[0] - centerPos2[0]), Math.abs(centerPos1[1] - centerPos2[1])];

    let limitVector = [(size1[0] + size2[0]) / 2, (size1[1] + size2[1]) / 2];

    if(distanceVector[0] < limitVector[0] && distanceVector[1] < limitVector[1]){
        console.log("Player size: "+ size1[0] +" || "+ size1[1]);
        console.log("Fish size: "+ size2[0] +" || "+ size2[1]);
        console.log("Distance: "+distanceVector[0]+" || "+distanceVector[1]);
        return true;
    }

    return false;

}

let gameover = () => {
    alert("Game over! (sadness ;-;)");
    clearInterval(enemyInterval);
    clearInterval(loopInterval);
    restart();
}

let restart = () => {
    
    enemyList.forEach((item) => {
        document.getElementById("game").removeChild(item.reference);
    });
    enemyList = [];
    player.position = [300, 400];
    player.direction = [0, 0];
    document.getElementById("game-start").classList.remove("hidden");
    document.getElementById("scout").classList.add("hidden");
    document.getElementById("sound").classList.add("hidden");

    score = 0;
    
}

let updateScore = () => {
    let scoreElement = document.getElementById('score');
    scoreElement.textContent = "Score: "+score;
}

//----------Enemy functions-------------

let enemyList = [];

let createEnemy = ()=> {
    let newEnemy = document.createElement('img');
    newEnemy.src = './img/tamboril.png';
    newEnemy.classList.add('enemy');

    let possiblePositions = [[0, 0], [0, 540], [540, 0], [540, 540]];
    let index = Math.floor(Math.random() * 4);

    let createdEnemy = document.getElementById('game').appendChild(newEnemy);
    createdEnemy.style.top = possiblePositions[index][1];
    createdEnemy.style.left = possiblePositions[index][0];

    let enemy = {
        direction: [Math.floor(Math.random() * 10) - 5, Math.floor(Math.random() * 10) - 5],
        position: possiblePositions[index],
        speed: 3,
        reference: createdEnemy,
        enraged: false
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

    const absValue = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
    let normalizedDirection = [direction[0] / absValue, direction[1] / absValue];

    let enemyWidth = parseInt (window.getComputedStyle(enemy.reference).getPropertyValue("width"));
    let enemyHeight = parseInt (window.getComputedStyle(enemy.reference).getPropertyValue("height"));

    if(position[0] >= 0){
        if((position[0] + enemyWidth) <= 600){
            enemy.position[0] = position[0] + normalizedDirection[0] * speed;           
        }else{
            enemy.position[0] = 600 - enemyWidth;
            enemy.direction[0] = -normalizedDirection[0];
        }
    } else {
        enemy.position[0] = 0;
        enemy.direction[0] = -normalizedDirection[0];
    }

    if(position[1] >= 0){
        if((position[1] + enemyHeight) <= 600){
            enemy.position[1] = position[1] + normalizedDirection[1] * speed;           
        }else{
            enemy.position[1] = 600 - enemyHeight;
            enemy.direction[1] = -normalizedDirection[1];
        }
    } else {
        enemy.position[1] = 0;
        enemy.direction[1] = -normalizedDirection[1];
    }

    let enemyCenter = [
        position[0]+enemyWidth,
        position[1]+enemyHeight
    ];
    const bHoleCenter = 325;

    let distanceVector = [Math.abs(enemyCenter[0] - bHoleCenter), Math.abs(enemyCenter[1] - bHoleCenter)];

    if(distanceVector[0] < 50 && distanceVector[1] < 50){

        const index = enemyList.findIndex((actual) => {
            if(actual === enemy){
                return true;
            }

            return false;
        });

        document.getElementById('game').removeChild(enemy.reference);
        enemyList.splice(index, 1);
        score++;
    }

    enemy.reference.style.left = position[0] +"px";
    enemy.reference.style.top =  position[1] +"px";
    rotateEnemy(enemy);
}

//----------------Player functions-----------------

let player = {
    reference: document.getElementById('player'),
    position: [300, 400],
    direction: [1, 1],
    accel: .3,
    dimension: [0, 0]
}

player.dimension = [
    parseInt (window.getComputedStyle(player.reference).getPropertyValue("width")),
    parseInt (window.getComputedStyle(player.reference).getPropertyValue("height"))
];

let movePlayer = () => {
    let position = player.position;
    let direction = player.direction;

    let playerWidth = player.dimension[0];
    let playerHeight = player.dimension[1];
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
        player.direction[1] -= player.accel;
    } else if(event.key === "s"){
        player.direction[1] += player.accel;
    }

    if(event.key === "d"){
        player.direction[0] += player.accel;
    } else if(event.key === "a"){
        player.direction[0] -= player.accel;
    }

    if(event.code === "Space"){
        if(!scout.isInGame){
            launchScout(mousePos);
        } else if(!soundWave.isInGame){
            fireSoundWave();
        }
    }
}

//---------------Scout functions------------------

let scout = {
    isInGame: false,
    direction: [0, 0],
    position: [0, 0],
    dimension: [0 ,0],
    speed: 10,
    reference: document.getElementById('scout')
}

scout.dimension = [
    parseInt (window.getComputedStyle(scout.reference).getPropertyValue("width")),
    parseInt (window.getComputedStyle(scout.reference).getPropertyValue("width"))
];


let launchScout = (mousePos) => {
    let playerWidth = player.dimension[0];
    let playerHeight = player.dimension[1];

    let position = [0, 0];
    let playerPos = player.position;

    position[0] = playerPos[0] + playerWidth / 2;
    position[1]  = playerPos[1] + playerHeight / 2; 

    const MovementDirection = [mousePos[0] - position[0], mousePos[1] - position[1]];

    const absValue = Math.sqrt(Math.pow(MovementDirection[0], 2) + Math.pow(MovementDirection[1], 2));
    scout.direction = [MovementDirection[0] / absValue, MovementDirection[1] / absValue];

    scout.position = position;
    scout.reference.style.left = position[0];
    scout.reference.style.top = position[1];

    scout.reference.classList.remove('hidden');
    
    scout.isInGame = true;
}

let moveScout = () => {
    let direction = scout.direction;
    let position = scout.position;
    let speed = scout.speed;

    let playerWidth = player.dimension[0] / 2;
    let playerHeight = player.dimension[1] / 2;

    if(!scout.isInGame){
        position = [player.position[0] + playerWidth, player.position[1] + playerHeight];
    }

    if(position[0] >= 0){
        if((position[0] + playerWidth) <= 600){
            scout.position[0] = position[0] + direction[0] * speed;           
        }else{
            scout.position[0] = 600 - playerWidth;
            scout.direction[0] = 0;
            scout.reference.classList.add("hidden");
            scout.isInGame = false;
        }
    } else {
        scout.position[0] = 0;
        scout.direction[0] = 0;
        scout.reference.classList.add("hidden");
        scout.isInGame = false;
    }

    if(position[1] >= 0){
        if((position[1] + playerHeight) <= 600){
            scout.position[1] = position[1] + direction[1] * speed;           
        }else{
            scout.position[1] = 600 - playerHeight;
            scout.direction[1] = 0;
            scout.reference.classList.add("hidden");
            scout.isInGame = false;
        }
    } else {
        scout.position[1] = 0;
        scout.direction[1] = 0;
        scout.reference.classList.add("hidden");
        scout.isInGame = false;
    }

    scout.reference.style.left = position[0] +"px";
    scout.reference.style.top =  position[1] +"px";

    
    rotateScout(scout);
}

let rotateScout = (scout) => {
    let direction = scout.direction;

    let abs = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2))
    let normalizedDirection = [direction[0] / abs, direction[1] / abs];

    let rotationAngle = Math.acos(normalizedDirection[0]) * normalizedDirection[1] / Math.abs(normalizedDirection[1]) - Math.PI/4;
    scout.reference.style.transform = 'rotate('+rotationAngle+'rad)';
}

let soundWave = {
    reference: document.getElementById("sound"),
    radius: 20,
    position: [0, 0],
    speed: 10,
    isInGame: true
}

let fireSoundWave = () => {
    let position = scout.position;
    soundWave.radius = 10;
    
    soundWave.position = [position[0], position[1]];
    soundWave.reference.style.left = position[0] + "px";
    soundWave.reference.style.top = position[1] + "px";

    soundWave.reference.classList.remove("hidden");
    soundWave.isInGame = true;
}

let propagateSound = () => {
    soundWave.radius += soundWave.speed;
    soundWave.reference.style.width = soundWave.radius + "px";

    soundWave.reference.style.left = soundWave.position[0] - soundWave.radius /2 + "px";
    soundWave.reference.style.top = soundWave.position[1] - soundWave.radius /2 + "px";

    if(soundWave.radius > 300){
        soundWave.isInGame = false;
        soundWave.reference.classList.add("hidden");
        soundWave.radius = 0;
        soundWave.reference.style.width = 0 + "px";
    }
}

let attractEnemy = (enemy) => {

    //distance between the enemy and the wave center position
    const distanceVector = [Math.abs(enemy.position[0] - soundWave.position[0]), Math.abs(enemy.position[1] - soundWave.position[1])];
    const distance = Math.sqrt(Math.pow(distanceVector[0], 2) + Math.pow(distanceVector[1], 2));

    

    if(distance < soundWave.radius){
        const normalizedDirection = [(soundWave.position[0] - enemy.position[0]) / distance, (soundWave.position[1] - enemy.position[1]) / distance];
        enemy.direction = [normalizedDirection[0], normalizedDirection[1]];
        enemy.speed = 5;
        enemy.enraged = true;
        setTimeout(() => {
            enemy.speed = 3;
            enemy.direction = [Math.floor(Math.random() * 10) - 5, Math.floor(Math.random() * 10) - 5];
            enemy.enraged = false;
        }, 2000);
    }
}


//------------On page load initialization-------------

let startMenu = document.getElementById('game-start');

let gameDiv = document.querySelector("#game");
let gameDivPos = [parseInt(window.getComputedStyle(gameDiv).marginLeft), parseInt(window.getComputedStyle(gameDiv).marginTop) + 8]; //8 is the top margin of the body

startMenu.addEventListener('click', () => {
    startGame();
    startMenu.classList.add('hidden');
});

window.addEventListener('keydown', playerControls);
window.addEventListener('mousemove', getMousePos);
