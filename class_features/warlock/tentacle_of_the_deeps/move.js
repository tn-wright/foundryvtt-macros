const moveRange = item.system.range.value;

let tentacle = game.scenes.current.tokens.find(
  (tkn) => tkn.baseActor.name === "Tentacle of the Deeps"
);

if (!tentacle) {
  ui.notifications.warn("A Tentacle of the Deeps must be summoned first");
  return;
}

tentacle = tentacle.object;

// Handle new location selection
let crosshairDistance = 0;
const checkDistance = async (crosshairs) => {
  while (crosshairs.inFlight) {
    await warpgate.wait(100);

    const pathMeasure = canvas.grid.measurePath([
      tentacle.center,
      crosshairs.document,
    ]);
    const distance = pathMeasure.distance;

    if (crosshairDistance !== distance) {
      crosshairDistance = distance;
      if (distance > moveRange) {
        crosshairs.icon = "icons/svg/hazard.svg";
      } else {
        crosshairs.icon = item.img;
      }

      crosshairs.draw();
      crosshairs.label = `${distance} ft.`;
    }
  }
};

let crosshairConfig = {
  size: 1,
  icon: item.img,
  label: "0 ft.",
  tag: "totd",
  snappingBehavior: {
    mode: CONST.GRID_SNAPPING_MODES.CENTER,
  },
  rememberControlled: true,
};

let crosshairPosition = await warpgate.crosshairs.show(crosshairConfig, {
  show: checkDistance,
});

if (crosshairPosition.cancelled || crosshairDistance > moveRange) {
  console.log(`TOTD MACRO: Cancelling`);
  return;
}

// Fade out the token
await CanvasAnimation.animate(
  [
    {
      parent: tentacle.mesh,
      attribute: "alpha",
      to: 0,
    },
  ],
  {
    duration: 300,
    easing: "easeOutCircle",
  }
);

// Move the token with effect
let movePosition = canvas.grid.getTopLeftPoint(crosshairPosition);
await tentacle.document.update(movePosition, { animate: false });
new Sequence()
  .effect()
  .file("jb2a.arms_of_hadar.dark_purple")
  .atLocation(crosshairPosition)
  .belowTokens()
  .randomRotation()
  .scale(0.5)
  .scaleIn(0.1, 200, { ease: "easeOutCubic" })
  .scaleOut(0.1, 400, { ease: "easeInCubic" })
  .duration(1000)
  .play();

// Fade the token back in
await CanvasAnimation.animate(
  [
    {
      parent: tentacle.mesh,
      attribute: "alpha",
      from: 0,
      to: 1,
    },
  ],
  {
    duration: 300,
    easing: "easeInCircle",
  }
);

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
