const casterActor = item.actor;
const tidesOfChaosFeature = casterActor.items.find(
  (i) => i.name === "Tides of Chaos"
);
const remainingTidesUses = tidesOfChaosFeature.system.uses.value;
const maxTidesUses = tidesOfChaosFeature.system.uses.max;

const surgeMethod = await game.macros.getName("gm-wild-magic").execute({
  charName: casterActor.name,
  spellCast: item.name,
  tidesAvailable: remainingTidesUses,
  tidesMax: maxTidesUses,
});

if (!surgeMethod) {
  return;
}

if (surgeMethod === "tidesOfChaos") {
  tidesOfChaosFeature.update({
    system: {
      uses: {
        value: maxTidesUses,
      },
    },
  });
} else if (surgeMethod === "roll") {
  let roll;
  await Dialog.wait({
    title: "Roll",
    content: `<p>Roll to see if there is a wild surge!</p>`,
    buttons: {
      roll: {
        icon: "<i class='fas fa-dice-d20'></i>",
        label: "Roll",
        callback: async () => {
          roll = new Roll("1d20");
          await roll.evaluate();
          let rollMessage = await roll.toMessage();
          await game.dice3d.waitFor3DAnimationByMessageID(rollMessage.id);
        },
      },
    },
    default: "roll",
  });

  if (roll.total !== 1) {
    return;
  }
}

await Dialog.wait({
  title: "Wild Magic Surge",
  content: "Roll for your wild magic surge effect!",
  buttons: {
    roll: {
      icon: "<i class='fas fa-dice-d20'></i>",
      label: "Roll",
      callback: async () => {
        let rollTable = await game.tables.getName("Wild Magic Surge");
        let rollResults = await rollTable.roll();
        let rollMessage = await rollTable.toMessage(rollResults.results);
      },
    },
  },
});
