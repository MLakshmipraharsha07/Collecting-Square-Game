//collect the square game


//Get the reference to the canvas DOM element
var canvas = document.getElementById('canvas');

//Canvas's Context
var ctx = canvas.getContext('2d');

var score = 0;

var x = 50; //x position
var y = 100; //y position
var speed = 6; //distance or speed to move each frame
var sideLength = 50; // length of each side of the square

//flags to track the keys that are pressed
var down = false,
    up = false,
    left = false,
    right = false;

//properties of the target square
var targetX = 0,
    targetY = 0,
    targetLength = 25;

var countdown = 30; //countdown timer in seconds

var id = null; //ID to track the settimeout

//listen to the key events
//key down
canvas.addEventListener('keydown', function(event) {
    event.preventDefault();

    if(event.key == 'ArrowDown'){
        down = true;
    }
    if(event.key == 'ArrowUp'){
        up = true;
    }
    if(event.key == 'ArrowLeft'){
        left = true;
    }
    if(event.key == 'ArrowRight'){
        right = true;
    }

});

//key up
canvas.addEventListener('keyup', function(event) {
    event.preventDefault();
    
    if(event.key == 'ArrowDown'){
        down = false;
    }
    if(event.key == 'ArrowUp'){
        up = false;
    }
    if(event.key == 'ArrowLeft'){
        left = false;
    }
    if(event.key == 'ArrowRight'){
        right = false;
    }
});

//start the game
function startCollecting() {
    //reduce the countdown time every second
    id = setInterval(function() {
        countdown--;
    }, 1000);

    canvas.removeEventListener('click', startCollecting);

    //put the target at some random starting point
    moveTarget();

    //kick off the draw loop
    draw();
}

function moveTarget() {
    //generate a random starting point
    targetX = Math.round(Math.random() * canvas.width - targetLength);
    targetY = Math.round(Math.random() * canvas.height - targetLength);
}

function draw() {
    //clear the canvas
    clearCanvas();

    if (down) {
        y += speed;
    }
    if (up) {
        y -= speed;
    }
    if (left) {
        x -= speed;
    }
    if (right) {
        x += speed;
    }

    if (y + sideLength > canvas.height) {
        y = canvas.height - sideLength;
    }
    if (y < 0) {
        y = 0;
    }
    if (x < 0) {
        x = 0;
    }

    if (x + sideLength > canvas.width) {
        x = canvas.width - sideLength;
    }

    //if there is a collision

    if(hasCollected(targetX, x, x + sideLength) || hasCollected(targetX + targetLength, x, x + sideLength)) {
        if (hasCollected(targetY, y, y + sideLength) || hasCollected(targetY + targetLength, y, y + sideLength)) {
            // you have captured the target square
            moveTarget();
            //increase the score
            score++;
        }
    }

    //draw square

    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, sideLength, sideLength);

    //draw the target
    ctx.fillStyle = 'green';
    ctx.fillRect(targetX, targetY, targetLength, targetLength);

    //draw the score and the time remaining
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 24);
    ctx.fillText('Time Remaining: ' + countdown, 10, 50);

    //end the game or keep playing
    if (countdown <= 0) {
        finishCollecting();
    }else {
        window.requestAnimationFrame(draw);
    }
}

function finishCollecting() {
    //stop the countdown
    clearInterval(id);
    //display the final score
    clearCanvas();
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Final Score: ' + score, canvas.width/2, canvas.height/2);

    // add a restart button
    ctx.fillStyle = 'blue';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Restart', canvas.width/2, canvas.height/2 + 50);

    // add an event listener to the canvas to listen for clicks on the restart button
    canvas.addEventListener('click', function(event) {
        if (event.offsetX > canvas.width/2 - 50 && event.offsetX < canvas.width/2 + 50 &&
            event.offsetY > canvas.height/2 + 30 && event.offsetY < canvas.height/2 + 70) {
            restartGame();
        }
    });
}


function restartGame() {
    // reset the game state
    score = 0;
    countdown = 30;
    x = 50;
    y = 100;
    targetX = 0;
    targetY = 0;

    // remove the event listener for the restart button
    canvas.removeEventListener('click', arguments.callee);

    // start the game again
    render();
    canvas.focus();
}

//determine if the number 'a' is within the range 'b' and 'c' - exclusive
function hasCollected(a, b, c ) {
    return a > b && a < c;
}

function clearCanvas() {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 400);
}

function render() {
    clearCanvas();
    ctx.fillStyle = '#000000';
    ctx.font = '35px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Collect the square ', canvas.width/2, canvas.height/4);
    ctx.font = '24px Arial';
    ctx.fillText('Click to start ', canvas.width/2, canvas.height/2);

    canvas.addEventListener('click', startCollecting);

}

//start the game
render();
canvas.focus();

