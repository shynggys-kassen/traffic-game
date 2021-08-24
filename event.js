let ready;
let playerAngleMoved;
let core;
const scoreElement = document.getElementById("score");
let otherVehicle = [];
let lastTimestamp;

reset();

function reset() {
  // reset position and score
  playerAngleMoved = 0;

  movePlayerCar(0);
  score = 0;
  scoreElement.innerText = 0;
  lastTimestamp = undefined;

  // revemo other vehicles
  otherVehicle.forEach((vehicle) => {
    scene.remove(vehicle.mesh);
  });
  otherVehicle = [];

  renderer.render(scene, camera);
  ready = true;
}

function startGame() {
  if (ready) {
    ready = false;
    renderer.setAnimationLoop(animcation);
  }
}

const playerCar = Car();
const playerAngleInitial = Math.PI;
let playerAngleMoved;

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  playerAngleMoved -= playerSpeed * timeDelta;

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

	const playerX = Math.cos(totalPlayerAngle) * trackRadius - track; 
	const playerY = Math.sin(totalPlayerAngle) * trackRadius; 

	playerCar.position.x = playerX; 
	playerCar.position.y = playerY; 

	playerCar.rotation.z =  totalPlayerAngle - Math.PI / 2; 
}


function getPlayerSpeed() {
  if (accelerate) return speed * 2;
  if (secelerate) return speed * 0.5;
  return speed;
}

function animation() {
	if(!lastTimestamp){
		lastTimestamp = timestamp; 
		return
	}

	const timeDelta = timestamp - lastTimestamp; 

	movePlayerCar(timeDelta); 

	// update score
	const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2)); 
	if (laps != score){
		score = laps; 
		scoreElement.innerText = score; 
	}

}

let accelerate = false;
let decelerate = false;

window.addEventListener("keydown", function (event) {
  if (event.key == "ArrowUp") {
    startGame();
    accelarete = true;
  }
});
