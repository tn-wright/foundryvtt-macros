const seasons = ["Spring", "Summer", "Autumn", "Winter"];
const profs = [
  "Alchemist's Supplies",
  "Bagpipes",
  "Brewer's Supplies",
  "Calligrapher's Supplies",
  "Carpenter's Tools",
  "Cartographer's Tools",
  "Cobbler's Tools",
  "Cook's Utensils",
  "Dice Set",
  "Disguise Kit",
  "Dragonchess Set",
  "Drum",
  "Dulcimer",
  "Flute",
  "Forgery Kit",
  "Glassblower's Tools",
  "Herbalism",
  "Horn",
  "Jeweler's Tools",
  "Leatherworker's Tools",
  "Lute",
  "Mason's Tools",
  "Navigator's Tools",
  "Painter's Supplies",
  "Pan Flute",
  "Playing Card Set",
  "Poisoner's Kit",
  "Potter's Tools",
  "Shawm",
  "Smith's Tools",
  "Thieves' Tools",
  "Three-Dragon Ante Set",
  "Tinker's Tools",
  "Vehicles (Land)",
  "Vehicles (Water)",
  "Viol",
  "Weaver's Tools",
  "Woodcarver's Tools",
];

const casterActor = item.parent;
const seasonFeature = casterActor
  .getEmbeddedCollection("items")
  .find((i) => i.name.match(/Season - /));
const currentSeason = seasonFeature.name.split(" ")[2] ?? "";
const currentProf1 = casterActor.getFlag("world", "trance-prof1") ?? "";
const currentProf2 = casterActor.getFlag("world", "trance-prof2") ?? "";

const tranceDialogContent = `
<p>Choose which features to activate during your trance:</p><br>
<form>
  <div class="form-group">
    <label for="season">Season</label>
    <select name="season">
      <option value="${seasons[0]}" ${
  currentSeason === seasons[0] ? "selected" : ""
}>${seasons[0]}</option>
      <option value="${seasons[1]}" ${
  currentSeason === seasons[1] ? "selected" : ""
}>${seasons[1]}</option>
      <option value="${seasons[2]}" ${
  currentSeason === seasons[2] ? "selected" : ""
}>${seasons[2]}</option>
      <option value="${seasons[3]}" ${
  currentSeason === seasons[3] ? "selected" : ""
}>${seasons[3]}</option>
    </select>
  </div>
  <div class="form-group">
    <label for="prof1">Season</label>
    <select name="prof1">
      <option value="${profs[0]}" ${
  currentProf1 === profs[0] ? "selected" : ""
}>${profs[0]}</option>
<option value="${profs[1]}" ${currentProf1 === profs[1] ? "selected" : ""}>${
  profs[1]
}</option>
<option value="${profs[2]}" ${currentProf1 === profs[2] ? "selected" : ""}>${
  profs[2]
}</option>
<option value="${profs[3]}" ${currentProf1 === profs[3] ? "selected" : ""}>${
  profs[3]
}</option>
<option value="${profs[4]}" ${currentProf1 === profs[4] ? "selected" : ""}>${
  profs[4]
}</option>
<option value="${profs[5]}" ${currentProf1 === profs[5] ? "selected" : ""}>${
  profs[5]
}</option>
<option value="${profs[6]}" ${currentProf1 === profs[6] ? "selected" : ""}>${
  profs[6]
}</option>
<option value="${profs[7]}" ${currentProf1 === profs[7] ? "selected" : ""}>${
  profs[7]
}</option>
<option value="${profs[8]}" ${currentProf1 === profs[8] ? "selected" : ""}>${
  profs[8]
}</option>
<option value="${profs[9]}" ${currentProf1 === profs[9] ? "selected" : ""}>${
  profs[9]
}</option>
<option value="${profs[10]}" ${currentProf1 === profs[10] ? "selected" : ""}>${
  profs[10]
}</option>
<option value="${profs[11]}" ${currentProf1 === profs[11] ? "selected" : ""}>${
  profs[11]
}</option>
<option value="${profs[12]}" ${currentProf1 === profs[12] ? "selected" : ""}>${
  profs[12]
}</option>
<option value="${profs[13]}" ${currentProf1 === profs[13] ? "selected" : ""}>${
  profs[13]
}</option>
<option value="${profs[14]}" ${currentProf1 === profs[14] ? "selected" : ""}>${
  profs[14]
}</option>
<option value="${profs[15]}" ${currentProf1 === profs[15] ? "selected" : ""}>${
  profs[15]
}</option>
<option value="${profs[16]}" ${currentProf1 === profs[16] ? "selected" : ""}>${
  profs[16]
}</option>
<option value="${profs[17]}" ${currentProf1 === profs[17] ? "selected" : ""}>${
  profs[17]
}</option>
<option value="${profs[18]}" ${currentProf1 === profs[18] ? "selected" : ""}>${
  profs[18]
}</option>
<option value="${profs[19]}" ${currentProf1 === profs[19] ? "selected" : ""}>${
  profs[19]
}</option>
<option value="${profs[20]}" ${currentProf1 === profs[20] ? "selected" : ""}>${
  profs[20]
}</option>
<option value="${profs[21]}" ${currentProf1 === profs[21] ? "selected" : ""}>${
  profs[21]
}</option>
<option value="${profs[22]}" ${currentProf1 === profs[22] ? "selected" : ""}>${
  profs[22]
}</option>
<option value="${profs[23]}" ${currentProf1 === profs[23] ? "selected" : ""}>${
  profs[23]
}</option>
<option value="${profs[24]}" ${currentProf1 === profs[24] ? "selected" : ""}>${
  profs[24]
}</option>
<option value="${profs[25]}" ${currentProf1 === profs[25] ? "selected" : ""}>${
  profs[25]
}</option>
<option value="${profs[26]}" ${currentProf1 === profs[26] ? "selected" : ""}>${
  profs[26]
}</option>
<option value="${profs[27]}" ${currentProf1 === profs[27] ? "selected" : ""}>${
  profs[27]
}</option>
<option value="${profs[28]}" ${currentProf1 === profs[28] ? "selected" : ""}>${
  profs[28]
}</option>
<option value="${profs[29]}" ${currentProf1 === profs[29] ? "selected" : ""}>${
  profs[29]
}</option>
<option value="${profs[30]}" ${currentProf1 === profs[30] ? "selected" : ""}>${
  profs[30]
}</option>
<option value="${profs[31]}" ${currentProf1 === profs[31] ? "selected" : ""}>${
  profs[31]
}</option>
<option value="${profs[32]}" ${currentProf1 === profs[32] ? "selected" : ""}>${
  profs[32]
}</option>
<option value="${profs[33]}" ${currentProf1 === profs[33] ? "selected" : ""}>${
  profs[33]
}</option>
<option value="${profs[34]}" ${currentProf1 === profs[34] ? "selected" : ""}>${
  profs[34]
}</option>
<option value="${profs[35]}" ${currentProf1 === profs[35] ? "selected" : ""}>${
  profs[35]
}</option>
<option value="${profs[36]}" ${currentProf1 === profs[36] ? "selected" : ""}>${
  profs[36]
}</option>
<option value="${profs[37]}" ${currentProf1 === profs[37] ? "selected" : ""}>${
  profs[37]
}</option>
    </select>
  </div>
  <div class="form-group">
    <label for="prof2">Season</label>
    <select name="prof2">
      <option value="${profs[0]}" ${
  currentProf2 === profs[0] ? "selected" : ""
}>${profs[0]}</option>
<option value="${profs[1]}" ${currentProf2 === profs[1] ? "selected" : ""}>${
  profs[1]
}</option>
<option value="${profs[2]}" ${currentProf2 === profs[2] ? "selected" : ""}>${
  profs[2]
}</option>
<option value="${profs[3]}" ${currentProf2 === profs[3] ? "selected" : ""}>${
  profs[3]
}</option>
<option value="${profs[4]}" ${currentProf2 === profs[4] ? "selected" : ""}>${
  profs[4]
}</option>
<option value="${profs[5]}" ${currentProf2 === profs[5] ? "selected" : ""}>${
  profs[5]
}</option>
<option value="${profs[6]}" ${currentProf2 === profs[6] ? "selected" : ""}>${
  profs[6]
}</option>
<option value="${profs[7]}" ${currentProf2 === profs[7] ? "selected" : ""}>${
  profs[7]
}</option>
<option value="${profs[8]}" ${currentProf2 === profs[8] ? "selected" : ""}>${
  profs[8]
}</option>
<option value="${profs[9]}" ${currentProf2 === profs[9] ? "selected" : ""}>${
  profs[9]
}</option>
<option value="${profs[10]}" ${currentProf2 === profs[10] ? "selected" : ""}>${
  profs[10]
}</option>
<option value="${profs[11]}" ${currentProf2 === profs[11] ? "selected" : ""}>${
  profs[11]
}</option>
<option value="${profs[12]}" ${currentProf2 === profs[12] ? "selected" : ""}>${
  profs[12]
}</option>
<option value="${profs[13]}" ${currentProf2 === profs[13] ? "selected" : ""}>${
  profs[13]
}</option>
<option value="${profs[14]}" ${currentProf2 === profs[14] ? "selected" : ""}>${
  profs[14]
}</option>
<option value="${profs[15]}" ${currentProf2 === profs[15] ? "selected" : ""}>${
  profs[15]
}</option>
<option value="${profs[16]}" ${currentProf2 === profs[16] ? "selected" : ""}>${
  profs[16]
}</option>
<option value="${profs[17]}" ${currentProf2 === profs[17] ? "selected" : ""}>${
  profs[17]
}</option>
<option value="${profs[18]}" ${currentProf2 === profs[18] ? "selected" : ""}>${
  profs[18]
}</option>
<option value="${profs[19]}" ${currentProf2 === profs[19] ? "selected" : ""}>${
  profs[19]
}</option>
<option value="${profs[20]}" ${currentProf2 === profs[20] ? "selected" : ""}>${
  profs[20]
}</option>
<option value="${profs[21]}" ${currentProf2 === profs[21] ? "selected" : ""}>${
  profs[21]
}</option>
<option value="${profs[22]}" ${currentProf2 === profs[22] ? "selected" : ""}>${
  profs[22]
}</option>
<option value="${profs[23]}" ${currentProf2 === profs[23] ? "selected" : ""}>${
  profs[23]
}</option>
<option value="${profs[24]}" ${currentProf2 === profs[24] ? "selected" : ""}>${
  profs[24]
}</option>
<option value="${profs[25]}" ${currentProf2 === profs[25] ? "selected" : ""}>${
  profs[25]
}</option>
<option value="${profs[26]}" ${currentProf2 === profs[26] ? "selected" : ""}>${
  profs[26]
}</option>
<option value="${profs[27]}" ${currentProf2 === profs[27] ? "selected" : ""}>${
  profs[27]
}</option>
<option value="${profs[28]}" ${currentProf2 === profs[28] ? "selected" : ""}>${
  profs[28]
}</option>
<option value="${profs[29]}" ${currentProf2 === profs[29] ? "selected" : ""}>${
  profs[29]
}</option>
<option value="${profs[30]}" ${currentProf2 === profs[30] ? "selected" : ""}>${
  profs[30]
}</option>
<option value="${profs[31]}" ${currentProf2 === profs[31] ? "selected" : ""}>${
  profs[31]
}</option>
<option value="${profs[32]}" ${currentProf2 === profs[32] ? "selected" : ""}>${
  profs[32]
}</option>
<option value="${profs[33]}" ${currentProf2 === profs[33] ? "selected" : ""}>${
  profs[33]
}</option>
<option value="${profs[34]}" ${currentProf2 === profs[34] ? "selected" : ""}>${
  profs[34]
}</option>
<option value="${profs[35]}" ${currentProf2 === profs[35] ? "selected" : ""}>${
  profs[35]
}</option>
<option value="${profs[36]}" ${currentProf2 === profs[36] ? "selected" : ""}>${
  profs[36]
}</option>
<option value="${profs[37]}" ${currentProf2 === profs[37] ? "selected" : ""}>${
  profs[37]
}</option>
    </select>
  </div>
</form>
<br>`;

const tranceDialog = new Dialog({
  title: "Trance",
  content: tranceDialogContent,
  buttons: {
    submit: {
      icon: "<i class='fa-solid fa-check'></i>",
      label: "Submit",
      callback: (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;
        const newSeason = formData.season;
        const newProf1 = formData.prof1;
        const newProf2 = formData.prof2;

        let changedSeason = false;
        let changedProf1 = false;
        let changedProf2 = false;

        if (newSeason !== currentSeason) {
          seasonFeature.update({ name: `Season - ${newSeason}` });
          changedSeason = true;
        }

        if (newProf1 !== currentProf1) {
          casterActor.setFlag("world", "trance-prof1", newProf1);
          changedProf1 = true;
        }

        if (newProf2 !== currentProf2) {
          casterActor.setFlag("world", "trance-prof2", newProf2);
          changedProf2 = true;
        }

        if (changedSeason || changedProf1 || changedProf2) {
          const speaker = ChatMessage.getSpeaker(casterActor.prototypeToken);
          ChatMessage.create({
            content: `${casterActor.name} entered a trance and changed:
            ${
              changedSeason
                ? `Their season from ${currentSeason} to ${newSeason}\n`
                : ""
            }${
              changedProf1
                ? `Their first proficiency from ${currentProf1} to ${newProf1}\n`
                : ""
            }${
              changedProf2
                ? `Their second proficiency from ${currentProf2} to ${newProf2}`
                : ""
            }
            `,
            speaker: speaker,
            type: CONST.CHAT_MESSAGE_TYPES.OTHER,
          });
        }
      },
    },
    cancel: {
      icon: "<i class='fa-solid fa-xmark'></i>",
      label: "Cancel",
      callback: () => {
        return;
      },
    },
  },
});

tranceDialog.render(true);
