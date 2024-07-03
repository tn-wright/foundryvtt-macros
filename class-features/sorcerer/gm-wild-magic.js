const characterName = scope.charName;
const spellCast = scope.spellCast;
const tidesAvailable = scope.tidesAvailable;
const tidesMax = scope.tidesMax;

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

if (tidesAvailable < tidesMax) {
  dialogButtons["tides"] = {
    icon: "<i class='fa-solid fa-hand-sparkles'></i>",
    label: "Tides of Chaos",
    callback: () => {
      returnValue = "tides";
    },
  };
}

dialogButtons["none"] = {
  icon: "<i class='fas fa-times'></i>",
  label: "No Surge",
  callback: () => {},
};
await Dialog.wait({
  title: "Wild Magic Surge",
  content: `<p><span style="font-weight:bold">Character</span>: ${characterName}</p>
  <p><span style="font-weight:bold">Spell</span>: ${spellCast}</p>
  <p><span style="font-weight:bold">Tides of Chaos</span>: ${tidesAvailable}/${tidesMax}</p>`,
  buttons: dialogButtons,
  default: "roll",
});

return returnValue;
