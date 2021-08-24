// https://3dwarehouse.sketchup.com/model/3c0dfb8a29b369cdc51aa4c8859e82e0/Hong-Kong-Bank-Of-China?login=true
// we can use this model

import * as THREE from "/public/node_modules/three/build/three.module.js";
import { Car, Tree } from "/public/elements.js";
import * as dat from "/public/node_modules/dat.gui/build/dat.gui.module.js";
import createMapTexture from "/public/map.js";
import { getRoadGeometry } from "/public/roadGeometry.js";
import { addNewVehicles } from "/public/otherVehicles.js";

const scene = new THREE.Scene();

const tutorialContainer = document.getElementById("tutorial");

let aspectRatio = window.innerWidth / window.innerHeight;
let cameraWidth = 960;
let cameraHeight = cameraWidth / aspectRatio;

let circleProperties = getRoadGeometry(cameraWidth, 1.3 * cameraHeight);
let circleOnePositionX = -circleProperties[0]["centerXShape"];
let circleTwoPositionX = circleProperties[1]["centerXShape"];
let trackRadius = circleProperties[0]["midRaduis"];
let collisionAngleUpper = circleProperties[0]["arcAngle5"];
let collisionAngleBottom = 2 * Math.PI - circleProperties[0]["arcAngle5"];

console.log("upper: " + (collisionAngleUpper * 180) / Math.PI);
console.log("bottom: " + (collisionAngleBottom * 180) / Math.PI);

// const axesHelper = new THREE.AxesHelper(5000);
// scene.add(axesHelper);

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(100, -300, 300);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.left = -400;
dirLight.shadow.camera.right = 350;
dirLight.shadow.camera.top = 400;
dirLight.shadow.camera.bottom = -300;
dirLight.shadow.camera.near = 100;
dirLight.shadow.camera.far = 800;
scene.add(dirLight);

const camera = new THREE.OrthographicCamera(
  -cameraWidth / 2,
  cameraWidth / 2,
  cameraHeight / 2,
  -cameraHeight / 2,
  0,
  1000
);

camera.position.set(0, -200, 300); // (x, y, z)
camera.up.set(0, 1, 0); //
camera.lookAt(0, 0, 0); // camera look at (0, 0, 0) point as a center

/// GUI
const gui = new dat.GUI();
gui.add(camera, "left", -cameraWidth / 2, cameraWidth / 2);
gui.add(camera, "right", cameraWidth / 2, -cameraWidth / 2);

// Add map
createMapTexture(scene, cameraWidth, 1.3 * cameraHeight); // add road texture

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// game logic

const scoreElement = document.getElementById("score");
let otherVehicle = [];
let lastTimestamp;

let ready = true;
let score = 0;
let speed = Math.PI / 2000;
const playerAngleInitial = Math.PI;
let playerAngleMoved = 0;
let accelerate = false;
let decelerate = false;
let timestamp;
let newlaps = false;
let vehiclePos = [];

const tree1 = Tree(); // center
const tree2 = Tree();
tree2.position.x = circleOnePositionX;
tree2.position.y = -0.4 * trackRadius;
const tree3 = Tree();
tree3.position.x = -circleOnePositionX;
tree3.position.y = 0.3 * trackRadius;
const tree4 = Tree();
tree4.position.x = circleOnePositionX - 0.1 * trackRadius;
tree4.position.y = 0.5 * trackRadius;

scene.add(tree1);
scene.add(tree2);
scene.add(tree3);
scene.add(tree4);

let playerCar = Car();
playerCar.position.x = circleOnePositionX - trackRadius;
playerCar.rotation.z = Math.PI / 2;

let firstOppositeCar = Car();
firstOppositeCar.position.x = -circleOnePositionX - trackRadius;
firstOppositeCar.rotation.z = Math.PI / 2;

vehiclePos.push(Math.PI);
otherVehicle.push(firstOppositeCar);

scene.add(playerCar);
scene.add(firstOppositeCar);

function reset() {
  playerCar.position.x = circleOnePositionX;
  playerCar.position.y = 0;
  // reset position and score
  playerAngleMoved = 0;
  movePlayerCar(0);
  score = 0;
  scoreElement.innerText = 0;
  lastTimestamp = undefined;

  // revemo other vehicles
  otherVehicle.forEach((vehicle) => {
    scene.remove(vehicle);
  });

  otherVehicle = [];
  vehiclePos = [];

  renderer.render(scene, camera);
  ready = true;
  newlaps = true;
  startGame();
}

function startGame() {
  if (ready) {
    tutorialContainer.setAttribute("class", "hidden");
    ready = false;
    renderer.setAnimationLoop(animation);
  }
}

const carWidth = 60;
const carAnglularWidth = carWidth / trackRadius; // in radians

const vehicleCollisionAngleUpper = Math.PI - collisionAngleUpper;
const vehicleCollisionAngleBottom = Math.PI + collisionAngleUpper;

function checkCollisionsPlayerCar(playerAngle) {
  // handle this
  // console.log((playerAngle * 180) / 3.14);
  const factor = 0.7;

  let leftBoundary = playerAngle - factor * carAnglularWidth;
  let rightBoundary = playerAngle + factor * carAnglularWidth;

  if (
    leftBoundary <= collisionAngleUpper &&
    rightBoundary >= collisionAngleUpper
  ) {
    for (let i = 0; i < vehiclePos.length; i++) {
      let angle = vehiclePos[i] % (2 * Math.PI);
      let vehicleLeftBoundary = angle - factor * carAnglularWidth;
      let vehicleRightBoundary = angle + factor * carAnglularWidth;
      if (
        vehicleLeftBoundary <= vehicleCollisionAngleUpper &&
        vehicleRightBoundary >= vehicleCollisionAngleUpper
      ) {
        return true;
      }
    }
  } else if (
    leftBoundary <= collisionAngleBottom &&
    rightBoundary >= collisionAngleBottom
  ) {
    for (let i = 0; i < vehiclePos.length; i++) {
      let angle = vehiclePos[i] % (2 * Math.PI);
      let vehicleLeftBoundary = angle - factor * carAnglularWidth;
      let vehicleRightBoundary = angle + factor * carAnglularWidth;
      if (
        vehicleLeftBoundary <= vehicleCollisionAngleBottom &&
        vehicleRightBoundary >= vehicleCollisionAngleBottom
      ) {
        return true;
      }
    }
  }

  return false; // no collission
}

function movePlayerCar(timeDelta) {
  const playerSpeed = getPlayerSpeed();
  playerAngleMoved -= playerSpeed * timeDelta;

  const totalPlayerAngle = playerAngleInitial + playerAngleMoved;

  const playerX = Math.cos(totalPlayerAngle) * trackRadius + circleOnePositionX;
  const playerY = Math.sin(totalPlayerAngle) * trackRadius;

  playerCar.position.x = playerX;
  playerCar.position.y = playerY;

  playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;

  let angle = 2 * Math.PI + (totalPlayerAngle % (2 * Math.PI));
  if (checkCollisionsPlayerCar(angle)) {
    console.log("collions");
    tutorialContainer.removeAttribute("class");
    tutorialContainer.setAttribute("class", "visible");
    renderer.setAnimationLoop(null);
  }
}

function moveOtherCars(timeDelta) {
  const vehicleSpeed = getVehicleSpeed();

  for (let i = 0; i < otherVehicle.length; i++) {
    vehiclePos[i] += vehicleSpeed * timeDelta;
    const vehicleX = Math.cos(vehiclePos[i]) * trackRadius - circleOnePositionX;
    const vehicleY = Math.sin(vehiclePos[i]) * trackRadius;

    otherVehicle[i].position.x = vehicleX;
    otherVehicle[i].position.y = vehicleY;

    otherVehicle[i].rotation.z = vehiclePos[i] + Math.PI / 2;
  }
}

function getVehicleSpeed() {
  return speed;
}

function getPlayerSpeed() {
  if (accelerate) return speed * 2;
  if (decelerate) return speed * 0.5;
  return speed;
}

function animation(timestamp) {
  if (!lastTimestamp) {
    // initially lastTimestamp is undefined
    lastTimestamp = timestamp;
    return;
  }

  const timeDelta = timestamp - lastTimestamp;
  movePlayerCar(timeDelta);
  moveOtherCars(timeDelta);

  // update score
  const laps = Math.floor(Math.abs(playerAngleMoved) / (Math.PI * 2));
  if (laps != score) {
    score = laps;
    scoreElement.innerText = score;
    if (laps % 5 === 0 && laps != 0) newlaps = true;
  }

  // add new vehicle
  if (newlaps) {
    let newvehicle = addNewVehicles(
      otherVehicle,
      -circleOnePositionX,
      trackRadius,
      vehiclePos
    );

    if (newvehicle) scene.add(newvehicle);

    newlaps = false;
  }

  // update the list of cars

  renderer.render(scene, camera);
  lastTimestamp = timestamp;
}

// events
const accelerateButton = document.getElementById("accelerete");
const decelerateButton = document.getElementById("decelerate");

accelerateButton.addEventListener("mousedown", function () {
  startGame();
  accelerate = true;
});
decelerateButton.addEventListener("mousedown", function () {
  startGame();
  decelerate = true;
});
accelerateButton.addEventListener("mouseup", function () {
  accelerate = false;
});
decelerateButton.addEventListener("mouseup", function () {
  decelerate = false;
});
window.addEventListener("keydown", function (event) {
  if (event.key == "ArrowUp") {
    startGame();
    accelerate = true;
    return;
  }
  if (event.key == "ArrowDown") {
    decelerate = true;
    return;
  }
  if (event.key == "R" || event.key == "r") {
    reset();
    return;
  }
});
window.addEventListener("keyup", function (event) {
  if (event.key == "ArrowUp") {
    accelerate = false;
    return;
  }
  if (event.key == "ArrowDown") {
    decelerate = false;
    return;
  }
});

// render
renderer.render(scene, camera);
const gameELement = document.getElementById("game");
gameELement.appendChild(renderer.domElement);
