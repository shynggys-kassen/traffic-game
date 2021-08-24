import * as THREE from "/public/node_modules/three/build/three.module.js";

let carColors = [
  0xa52523, 0xff5733, 0x77ff33, 0xff33d4, 0x6433ff, 0x6e6c72, 0x06030b,
];

function getRandomColor(array) {
  return array[parseInt(Math.random() * 1000) % array.length];
}

const treeCrownColor = 0x498c2c;
const treeTrunkColor = 0x4b3f2f;
const treeTrunkGeometry = new THREE.BoxBufferGeometry(15, 15, 30);
const treeTrunkMaterial = new THREE.MeshLambertMaterial({
  color: treeTrunkColor,
});
const treeCrownMaterial = new THREE.MeshLambertMaterial({
  color: treeCrownColor,
});

const Car = () => {
  const car = new THREE.Group(); // container. When we move a car. We just a group

  const backWheel = Wheel();
  const frontWheels = Wheel();
  backWheel.position.x = -18;
  frontWheels.position.x = 18;
  car.add(frontWheels);
  car.add(backWheel);

  const mainPart = new THREE.Mesh(
    new THREE.BoxBufferGeometry(60, 30, 15), // (xAxis, yAxis, zAxis) -> (lenght, width, height)
    new THREE.MeshLambertMaterial({ color: getRandomColor(carColors) }) // make random after
  );

  mainPart.castShadow = true;
  mainPart.receiveShadow = true;

  mainPart.position.z = 12;
  car.add(mainPart);

  const frontWindowsTexture = getFrontWindowsTexture();
  frontWindowsTexture.center = new THREE.Vector2(0.5, 0.5);
  frontWindowsTexture.rotation = Math.PI / 2;

  const backWindowTexture = getFrontWindowsTexture();
  backWindowTexture.center = new THREE.Vector2(0.5, 0.5);
  backWindowTexture.rotation = -Math.PI / 2;

  const leftWindowTexture = getSideWindowsTexture();
  leftWindowTexture.flipY = false;

  const roof = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 24, 12), [
    new THREE.MeshLambertMaterial({ map: frontWindowsTexture }),
    new THREE.MeshLambertMaterial({ map: backWindowTexture }),
    new THREE.MeshLambertMaterial({ map: leftWindowTexture }),
    new THREE.MeshLambertMaterial({ map: getSideWindowsTexture() }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
    new THREE.MeshLambertMaterial({ color: 0xffffff }),
  ]);

  roof.castShadow = true;
  roof.receiveShadow = true;
  roof.position.x = -6;
  roof.position.z = 25.5;

  car.add(roof);
  return car;
};

const Wheel = () => {
  const wheel = new THREE.Mesh(
    new THREE.BoxBufferGeometry(12, 33, 12), // shape
    new THREE.MeshLambertMaterial({ color: 0x333333 }) // material
  );
  // material shows how material reacts on light

  wheel.castShadow = true;
  // set position in box
  wheel.position.z = 6;
  return wheel;
};

const getSideWindowsTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 128, 32);

  context.fillStyle = "#666666";
  context.fillRect(10, 8, 38, 24);
  context.fillRect(58, 8, 60, 24);

  return new THREE.CanvasTexture(canvas);
};

const getFrontWindowsTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 64, 32);

  context.fillStyle = "#666666";
  context.fillRect(8, 8, 48, 24); // (y, x widht, height)

  return new THREE.CanvasTexture(canvas);
};

function Tree() {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
  trunk.position.z = 10;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  trunk.matrixAutoUpdate = false;
  tree.add(trunk);

  const treeHeights = [45, 60, 75];
  const height = getRandomColor(treeHeights);

  const crown = new THREE.Mesh(
    new THREE.SphereGeometry(height / 2, 30, 30),
    treeCrownMaterial
  );
  crown.position.z = height / 2 + 30;
  crown.castShadow = true;
  crown.receiveShadow = false;
  tree.add(crown);

  return tree;
}

export { Car, Tree };
