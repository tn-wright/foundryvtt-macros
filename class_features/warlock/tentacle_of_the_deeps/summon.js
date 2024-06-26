const summonRange = item.system.range.value;
const casterActor = item.parent;
const casterWarlockLevel = casterActor.classes.warlock.system.levels;
const casterToken = casterActor.getActiveTokens()[0];

// Show the crosshair and get summon location
let crosshairDistance = 0;
const checkDistance = async (crosshairs) => {
  while (crosshairs.inFlight) {
    await warpgate.wait(100);

    const pathMeasure = canvas.grid.measurePath([
      casterToken.center,
      crosshairs.document,
    ]);
    const distance = pathMeasure.distance;

    if (crosshairDistance !== distance) {
      crosshairDistance = distance;
      if (distance > summonRange) {
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

if (crosshairPosition.cancelled || crosshairDistance > summonRange) {
  return;
}

// Check if the tentacle already exists and delete it if it does
const tentacle = game.scenes.current.tokens.find(
  (tkn) => tkn.baseActor.name === "Tentacle of the Deeps"
);

if (tentacle) {
  tentacle.delete();
}

// Play the animation
new Sequence()
  .effect()
  .file("jb2a.arms_of_hadar.dark_purple")
  .atLocation(crosshairPosition)
  .belowTokens()
  .scale(0.5)
  .scaleIn(0.1, 200, { ease: "easeOutCubic" })
  .scaleOut(0.1, 400, { ease: "easeInCubic" })
  .duration(1000)
  .play();

// Summon the tentacle with altered attributes for use in attack
let optionConfig = { controllingActor: casterActor };
let [summon] = await warpgate.spawnAt(
  crosshairPosition,
  "Tentacle of the Deeps",
  {
    actor: {
      system: {
        abilities: {
          cha: {
            value: casterActor.system.abilities.cha.value,
          },
        },
        details: {
          cr: casterWarlockLevel,
        },
      },
    },
  },
  {},
  optionConfig
);

// Set the attack on the actor to the correct damage
const attackDiceNum =
  casterActor.system.scale["the-fathomless"]["tentacle-of-the-deeps"].number;
const attackDiceFaces =
  casterActor.system.scale["the-fathomless"]["tentacle-of-the-deeps"].faces;
const summonActorAttack = canvas.scene.tokens
  .get(summon)
  .actor.getEmbeddedCollection("items")
  .find((i) => i.name === "Attack");

summonActorAttack.update({
  system: {
    damage: {
      parts: [[`${attackDiceNum}d${attackDiceFaces}[cold]`, "cold"]],
    },
  },
});

const attackDialog = new Dialog({
  title: "Attack?",
  content:
    "<p>Would you like to perform an attack as part of the summon?</p><br><p>Make sure you have a target selected before attacking!</p><br>",
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

        summonActorAttack.use();
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
