const seasonStrings = ["Spring", "Summer", "Autumn", "Winter"];

const currentSeason = item.name.split(" ")[2];
const casterActor = item.parent;

const seasonDialog = new Dialog({
  title: "Switch Season",
  content: `
    <p>Which season would you like to change to?</p><br>
    <form>
      <div class="form-group">
        <label for="season">Season</label>
        <select name="season">
          <option value="${seasonStrings[0]}" ${currentSeason === seasonStrings[0] ? "selected" : ""}>${seasonStrings[0]}</option>
          <option value="${seasonStrings[1]}" ${currentSeason === seasonStrings[1] ? "selected" : ""}>${seasonStrings[1]}</option>
          <option value="${seasonStrings[2]}" ${currentSeason === seasonStrings[2] ? "selected" : ""}>${seasonStrings[2]}</option>
          <option value="${seasonStrings[3]}" ${currentSeason === seasonStrings[3] ? "selected" : ""}>${seasonStrings[3]}</option>
        </select>
      </div>
    </form>
    <br>`,
  buttons: {
    submit: {
      icon: "<i class='fa-solid fa-check'></i>",
      label: "Submit",
      callback: (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form")).object;
        const season = formData.season;
        item.update({name: `Season - ${season}`});

        const speaker = ChatMessage.getSpeaker(casterActor.prototypeToken);
        ChatMessage.create({
          content: `${casterActor.name} changed their season to ${season}`,
          speaker: speaker,
          type: CONST.CHAT_MESSAGE_TYPES.OTHER
        });
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

seasonDialog.render(true);
