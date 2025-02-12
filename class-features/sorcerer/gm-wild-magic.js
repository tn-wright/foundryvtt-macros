const characterName = scope.charName;
const spellCast = scope.spellCast;

let returnValue = null;

let dialogButtons = {
  roll: {
    icon: "<i class='fas fa-dice-d20'></i>",
    label: "Roll For Surge",
    callback: () => {
      returnValue = "roll";
    },
  },
};

dialogButtons["none"] = {
  icon: "<i class='fas fa-times'></i>",
  label: "No Surge",
  callback: () => {},
};

await Dialog.wait({
  title: "Wild Magic Surge",
  content: `<p><span style="font-weight:bold">Character</span>: ${characterName}</p>
  <p><span style="font-weight:bold">Spell</span>: ${spellCast}</p>`,
  buttons: dialogButtons,
  default: "roll",
});

return returnValue;
