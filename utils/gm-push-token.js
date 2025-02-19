const pushDistance = scope.distance;
const pusher = game.canvas.tokens.get(scope.pusherId);
const pushTarget = game.canvas.tokens.get(scope.targetId);

// distance to push token in pixels
const pxDistance =
  Math.round(pushDistance / canvas.grid.distance) * canvas.grid.size;
// Ratio of half a space of the total distance
const halfSpaceRatio = canvas.grid.size / 2 / pxDistance;

// Build a ray from the caster to the target
let directionRay = new Ray(pusher.center, pushTarget.center);
// Convert ray's angle from radians to degrees
let directionRayDegrees = directionRay.angle * (180 / Math.PI);

// Use the angle of the ray to get the projected end point
let translatedEndPoint = canvas.grid.getTranslatedPoint(
  pushTarget.center,
  directionRayDegrees,
  pushDistance
);

// Create a new ray from the target to the projected end point
let projectedRay = new Ray(
  directionRay.B,
  canvas.grid.getCenterPoint(translatedEndPoint)
);

// See if the ray collides with any walls
let collision = CONFIG.Canvas.polygonBackends.move.testCollision(
  projectedRay.A,
  projectedRay.B,
  { type: "move", mode: "closest" }
);

// Get the initial projected end point for the pushed actor
let projectedPoint = projectedRay.B;

// If there was a collision, calculate the new point to move
if (collision) {
  // Calculate the point of the collision minus half a space. The half space
  // ensures that the actor does not end up in a space that is mostly behind
  // a wall. Only spaces at least 50% visible will allow movement
  let newProjectedPoint = projectedRay.project(
    collision._distance - halfSpaceRatio
  );
  projectedPoint = newProjectedPoint;
}

// Get an array of grid spaces the push target will traverse
let pathCoords = canvas.grid.getDirectPath([projectedRay.A, projectedPoint]);

// For each coord in path, check if there is a token there
// If there is, set end of path to previous coord in path
for (let i = 1; i < pathCoords.length; i++) {
  let tokenAtCoords = canvas.tokens.documentCollection.find(
    (tokenDoc) =>
      tokenDoc.object.center.x === pathCoords[i].x &&
      tokenDoc.object.center.y === pathCoords[i].y
  );

  if (tokenAtCoords) {
    projectedPoint = pathCoords[i - 1];
    collision = true;
    break;
  }
}

// Snap the final position to the top left corner of the grid space
let projectedPosition = canvas.grid.getTopLeftPoint(projectedPoint);

// Push the target
pushTarget.document.update({
  x: projectedPosition.x,
  y: projectedPosition.y,
});

// Return true if there was a collision, false if there was not
return !!collision;
