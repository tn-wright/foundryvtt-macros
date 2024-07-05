const casterActor = item.actor;
const target = game.user.targets.first();
const targetType = target?.actor?.system?.details?.type?.value;

const checkTypes = {
  aberration: "arc",
  beast: "nat",
  celestial: "rel",
  construct: "arc",
  dragon: "arc",
  elemental: "arc",
  fey: "nat",
  fiend: "rel",
  giant: "his",
  humanoid: "his",
  monstrosity: "arc",
  ooze: "arc",
  plant: "nat",
  undead: "rel",
};

const skillNames = {
  arc: "Arcana",
  his: "History",
  nat: "Nature",
  rel: "Religion",
};

const rollType = checkTypes[targetType];

let roll;
await Dialog.wait({
  title: "Recall Knowledge",
  content: `<p>Attempting to recall knowledge using ${skillNames[rollType]}</p>`,
  buttons: {
    advantage: {
      label: "Advantage",
      callback: () => {
        roll = new Roll(`2d20kh+@skills.${rollType}`, casterActor);
      },
    },
    normal: {
      label: "Normal",
      callback: () => {
        roll = new Roll(`1d20+@skills.${rollType}`, casterActor);
      },
    },
    disadvantage: {
      label: "Disadvantage",
      callback: () => {
        roll = new Roll(`2d20kl+@skills.${rollType}`, casterActor);
      },
    },
  },
});

await roll.evaluate();
let msg = await roll.toMessage({
  speaker: ChatMessage.getSpeaker(casterActor),
});
await game.dice3d.waitFor3DAnimationByMessageID(msg.id);
