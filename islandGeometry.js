import * as THREE from "/public/node_modules/three/build/three.module.js";

function getLeftIsland(circleOneGeometry) {
  const leftIsland = new THREE.Shape();

  // to overlap figures, you need to set one clockwise, and the second anticlockwise

  leftIsland.absarc(
    -circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.innerRadius,
    circleOneGeometry.arcAngle,
    2 * Math.PI - circleOneGeometry.arcAngle,
    false
  );

  leftIsland.absarc(
    circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.outerRadius,
    Math.PI + circleOneGeometry.arcAngle2,
    Math.PI - circleOneGeometry.arcAngle2,
    true // clockwise
  );

  return leftIsland;
}

function getRightIsland(circleOneGeometry) {
  const rightIsland = new THREE.Shape();

  rightIsland.absarc(
    circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.innerRadius,
    Math.PI + circleOneGeometry.arcAngle,
    Math.PI - circleOneGeometry.arcAngle,
    false
  );

  rightIsland.absarc(
    -circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.outerRadius,
    circleOneGeometry.arcAngle2,
    -circleOneGeometry.arcAngle2,
    true // clockwise
  );

  return rightIsland;
}

function getMiddleIsland(circleOneGeometry) {
  const midGeometry = new THREE.Shape();

  midGeometry.absarc(
    circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.innerRadius,
    Math.PI - circleOneGeometry.arcAngle3,
    Math.PI + circleOneGeometry.arcAngle3,
    false
  );

  midGeometry.absarc(
    -circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.innerRadius,
    -circleOneGeometry.arcAngle3,
    circleOneGeometry.arcAngle3,
    false // clockwise
  );

  return midGeometry;
}

function getOuterPlane(circleOneGeometry, width, height) {
  const outerPlane = new THREE.Shape();

  outerPlane.moveTo(-width / 2, -height / 2);
  outerPlane.lineTo(0, -height / 2);

  outerPlane.absarc(
    -circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.outerRadius,
    -circleOneGeometry.arcAngle4,
    circleOneGeometry.arcAngle4,
    true // clockwise
  );

  outerPlane.absarc(
    circleOneGeometry.centerXShape,
    0,
    circleOneGeometry.outerRadius,
    Math.PI - circleOneGeometry.arcAngle4,
    Math.PI + circleOneGeometry.arcAngle4,
    true
  );

  outerPlane.lineTo(0, -height / 2);
  outerPlane.lineTo(width / 2, -height / 2);
  outerPlane.lineTo(width / 2, height / 2);
  outerPlane.lineTo(-width / 2, +height / 2);

  return outerPlane;
}

export { getLeftIsland, getRightIsland, getMiddleIsland, getOuterPlane };
