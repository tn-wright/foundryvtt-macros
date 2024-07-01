const wait = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateSummerMessage = (dmgAmount) => {
  return `
<div class="dnd5e2 chat-card midi-chat-card item-card">
  <section class="card-header description collapsible collapsed">
    <header class="summary">
      <img
        class="gold-icon"
        src="icons/magic/control/debuff-energy-snare-green.webp"
        alt="Fey Step - Summer"
      />
      <div class="name-stacked border">
        <span class="title">Fey Step - Summer</span>
        <span class="subtitle"> Feature </span>
      </div>
      <i class="fas fa-chevron-down fa-fw"></i>
    </header>
    <section class="details collapsible-content card-content"></section>
  </section>
  <div class="midi-results">
    <div class="midi-qol-damage-roll">
      <div style="text-align: center">Damage</div>
      <div class="dice-roll midi-damage-roll">
        <div class="dice-result">
          <div class="dice-formula dmgBtn-mqol">${dmgAmount}</div>
          <div class="dice-tooltip-collapser">
            <div class="dice-tooltip">
              <section class="tooltip-part">
                <div class="dice">
                  <ol class="dice-rolls">
                    <li class="roll">${dmgAmount}</li>
                  </ol>
                  <div class="total">
                    <img
                      src="systems/dnd5e/icons/svg/damage/fire.svg"
                      alt="Fire"
                    />
                    <span class="label">fire</span>
                    <span class="value">${dmgAmount}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <h4 class="dice-total">${dmgAmount}</h4>
        </div>
      </div>
    </div>
  </div>
</div>

  `;
};

const setupConditionHooks = (cond, seconds, targetActor) => {
  // Register hook to remove the effect after 1 round
  const targetWorldTime = game.time.worldTime + seconds;
  const condStartingRound = game.combat.round;
  const condExpireRound = condStartingRound + Math.ceil(seconds / 6);

  let condRoundHookId;
  let condTimeHookId;

  console.log(
    `Hooks registered\nTime: ${condTimeHookId}\nRound: ${condRoundHookId}`
  );

  condRoundHookId = Hooks.on(
    "combatTurnChange",
    async (combat, oldTurn, newTurn) => {
      console.log(
        `Combat Hook\nTime: ${condTimeHookId}\nRound: ${condRoundHookId}`
      );
      // Return early if it isn't the turn of Fey Step's caster
      if (casterActor.name !== canvas.scene.tokens.get(newTurn.tokenId).name) {
        return;
      }

      // If we are in a round before the condition expires, return early
      if (newTurn.round < condExpireRound) {
        return;
      }

      await targetActor.toggleStatusEffect(cond, { active: false });

      // Remove both hooks after the first runs
      Hooks.off("combatTurnChange", condRoundHookId);
      Hooks.off("updateWorldTime", condTimeHookId);
    }
  );

  console.log(
    `Hooks registered\nTime: ${condTimeHookId}\nRound: ${condRoundHookId}`
  );

  condTimeHookId = Hooks.on(
    "updateWorldTime",
    async (newTime, delta, options, userId) => {
      // Don't toggle the effect until we exceed the world time
      // This will help ensure that during combat, the round hook
      // will run first
      console.log(
        `Time Hook\nTime: ${condTimeHookId}\nRound: ${condRoundHookId}`
      );

      if (newTime <= targetWorldTime) {
        return;
      }

      await targetActor.toggleStatusEffect(cond, {
        active: false,
      });

      // Remove both hooks after the first runs
      Hooks.off("updateWorldTime", condTimeHookId);
      Hooks.off("combatTurnChange", condRoundHookId);
    }
  );

  console.log(
    `Hooks registered\nTime: ${condTimeHookId}\nRound: ${condRoundHookId}`
  );
};

const casterActor = item.parent;
const casterToken = casterActor.getActiveTokens()[0];
const casterSpeaker = ChatMessage.getSpeaker(casterToken);

const currentSeason = casterActor.items
  .find((i) => i.name.match(/Season - /))
  .name.split(" ")[2];

let teleportToken = casterToken;

// Before teleport season effects

if (currentSeason === "Spring") {
  // Ask if teleporting another create or not

  await Dialog.confirm({
    title: "Fey Step - Spring",
    content: `<p>Are you teleporting another creature?</p><br>
    <p>If yes, target that creature before proceeding...</p>`,
    yes: () => {
      let teleTarget = game.user.targets.first();

      if (!teleTarget) {
        ui.notifications.warn(
          "You must target the creature you want to teleport..."
        );
        return;
      }

      teleportToken = teleTarget;

      ChatMessage.create({
        content: `<p>${casterActor.name} is teleporting ${teleportToken.actor.name} with Fey Step instead of themselves</p>`,
        speaker: casterSpeaker,
      });
    },
    no: () => {
      return;
    },
    defaultYes: false,
  });
} else if (currentSeason === "Winter") {
  await Dialog.confirm({
    title: "Fey Step - Winter",
    content: `<p>Will you attempt to frighten a creature within 5 feet before teleporting?</p><br>
    <p>If yes, target that creature before proceeding...</p>`,
    yes: async () => {
      const frightenTarget = game.user.targets.first();

      if (!frightenTarget) {
        ui.notifications.warn("The frighten effect requires one target");
        return;
      }

      let saveRoll = await frightenTarget.actor.rollAbilitySave("wis");
      let saveDC =
        8 +
        casterActor.system.abilities.cha.mod +
        casterActor.system.attributes.prof;

      if (saveRoll.total >= saveDC) {
        // Target saved, print it to chat
        ChatMessage.create({
          content: `<p>${frightenTarget.actor.name} was not frightened by Fey Step...</p>`,
          speaker: casterSpeaker,
        });
      } else {
        // Mark token as freightened
        await frightenTarget.actor.toggleStatusEffect("frightened", {
          active: true,
        });

        setupConditionHooks("frightened", 6, frightenTarget.actor);

        // Print a chat message with the result
        ChatMessage.create({
          content: `<p>${frightenTarget.actor.name} has been frightened by Fey Step!</p>`,
          speaker: casterSpeaker,
        });
      }
    },
    no: () => {
      return;
    },
    defaultYes: false,
  });
}

let position = await new Portal()
  .color(game.user.color)
  .texture(item.img)
  .origin(casterToken)
  .range(30)
  .pick();

position = canvas.grid.getTopLeftPoint(position);

const originalAlpha = teleportToken.mesh.alpha;

// Play disappearance effect
new Sequence()
  .effect()
  .file("jb2a.misty_step.01.green")
  .atLocation(teleportToken.center)
  .scale(0.5)
  .duration(3000)
  .play();

// Fade out token
await CanvasAnimation.animate(
  [
    {
      parent: teleportToken.mesh,
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

await teleportToken.document.update({ alpha: 0 }, { animate: false });

await teleportToken.document.update(
  { x: position.x, y: position.y, elevation: position.elevation },
  { animate: false }
);

// Play appearance effect
new Sequence()
  .effect()
  .file("jb2a.misty_step.02.green")
  .atLocation(canvas.grid.getCenterPoint(position))
  .scale(0.5)
  .duration(3000)
  .play();

//fade in token
await CanvasAnimation.animate(
  [
    {
      parent: teleportToken.mesh,
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

await teleportToken.document.update(
  { alpha: originalAlpha },
  { animate: false }
);

// After teleport season effects
if (currentSeason === "Summer") {
  ChatMessage.create({
    content: generateSummerMessage(casterActor.system.attributes.prof),
    speaker: casterSpeaker,
  });
} else if (currentSeason === "Autumn") {
  await Dialog.confirm({
    title: "Fey Step - Autumn",
    content: `<p>Will you attempt to charm up to 2 creatures within 10 feet after teleporting?</p><br>
    <p>If yes, target the creatures before proceeding...</p>`,
    yes: async () => {
      if (game.user.targets.size < 0 || game.user.targets.size > 2) {
        ui.notifications.warn("The charm effect requires one or two targets");
        return;
      }

      let saveDC =
        8 +
        casterActor.system.abilities.cha.mod +
        casterActor.system.attributes.prof;

      game.user.targets.forEach(async (target) => {
        let saveRoll = await target.actor.rollAbilitySave("wis");

        console.log(`DC: ${saveDC}; Roll: ${saveRoll.total}`);

        if (saveRoll.total >= saveDC) {
          // Target saved, print it to chat
          ChatMessage.create({
            content: `<p>${target.actor.name} was not charmed by Fey Step...</p>`,
            speaker: casterSpeaker,
          });
        } else {
          // Mark token as freightened
          await target.actor.toggleStatusEffect("charmed", { active: true });

          setupConditionHooks("charmed", 60, target.actor);

          // Print a chat message with the result
          ChatMessage.create({
            content: `<p>${target.actor.name} has been charmed by Fey Step!</p>`,
            speaker: casterSpeaker,
          });
        }
      });
    },
    no: () => {
      return;
    },
    defaultYes: false,
  });
}
