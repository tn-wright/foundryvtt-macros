const userActor = item.actor;

const cunningActionDialog = new Dialog({
  title: "Cunning Action",
  content: `<form>
    <div class="form-group">
      <label for="cunning-action">Action:</label>
      <select name="cunning-action">
        <option value="dash">Dash</option>
        <option value="disengage">Disengage</option>
        <option value="hide">Hide</option>
      </select>
    </div>
  </form>`,
  buttons: {
    submit: {
      icon: "<i class='fa-solid fa-check'></i>",
      label: "Submit",
      callback: (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;
        const cunningAction = formData["cunning-action"];

        if (cunningAction === "dash") {
          userActor.items.find((i) => i.name === "Dash").use();
        } else if (cunningAction === "disengage") {
          userActor.items.find((i) => i.name === "Disengage").use();
        } else if (cunningAction === "hide") {
          userActor.items.find((i) => i.name === "Hide").use();
        } else {
          ui.notifications.warn("Invalid cunning action provided...");
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

cunningActionDialog.render(true);
