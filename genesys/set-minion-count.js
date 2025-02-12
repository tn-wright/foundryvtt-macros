const selectedActor = actor;

const minionCountDialog = new Dialog({
  title: "Set Minion Count",
  content: `
  <form>
    <div class="form-group">
      <label for="minionCount">Minion Count: </label>
      <input type="number" name="minionCount" autofocus >
    </div>
  </form>
  `,
  buttons: {
    submit: {
      icon: "<i class='fa-solid fa-check'></i>",
      label: "Submit",
      callback: (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;

        const minionCount = formData.minionCount;

        if (minionCount < 1) {
          ui.notifications.warn("You must enter a value greater than 0...");
          return;
        }

        selectedActor.update({
          system: {
            quantity: {
              max: minionCount,
            },
          },
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

minionCountDialog.render(true);
