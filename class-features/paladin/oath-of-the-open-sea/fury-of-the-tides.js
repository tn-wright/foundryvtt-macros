const workflow = args[0].workflow;

// stop if this was not executed as a damage bonus
if (args[0].macroPass !== "DamageBonus") {
  return;
}

// Only run if it's for a weapon attack that hit
if (
  !["rwak", "mwak"].includes(workflow.activity.actionType) ||
  args[0].hitTargets?.length <= 0
) {
  return;
}

// Get the actor for the hit target
const targetActor = args[0].hitTargets[0]?.actor;

// Get the current time and the last time colossus slayer was used
const combatTime = game.time.worldTime;
const lastTime = actor.getFlag("world", "pushTargetTime");

// Only continue if colossus slayer has not been used already at this time
if (combatTime === lastTime) {
  return;
}

let dialog = new Promise((resolve, reject) => {
  new Dialog({
    // localize this text
    title: "Fury of the Tides",
    content: `<p>Would you like to push your target?</p><br>`,
    buttons: {
      confirm: {
        icon: '<i class="fas fa-check"></i>',
        label: "Confirm",
        callback: () => resolve(true),
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => {
          resolve(false);
        },
      },
    },
    default: "confirm",
  }).render(true);
});

let pushTarget = await dialog;

if (!pushTarget) {
  return;
}

await actor.setFlag("world", "pushTargetTime", combatTime);

const casterToken = actor.getActiveTokens()[0];
const targetToken = args[0].hitTargets[0].object;

console.log("FURY_OF_THE_TIDES: Tokens");
console.log(casterToken);
console.log(targetToken);

// distance to push token in pixels
const distance = Math.round(10 / canvas.grid.distance) * canvas.grid.size;
// Ratio of half a space of the total distance
const halfSpaceRatio = canvas.grid.size / 2 / distance;

// Build a ray from the caster to the target
let ray = new Ray(casterToken.center, targetToken.center);

console.log("FURY_OF_THE_TIDES: Ray");
console.log(ray);

// Project a ray in the same direction past the actor being pushed
let projectedRay = Ray.fromAngle(ray.B.x, ray.B.y, ray.angle, distance);

console.log("FURY_OF_THE_TIDES: Projected Ray");
console.log(projectedRay);

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
// Snap the final position to a center point
let projectedPosition = canvas.grid.getTopLeftPoint(projectedPoint);

await game.macros
  .getName("gm-push-actor")
  .execute({ targetId: targetToken.id, pos: projectedPosition });

// If the target collided, deal the extra damage
if (collision) {
  return new game.system.dice.DamageRoll(
    `${actor.system.abilities.cha.mod}`,
    {},
    {
      isCritical: workflow.isCritical,
      type: "blugeoning",
      flavor: "Fury of the Tides Impact",
    }
  );
}
