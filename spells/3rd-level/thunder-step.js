const casterToken = item.actor.getActiveTokens()[0];
const startingLocation = casterToken.center;

let otherTarget;
await Dialog.wait({
  title: "Thunder Step",
  content:
    "<p>Will you be teleporting another person with you?</p><p>If so, target them before proceeding...</p>",
  buttons: {
    yes: {
      icon: "<i class='fa-solid fa-check'></i>",
      label: "Yes",
      callback: () => {
        otherTarget = game.user.targets.first();
      },
    },
    no: {
      icon: "<i class='fa-solid fa-xmark'></i>",
      label: "No",
      callback: () => {},
    },
  },
});

let position = await new Portal()
  .color(game.user.color)
  .texture(item.img)
  .origin(casterToken)
  .range(30)
  .pick();

let otherPosition = position;
if (otherTarget) {
  otherPosition = await new Portal()
    .color(game.user.color)
    .texture(item.img)
    .origin(position)
    .range(7.5)
    .pick();
}

position = canvas.grid.getTopLeftPoint(position);
otherPosition = canvas.grid.getTopLeftPoint(otherPosition);

const originalAlpha = casterToken.mesh.alpha;
const otherOriginalAlpha = otherTarget?.mesh?.alpha ?? originalAlpha;

// Play disappearance effect
await new Sequence()
  .effect()
    .file("jb2a.misty_step.01.purple")
    .atLocation(casterToken.center)
    .scale(0.5)
    .duration(3000)
  .effect()
    .file("jb2a.misty_step.01.purple")
    .atLocation(otherTarget?.center ?? casterToken.center)
    .scale(0.5)
    .duration(3000)
    .playIf(otherTarget)
  .animation()
    .delay(400)
    .on(otherTarget ?? casterToken)
    .fadeOut(300, { ease: "easeOutCirlce" })
    .opacity(0)
    .playIf(otherTarget)
  .animation()
    .delay(400)
    .on(casterToken)
    .fadeOut(300, { ease: "easeOutCirlce" })
    .opacity(0)
  .effect()
    .file("jb2a.thunderwave.center.dark_purple")
    .delay(400)
    .atLocation(startingLocation)
    .duration(1000)
    .scale(0.9)
    .waitUntilFinished(600)
  .animation()
    .on(otherTarget ?? casterToken)
    .teleportTo(otherPosition)
    .playIf(otherTarget)
  .animation()
    .on(casterToken)
    .teleportTo(position)
    .waitUntilFinished()
  .effect()
    .file("jb2a.misty_step.02.purple")
    .atLocation(canvas.grid.getCenterPoint(otherPosition))
    .randomRotation()
    .scale(0.5)
    .duration(3000)
    .playIf(otherTarget)
  .effect()
    .file("jb2a.misty_step.02.purple")
    .atLocation(canvas.grid.getCenterPoint(position))
    .randomRotation()
    .scale(0.5)
    .duration(3000)
    .waitUntilFinished(-1700)
  .animation()
    .on(otherTarget ?? casterToken)
    .fadeIn(300, { ease: "easeInCircle" })
    .opacity(otherOriginalAlpha)
    .playIf(otherTarget)
  .animation()
    .on(casterToken)
    .fadeIn(300, { ease: "easeInCircle" })
    .opacity(originalAlpha)
  .play();

const templateData = {
  angle: 0,
  direction: 0,
  distance: 12.5,
  elevation: 0,
  fillColor: game.user.color,
  hidden: false,
  sort: 0,
  t: "circle",
  width: 0,
};

let template = await MeasuredTemplateDocument.create(
  { x: startingLocation.x, y: startingLocation.y, ...templateData },
  { parent: canvas.scene }
);
await template.delete();

new Sequence()
  .effect()
  .file("jb2a.thunderwave.center.dark_purple")
  .atLocation(startingLocation)
  .duration(1000)