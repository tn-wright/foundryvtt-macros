const seasons = ["Spring", "Summer", "Autumn", "Winter"];
const profs = [
  ["alchemist", "Alchemist's Supplies"],
  ["bagpipes", "Bagpipes"],
  ["brewer", "Brewer's Supplies"],
  ["calligrapher", "Calligrapher's Supplies"],
  ["carpenter", "Carpenter's Tools"],
  ["cartographer", "Cartographer's Tools"],
  ["cobbler", "Cobbler's Tools"],
  ["cook", "Cook's Utensils"],
  ["dice", "Dice Set"],
  ["disg", "Disguise Kit"],
  ["chess", "Dragonchess Set"],
  ["drum", "Drum"],
  ["dulcimer", "Dulcimer"],
  ["flute", "Flute"],
  ["forg", "Forgery Kit"],
  ["glassblower", "Glassblower's Tools"],
  ["herb", "Herbalism Kit"],
  ["horn", "Horn"],
  ["jeweler", "Jeweler's Tools"],
  ["leatherworker", "Leatherworker's Tools"],
  ["mason", "Mason's Tools"],
  ["navg", "Navigator's Tools"],
  ["painter", "Painter's Supplies"],
  ["panflute", "Pan Flute"],
  ["card", "Playing Card Set"],
  ["pois", "Poisoner's Kit"],
  ["potter", "Potter's Tools"],
  ["shawm", "Shawm"],
  ["smith", "Smith's Tools"],
  ["thief", "Thieves' Tools"],
  ["tinker", "Tinker's Tools"],
  ["land", "Vehicles (Land)"],
  ["water", "Vehicles (Water)"],
  ["viol", "Viol"],
  ["weaver", "Weaver's Tools"],
  ["woodcarver", "Woodcarver's Tools"],
];

console.log("Making variables");

const casterActor = item.actor;
const seasonFeature = casterActor.items.find((i) => i.name.match(/Season - /));
const currentSeason = seasonFeature.name.split(" ")[2] ?? "";
const currentProf1 = casterActor.getFlag("world", "trance-prof1") ?? "";
const currentProf2 = casterActor.getFlag("world", "trance-prof2") ?? "";

console.log("Creating dialog content");

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
      <option value="${profs[0][0]}" ${
  currentProf1 === profs[0][0] ? "selected" : ""
}>${profs[0][1]}</option>
      <option value="${profs[1][0]}" ${
  currentProf1 === profs[1][0] ? "selected" : ""
}>${profs[1][1]}</option>
      <option value="${profs[2][0]}" ${
  currentProf1 === profs[2][0] ? "selected" : ""
}>${profs[2][1]}</option>
      <option value="${profs[3][0]}" ${
  currentProf1 === profs[3][0] ? "selected" : ""
}>${profs[3][1]}</option>
      <option value="${profs[4][0]}" ${
  currentProf1 === profs[4][0] ? "selected" : ""
}>${profs[4][1]}</option>
      <option value="${profs[5][0]}" ${
  currentProf1 === profs[5][0] ? "selected" : ""
}>${profs[5][1]}</option>
      <option value="${profs[6][0]}" ${
  currentProf1 === profs[6][0] ? "selected" : ""
}>${profs[6][1]}</option>
      <option value="${profs[7][0]}" ${
  currentProf1 === profs[7][0] ? "selected" : ""
}>${profs[7][1]}</option>
      <option value="${profs[8][0]}" ${
  currentProf1 === profs[8][0] ? "selected" : ""
}>${profs[8][1]}</option>
      <option value="${profs[9][0]}" ${
  currentProf1 === profs[9][0] ? "selected" : ""
}>${profs[9][1]}</option>
      <option value="${profs[10][0]}" ${
  currentProf1 === profs[10][0] ? "selected" : ""
}>${profs[10][1]}</option>
      <option value="${profs[11][0]}" ${
  currentProf1 === profs[11][0] ? "selected" : ""
}>${profs[11][1]}</option>
      <option value="${profs[12][0]}" ${
  currentProf1 === profs[12][0] ? "selected" : ""
}>${profs[12][1]}</option>
      <option value="${profs[13][0]}" ${
  currentProf1 === profs[13][0] ? "selected" : ""
}>${profs[13][1]}</option>
      <option value="${profs[14][0]}" ${
  currentProf1 === profs[14][0] ? "selected" : ""
}>${profs[14][1]}</option>
      <option value="${profs[15][0]}" ${
  currentProf1 === profs[15][0] ? "selected" : ""
}>${profs[15][1]}</option>
      <option value="${profs[16][0]}" ${
  currentProf1 === profs[16][0] ? "selected" : ""
}>${profs[16][1]}</option>
      <option value="${profs[17][0]}" ${
  currentProf1 === profs[17][0] ? "selected" : ""
}>${profs[17][1]}</option>
      <option value="${profs[18][0]}" ${
  currentProf1 === profs[18][0] ? "selected" : ""
}>${profs[18][1]}</option>
      <option value="${profs[19][0]}" ${
  currentProf1 === profs[19][0] ? "selected" : ""
}>${profs[19][1]}</option>
      <option value="${profs[20][0]}" ${
  currentProf1 === profs[20][0] ? "selected" : ""
}>${profs[20][1]}</option>
      <option value="${profs[21][0]}" ${
  currentProf1 === profs[21][0] ? "selected" : ""
}>${profs[21][1]}</option>
      <option value="${profs[22][0]}" ${
  currentProf1 === profs[22][0] ? "selected" : ""
}>${profs[22][1]}</option>
      <option value="${profs[23][0]}" ${
  currentProf1 === profs[23][0] ? "selected" : ""
}>${profs[23][1]}</option>
      <option value="${profs[24][0]}" ${
  currentProf1 === profs[24][0] ? "selected" : ""
}>${profs[24][1]}</option>
      <option value="${profs[25][0]}" ${
  currentProf1 === profs[25][0] ? "selected" : ""
}>${profs[25][1]}</option>
      <option value="${profs[26][0]}" ${
  currentProf1 === profs[26][0] ? "selected" : ""
}>${profs[26][1]}</option>
      <option value="${profs[27][0]}" ${
  currentProf1 === profs[27][0] ? "selected" : ""
}>${profs[27][1]}</option>
      <option value="${profs[28][0]}" ${
  currentProf1 === profs[28][0] ? "selected" : ""
}>${profs[28][1]}</option>
      <option value="${profs[29][0]}" ${
  currentProf1 === profs[29][0] ? "selected" : ""
}>${profs[29][1]}</option>
      <option value="${profs[30][0]}" ${
  currentProf1 === profs[30][0] ? "selected" : ""
}>${profs[30][1]}</option>
      <option value="${profs[31][0]}" ${
  currentProf1 === profs[31][0] ? "selected" : ""
}>${profs[31][1]}</option>
      <option value="${profs[32][0]}" ${
  currentProf1 === profs[32][0] ? "selected" : ""
}>${profs[32][1]}</option>
      <option value="${profs[33][0]}" ${
  currentProf1 === profs[33][0] ? "selected" : ""
}>${profs[33][1]}</option>
      <option value="${profs[34][0]}" ${
  currentProf1 === profs[34][0] ? "selected" : ""
}>${profs[34][1]}</option>
      <option value="${profs[35][0]}" ${
  currentProf1 === profs[35][0] ? "selected" : ""
}>${profs[35][1]}</option>
    </select>
  </div>
  <div class="form-group">
    <label for="prof2">Season</label>
    <select name="prof2">
      <option value="${profs[0][0]}" ${
  currentProf2 === profs[0][0] ? "selected" : ""
}>${profs[0][1]}</option>
      <option value="${profs[1][0]}" ${
  currentProf2 === profs[1][0] ? "selected" : ""
}>${profs[1][1]}</option>
      <option value="${profs[2][0]}" ${
  currentProf2 === profs[2][0] ? "selected" : ""
}>${profs[2][1]}</option>
      <option value="${profs[3][0]}" ${
  currentProf2 === profs[3][0] ? "selected" : ""
}>${profs[3][1]}</option>
      <option value="${profs[4][0]}" ${
  currentProf2 === profs[4][0] ? "selected" : ""
}>${profs[4][1]}</option>
      <option value="${profs[5][0]}" ${
  currentProf2 === profs[5][0] ? "selected" : ""
}>${profs[5][1]}</option>
      <option value="${profs[6][0]}" ${
  currentProf2 === profs[6][0] ? "selected" : ""
}>${profs[6][1]}</option>
      <option value="${profs[7][0]}" ${
  currentProf2 === profs[7][0] ? "selected" : ""
}>${profs[7][1]}</option>
      <option value="${profs[8][0]}" ${
  currentProf2 === profs[8][0] ? "selected" : ""
}>${profs[8][1]}</option>
      <option value="${profs[9][0]}" ${
  currentProf2 === profs[9][0] ? "selected" : ""
}>${profs[9][1]}</option>
      <option value="${profs[10][0]}" ${
  currentProf2 === profs[10][0] ? "selected" : ""
}>${profs[10][1]}</option>
      <option value="${profs[11][0]}" ${
  currentProf2 === profs[11][0] ? "selected" : ""
}>${profs[11][1]}</option>
      <option value="${profs[12][0]}" ${
  currentProf2 === profs[12][0] ? "selected" : ""
}>${profs[12][1]}</option>
      <option value="${profs[13][0]}" ${
  currentProf2 === profs[13][0] ? "selected" : ""
}>${profs[13][1]}</option>
      <option value="${profs[14][0]}" ${
  currentProf2 === profs[14][0] ? "selected" : ""
}>${profs[14][1]}</option>
      <option value="${profs[15][0]}" ${
  currentProf2 === profs[15][0] ? "selected" : ""
}>${profs[15][1]}</option>
      <option value="${profs[16][0]}" ${
  currentProf2 === profs[16][0] ? "selected" : ""
}>${profs[16][1]}</option>
      <option value="${profs[17][0]}" ${
  currentProf2 === profs[17][0] ? "selected" : ""
}>${profs[17][1]}</option>
      <option value="${profs[18][0]}" ${
  currentProf2 === profs[18][0] ? "selected" : ""
}>${profs[18][1]}</option>
      <option value="${profs[19][0]}" ${
  currentProf2 === profs[19][0] ? "selected" : ""
}>${profs[19][1]}</option>
      <option value="${profs[20][0]}" ${
  currentProf2 === profs[20][0] ? "selected" : ""
}>${profs[20][1]}</option>
      <option value="${profs[21][0]}" ${
  currentProf2 === profs[21][0] ? "selected" : ""
}>${profs[21][1]}</option>
      <option value="${profs[22][0]}" ${
  currentProf2 === profs[22][0] ? "selected" : ""
}>${profs[22][1]}</option>
      <option value="${profs[23][0]}" ${
  currentProf2 === profs[23][0] ? "selected" : ""
}>${profs[23][1]}</option>
      <option value="${profs[24][0]}" ${
  currentProf2 === profs[24][0] ? "selected" : ""
}>${profs[24][1]}</option>
      <option value="${profs[25][0]}" ${
  currentProf2 === profs[25][0] ? "selected" : ""
}>${profs[25][1]}</option>
      <option value="${profs[26][0]}" ${
  currentProf2 === profs[26][0] ? "selected" : ""
}>${profs[26][1]}</option>
      <option value="${profs[27][0]}" ${
  currentProf2 === profs[27][0] ? "selected" : ""
}>${profs[27][1]}</option>
      <option value="${profs[28][0]}" ${
  currentProf2 === profs[28][0] ? "selected" : ""
}>${profs[28][1]}</option>
      <option value="${profs[29][0]}" ${
  currentProf2 === profs[29][0] ? "selected" : ""
}>${profs[29][1]}</option>
      <option value="${profs[30][0]}" ${
  currentProf2 === profs[30][0] ? "selected" : ""
}>${profs[30][1]}</option>
      <option value="${profs[31][0]}" ${
  currentProf2 === profs[31][0] ? "selected" : ""
}>${profs[31][1]}</option>
      <option value="${profs[32][0]}" ${
  currentProf2 === profs[32][0] ? "selected" : ""
}>${profs[32][1]}</option>
      <option value="${profs[33][0]}" ${
  currentProf2 === profs[33][0] ? "selected" : ""
}>${profs[33][1]}</option>
      <option value="${profs[34][0]}" ${
  currentProf2 === profs[34][0] ? "selected" : ""
}>${profs[34][1]}</option>
      <option value="${profs[35][0]}" ${
  currentProf2 === profs[35][0] ? "selected" : ""
}>${profs[35][1]}</option>
    </select>
  </div>
</form>
<br>`;

console.log("Defining function");

const changeProfOnActor = (oldProf, newProf) => {
  let updateObj = {};
  updateObj[`system.tools.-=${oldProf}`] = null;
  updateObj[`system.tools.${newProf}`] = { value: 1 };
  casterActor.update(updateObj);
};

const changeSeasonOnActor = (newSeason) => {
  const springImg = "icons/commodities/flowers/clover-red.webp";
  const summerImg = "icons/environment/wilderness/tree-ash.webp";
  const autumnImg = "icons/skills/trades/farming-sickle-harvest-wheat.webp";
  const winterImg = "icons/magic/water/ice-snowman.webp";

  let updateImg;
  if (newSeason === "Spring") {
    updateImg = springImg;
  } else if (newSeason === "Summer") {
    updateImg = summerImg;
  } else if (newSeason === "Autumn") {
    updateImg = autumnImg;
  } else {
    updateImg = winterImg;
  }

  let updateObj = {};
  updateObj["name"] = `Season - ${newSeason}`;
  updateObj["img"] = updateImg;
  seasonFeature.update(updateObj);
};

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
          changeSeasonOnActor(newSeason);
          changedSeason = true;
        }

        if (newProf1 !== currentProf1) {
          casterActor.setFlag("world", "trance-prof1", newProf1);
          changeProfOnActor(currentProf1, newProf1);
          changedProf1 = true;
        }

        if (newProf2 !== currentProf2) {
          casterActor.setFlag("world", "trance-prof2", newProf2);
          changeProfOnActor(currentProf2, newProf2);
          changedProf2 = true;
        }

        if (changedSeason || changedProf1 || changedProf2) {
          const speaker = ChatMessage.getSpeaker(casterActor.prototypeToken);
          ChatMessage.create({
            content: `<p>${
              casterActor.name
            } entered a trance and changed:</p><br>
            ${
              changedSeason
                ? `<p>Their season from ${currentSeason} to ${newSeason}</p>`
                : ""
            }${
              changedProf1
                ? `<p>Their first proficiency from ${
                    profs.find((i) => i[0] === currentProf1)[1]
                  } to ${profs.find((i) => i[0] === newProf1)[1]}</p>`
                : ""
            }${
              changedProf2
                ? `<p>Their second proficiency from ${
                    profs.find((i) => i[0] === currentProf2)[1]
                  } to ${profs.find((i) => i[0] === newProf2)[1]}</p>`
                : ""
            }
            `,
            speaker: speaker,
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
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
