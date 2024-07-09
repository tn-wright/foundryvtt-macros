const casterActor = item.actor;
const layOnHandsPool = casterActor.items["Lay on Hands Pool"];
const currentCharges = layOnHandsPool.system.uses.value;
const maxCharges = layOnHandsPool.system.uses.max;

const target = game.user.targets.first() ?? casterActor.getActiveTokens()[0];

new Dialog({
  title: "Lay on Hands",
  content: `
  <p>Healing ${target.name} with Lay on Hands. </p>
  <p><span style="font-weight:bold">Remaining Charges</span>: ${currentCharges}/${maxCharges}</p>
  <form>
    <div class="form-group">
      <label for="charges">Charges to use</label>
      <input type="number" name="charges" min="0" max="${maxCharges}" step="1" placeholder="Charges to use...">
    </div>
  </form>
  `,
  buttons: {
    heal: {
      icon: "",
      label: "Heal",
      callback: async (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;
        const chargesToUse = formData.charges;

        if (chargesToUse < 0) {
          ui.notifications.warn(
            `Invalid number of charges specified: ${chargesToUse}...`
          );
        }

        if (chargesToUse > currentCharges) {
          ui.notifications.warn(
            `Cannot use ${chargesToUse} charges. Only ${currentCharges} charges remaining...`
          );
          return;
        }

        ChatMessage.create({
          content: `<p>Healing ${target.name} for ${chargesToUse} HP</p>`,
          speaker: ChatMessage.getSpeaker(casterActor),
        });

        await layOnHandsPool.update({
          system: { uses: { value: currentCharges - chargesToUse } },
        });
      },
    },
    cancel: {
      icon: "",
      label: "Cancel",
      callback: () => {},
    },
  },
}).render(true);
