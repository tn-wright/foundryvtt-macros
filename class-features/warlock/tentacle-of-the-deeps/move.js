const moveRange = item.system.range.value;

let tentacle = game.scenes.current.tokens.find(
  (tkn) => tkn.baseActor.name === "Tentacle of the Deeps"
);

if (!tentacle) {
  ui.notifications.warn("A Tentacle of the Deeps must be summoned first");
  return;
}

tentacle = tentacle.object;

const selectedPosition = await new Portal()
  .origin(tentacle.center)
  .color(game.user.color)
  .texture(item.img)
  .range(moveRange)
  .pick();

const movePosition = canvas.grid.getTopLeftPoint(selectedPosition);

new Sequence()
  .animation()
    .on(tentacle)
    .fadeOut(300, { ease: "easeOutCirlce" })
    .opacity(0)
    .teleportTo(movePosition)
    .waitUntilFinished()
  .animation()
    .on(tentacle)
    .fadeIn(300, { ease: "easeInCircle" })
    .opacity(1)
  .effect()
    .delay(100)
    .file("jb2a.arms_of_hadar.dark_purple")
    .atLocation(selectedPosition)
    .belowTokens()
    .randomRotation()
    .scale(0.5)
    .scaleIn(0.1, 200, { ease: "easeOutCubic" })
    .scaleOut(0.1, 400, { ease: "easeInCubic" })
    .duration(1000)
  .play();

const attackDialog = new Dialog({
  title: "Attack?",
  content:
    "<p>Would you like to perform an attack as part of the move?</p><br><p>Make sure you have a target selected before attacking!</p><br>",
  buttons: {
    yes: {
      icon: "<i class='fa-solid fa-check'></i>",
      label: "Yes",
      callback: () => {
        let target = game.user.targets.first();

        if (!target) {
          ui.notifications.warn("You must select a target before attacking");
          return;
        }

        const attackItem = tentacle.actor
          .getEmbeddedCollection("items")
          .find((i) => i.name === "Attack");

        attackItem.use();
      },
    },
    no: {
      icon: "<i class='fa-solid fa-xmark'></i>",
      label: "No",
      callback: () => {
        return;
      },
    },
  },
});

attackDialog.render(true);
