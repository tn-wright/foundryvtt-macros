const casterToken = item.parent.getActiveTokens()[0];

let position = await new Portal()
  .color(game.user.color)
  .texture(item.img)
  .origin(casterToken)
  .range(30)
  .pick();

position = canvas.grid.getTopLeftPoint(position);

const originalAlpha = casterToken.mesh.alpha;

// Play disappearance effect
new Sequence()
  .effect()
    .file("jb2a.misty_step.01.grey")
    .atLocation(casterToken.center)
    .scale(0.5)
    .duration(3000)
  .animation()
    .delay(400)
    .on(casterToken)
    .fadeOut(300, { ease: "easeOutCirlce" })
    .opacity(0)
    .waitUntilFinished(1600)
  .animation()
    .on(casterToken)
    .teleportTo(position)
    .waitUntilFinished()
  .effect()
    .file("jb2a.misty_step.02.grey")
    .atLocation(canvas.grid.getCenterPoint(position))
    .scale(0.5)
    .duration(3000)
    .waitUntilFinished(-1700)
  .animation()
    .on(casterToken)
    .fadeIn(300, { ease: "easeInCircle" })
    .opacity(originalAlpha)
  .play();
