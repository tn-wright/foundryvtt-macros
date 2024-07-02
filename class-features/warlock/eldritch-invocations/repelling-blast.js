const casterActor = item.actor;
const casterToken = casterActor.getActiveTokens()[0];
const targetToken = args[0].targets[0].object;

if (args[0].hitTargets.length === 0) {
  // If the attack missed, play miss animation
  new Sequence()
    .effect()
    .file("jb2a.eldritch_blast.purple")
    .atLocation(casterToken)
    .stretchTo(targetToken)
    .scale(0.8)
    .missed(true)
    .play();
} else {
  // The attack hit, so play hit animation
  new Sequence()
    .effect()
    .file("jb2a.eldritch_blast.purple")
    .atLocation(casterToken)
    .stretchTo(targetToken)
    .scale(0.8)
    .missed(false)
    .play();

  await Dialog.confirm({
    label: "Repelling Blast",
    content: `<p>Would you like to push the target with Repelling Blast?</p><br>`,
    yes: async () => {
      // distance to push token in pixels
      const distance = Math.round(10 / canvas.grid.distance) * canvas.grid.size;
      // Ratio of half a space of the total distance
      const halfSpaceRatio = canvas.grid.size / 2 / distance;

      // Build a ray from the caster to the target
      let ray = new Ray(casterToken.center, targetToken.center);

      // Project a ray in the same direction past the actor being pushed
      let projectedRay = Ray.fromAngle(ray.B.x, ray.B.y, ray.angle, distance);
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
        .getName("push-actor")
        .execute({ targetId: targetToken.id, pos: projectedPosition });
    },
    no: () => {
      return;
    },
    defaultYes: false,
  });
}
