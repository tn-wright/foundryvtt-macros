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

let collision = await game.macros
  .getName("gm-push-actor")
  .execute({ pusherId: casterToken.id, targetId: targetToken.id, distance: 10 });

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
