const pushDistance = scope.distance;
const pusher = game.canvas.tokens.get(scope.pusherId);
const pushTarget = game.canvas.tokens.get(scope.targetId);

// distance to push token in pixels
const pxDistance =
  Math.round(pushDistance / canvas.grid.distance) * canvas.grid.size;
// Ratio of half a space of the total distance
const halfSpaceRatio = canvas.grid.size / 2 / pxDistance;

// Build a ray from the caster to the target
let ray = new Ray(pusher.center, pushTarget.center);

// Project a ray in the same direction past the actor being pushed
let projectedRay = Ray.fromAngle(ray.B.x, ray.B.y, ray.angle, pxDistance);

// Snap the end point to a grid center point
projectedRay = new Ray(
  projectedRay.A,
  canvas.grid.getCenterPoint(projectedRay.B)
);

// See if the ray collides with anything
let collision = CONFIG.Canvas.polygonBackends.move.testCollision(
  projectedRay.A,
  projectedRay.B,
  { type: "move", mode: "closest" }
);

// Get the initial move point for the pushed actor
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

projectedRay = new Ray(
  projectedRay.A,
  canvas.grid.getCenterPoint(projectedPoint)
);

// Snap the final position to a center point
let projectedPosition = canvas.grid.getTopLeftPoint(projectedPoint);

pushTarget.document.update({
  x: projectedPosition.x,
  y: projectedPosition.y,
});

return collision;
