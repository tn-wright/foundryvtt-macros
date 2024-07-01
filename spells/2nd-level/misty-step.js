const wait = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

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
  .play();

// Fade out token
await CanvasAnimation.animate(
  [
    {
      parent: casterToken.mesh,
      attribute: "alpha",
      to: 0,
    },
  ],
  {
    duration: 500,
    easing: "easeOutCircle",
    wait: wait(800),
  }
);

await casterToken.document.update({ alpha: 0 }, { animate: false });

await casterToken.document.update(
  { x: position.x, y: position.y, elevation: position.elevation },
  { animate: false }
);

// Play appearance effect
new Sequence()
  .effect()
  .file("jb2a.misty_step.02.grey")
  .atLocation(canvas.grid.getCenterPoint(position))
  .scale(0.5)
  .duration(3000)
  .play();

//fade in token
await CanvasAnimation.animate(
  [
    {
      parent: casterToken.mesh,
      attribute: "alpha",
      from: 0,
      to: originalAlpha,
    },
  ],
  {
    duration: 300,
    easing: "easeInCircle",
    wait: wait(1300),
  }
);

await casterToken.document.update({ alpha: originalAlpha }, { animate: false });
