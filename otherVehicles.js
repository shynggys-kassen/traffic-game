import { Car } from "/public/elements.js";

const maxNumber = 6;
const carWidth = 60;
const diviser = 1.7;

let carDegrees = carWidth;

let answer = [];

function checkCollision(radians, vehiclePos) {
  let collisition = false;
  for (let i = 0; i < vehiclePos.length; i++) {
    let vehicleAngle = vehiclePos[i] % (2 * Math.PI);
    let leftLimit = vehicleAngle - 1.2 * carDegrees;
    let rightLimit = vehicleAngle + 1.2 * carDegrees;
    if (radians >= leftLimit && radians <= rightLimit) {
      collisition = true;
      break;
    }

    // answer.push([leftLimit, rightLimit, vehicleAngle]);
    // console.log(answer);
  }

  // console.log(carDegrees);

  return collisition;
}

function getRandomAngle(vehiclePos) {
  if (vehiclePos.length === 0) return Math.PI;

  let radians = (Math.random() * 10) % (diviser * Math.PI);

  let collisition = checkCollision(radians, vehiclePos);

  if (collisition) return getRandomAngle(vehiclePos);

  return radians;
}

function addNewVehicles(otherVehicles, centerX, trackRadius, vehiclePos) {
  if (otherVehicles.length > maxNumber) return;

  let newCar = Car();

  if (carDegrees === carWidth) {
    carDegrees = carWidth / trackRadius; // 2 degrees
    console.log(carDegrees);
  }

  let angle = getRandomAngle(vehiclePos);

  let posX = centerX + Math.cos(angle) * trackRadius;
  let posY = Math.sin(angle) * trackRadius;

  newCar.position.x = posX;
  newCar.position.y = posY;

  newCar.rotation.z = angle + Math.PI / 2;
  // newCar.position.x = centerX + trackRadius;
  // newCar.rotation.z = Math.PI / 2;

  otherVehicles.push(newCar);
  vehiclePos.push(angle);

  return newCar;

  // get Random position of the car
}

export { addNewVehicles, checkCollision };
