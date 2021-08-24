import * as THREE from "/public/node_modules/three/build/three.module.js";
import { getRoadGeometry, getRoadCanvas } from "/public/roadGeometry.js";
import {
  getRightIsland,
  getLeftIsland,
  getMiddleIsland,
  getOuterPlane,
} from "/public/islandGeometry.js";

function createMapTexture(scene, width, height) {
  let canvas = getRoadCanvas(width, height);
  let roadGeometry = getRoadGeometry(width, height);
  const roadTexture = new THREE.CanvasTexture(canvas);

  const planeGeometry = new THREE.PlaneBufferGeometry(width, height);
  const planeMaterial = new THREE.MeshLambertMaterial({
    map: roadTexture,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.matrixAutoUpdate = false;
  scene.add(plane); // road markings

  const leftIsland = getLeftIsland(roadGeometry[0]); // shape
  const rightIsland = getRightIsland(roadGeometry[0]); // shape
  const midIsland = getMiddleIsland(roadGeometry[0]);
  const outerPlane = getOuterPlane(roadGeometry[0], width, height);

  let fieldGeomtry = new THREE.ExtrudeBufferGeometry(
    [leftIsland, rightIsland, midIsland, outerPlane],
    {
      depth: 6,
      bevelEnabled: false,
    }
  );

  const fieldMesh = new THREE.Mesh(fieldGeomtry, [
    new THREE.MeshLambertMaterial({ color: 0x67c240 }), // top
    new THREE.MeshLambertMaterial({ color: 0x23311c }), // sides
  ]);

  fieldMesh.receiveShadow = true;
  fieldMesh.castShadow = true;

  scene.add(fieldMesh);

  return roadGeometry[0];
}

export default createMapTexture;
