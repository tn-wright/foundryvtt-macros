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
let targetActor = args[0].hitTargets[0]?.actor;

// Only run if the target has taken damage before this attack
if (targetActor.system.attributes.hp.damage <= 0) {
  return;
}

// Get the current time and the last time colossus slayer was used
const combatTime = game.time.worldTime;
const lastTime = actor.getFlag("world", "colossusSlayerTime");

// Only continue if colossus slayer has not been used already at this time
if (combatTime === lastTime) {
    return;
}

let dialog = new Promise((resolve, reject) => {
  new Dialog({
  // localize this text
  title: "Colossus Slayer",
  content: `<p>Would you like to deal Colossus Slayer's extra damage?</p><br>`,
  buttons: {
      confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: "Confirm",
          callback: () => resolve(true)
      },
      cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => {resolve(false)}
      }
  },
  default: "confirm"
  }).render(true);
});

let useColossusSlayer = await dialog;

if(!useColossusSlayer) {
  return;
}

await actor.setFlag("world", "colossusSlayerTime", combatTime)

let damageType = workflow.activity.damage.parts[0]?.types.first() ?? "none";
return new game.system.dice.DamageRoll(
  "1d8",
  {},
  {
    isCritical: workflow.isCritical,
    type: damageType,
    flavor: "Colossus Slayer",
  }
);