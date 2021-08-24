function getRoadGeometry(width, height) {
  let outRadius = height * 0.3;
  let laneWidth = outRadius * 0.3;
  let laneRadius = outRadius - laneWidth / 2;
  let innerRadius = outRadius - laneWidth;

  let totalLength = 2 * laneRadius * (1 + Math.sqrt(2) / 2);
  let sideGap = (width - totalLength) / 2;
  let diffOfCenters = Math.sqrt(2) * laneRadius;

  let diffX =
    (Math.pow(innerRadius, 2) -
      Math.pow(outRadius, 2) +
      2 * Math.pow(laneRadius, 2)) /
    (2 * Math.sqrt(2) * laneRadius);

  let arcAngle = Math.acos(diffX / innerRadius);
  let arcAngle2 = Math.acos((Math.sqrt(2) * laneRadius - diffX) / outRadius);
  let arcAngle3 = Math.acos(diffOfCenters / (2 * innerRadius));
  let arcAngle4 = Math.acos(diffOfCenters / (2 * outRadius));
  let arcAngle5 = Math.acos(diffOfCenters / (2 * laneRadius));

  let geometryOne = {
    centerX: sideGap + laneRadius,
    centerY: height / 2,
    innerRadius: outRadius - laneWidth,
    outerRadius: outRadius,
    midRaduis: laneRadius,
    width: laneWidth,
    arcAngle: arcAngle,
    arcAngle2: arcAngle2,
    arcAngle3: arcAngle3,
    arcAngle4: arcAngle4,
    arcAngle5: arcAngle5,
    centerXShape: diffOfCenters / 2,
  };

  let geometryTwo = {
    centerX: width - sideGap - laneRadius,
    centerY: height / 2,
    innerRadius: outRadius - laneWidth,
    outerRadius: outRadius,
    midRaduis: laneRadius,
    width: laneWidth,
    arcAngle: arcAngle,
  };

  return [geometryOne, geometryTwo];
}

function drawCirle(ctx, circle) {
  // let radiusArray = ["innerRadius", "outerRadius", "midRaduis"];
  let radiusArray = ["midRaduis"];
  radiusArray.forEach((radiusType) => {
    ctx.beginPath();
    ctx.arc(circle.centerX, circle.centerY, circle[radiusType], 0, 2 * Math.PI);
    ctx.stroke();
  });
}

function drawRoad(circles, width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");

  ctx.fillStyle = "#546E90";
  ctx.fillRect(0, 0, width, height);

  // left cirtle
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#E0FFFF";
  ctx.setLineDash([10, 14]); // after 10 units stroke 14 units gap

  circles.forEach((circle) => {
    drawCirle(ctx, circle);
  });

  return canvas;
}

function getRoadCanvas(width, height) {
  let geometries = getRoadGeometry(width, height);
  return drawRoad(geometries, width, height);
}

export { getRoadGeometry, getRoadCanvas };
