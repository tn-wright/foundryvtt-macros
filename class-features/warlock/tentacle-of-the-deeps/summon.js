const summonRange = item.system.range.value;
const casterActor = item.parent;
const casterWarlockLevel = casterActor.classes.warlock.system.levels;
const casterToken = casterActor.getActiveTokens()[0];

const attackDiceNum =
  casterActor.system.scale["the-fathomless"]["tentacle-of-the-deeps"].number;
const attackDiceFaces =
  casterActor.system.scale["the-fathomless"]["tentacle-of-the-deeps"].faces;
const tentacleUpdateData = {
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
  embedded: {
    Item: {
      Attack: {
        system: {
          damage: {
            parts: [[`${attackDiceNum}d${attackDiceFaces}[cold]`, "cold"]],
          },
        },
      },
    },
  },
};

// Check if the tentacle already exists and delete it if it does
let tentacle = game.scenes.current.tokens.find(
  (tkn) => tkn.baseActor.name === "Tentacle of the Deeps"
);

if (tentacle) {
  tentacle.delete();
}

// Set up summon
[tentacle] = await new Portal()
  .addCreature("Actor.xkk1ClyuxpQ6ttz6", {
    updateData: tentacleUpdateData,
    count: 1,
  })
  .origin(casterToken)
  .color(game.user.color)
  .texture(item.img)
  .range(summonRange)
  .spawn();

// Set up animation
const sequence = new Sequence()
  .effect()
  .file("jb2a.arms_of_hadar.dark_purple")
  .atLocation(tentacle.object.center)
  .randomRotation()
  .belowTokens()
  .scale(0.5)
  .scaleIn(0.1, 200, { ease: "easeOutCubic" })
  .scaleOut(0.1, 400, { ease: "easeInCubic" })
  .duration(1000)
  .play();

await CanvasAnimation.animate(
  [
    {
      parent: tentacle.object.mesh,
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

await tentacle.update({ alpha: 1 }, { animate: false });

const tentacleAttack = tentacle.object.actor.items.find(
  (i) => i.name === "Attack"
);

// Check if there should be an attack
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

        tentacleAttack.use();
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
