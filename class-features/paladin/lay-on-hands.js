const casterActor = item.actor;
const layOnHandsPool = casterActor.items.find((i) => i.name === "Lay On Hands");

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

        if (chargesToUse <= 0) {
          ui.notifications.warn(
            `Invalid number of charges specified: ${chargesToUse}...`
          );
          return;
        }

        if (chargesToUse > currentCharges) {
          ui.notifications.warn(
            `Cannot use ${chargesToUse} charges. Only ${currentCharges} charges remaining...`
          );
          return;
        }

        ChatMessage.create({
          content: `<p>Healing <span style="font-weight:bold">${target.name}</span> for ${chargesToUse} HP</p>`,
          speaker: ChatMessage.getSpeaker(casterActor),
        });

        new Sequence()
          .effect()
          .file("jb2a.cure_wounds.200px.purple")
          .atLocation(target.center)
          .scaleToObject(1.5)
          .duration(3000)
          .opacity(0.75)
          .play();

        await layOnHandsPool.update({
          system: {
            uses: { spent: layOnHandsPool.system.uses.spent + chargesToUse },
          },
        });
      },
    },
    curePoison: {
      label: "Cure Poison",
      icon: "",
      callback: async () => {
        if (5 > currentCharges) {
          ui.notifications.warn(
            `Cannot cure poison. Only ${currentCharges} charges remaining...`
          );
          return;
        }

        ChatMessage.create({
          content: `<p>Curing poison on <span style="font-weight:bold">${target.name}</span>, using 5 charges</p>`,
          speaker: ChatMessage.getSpeaker(casterActor),
        });

        new Sequence()
          .effect()
          .file("jb2a.cure_wounds.200px.purple")
          .atLocation(target.center)
          .scaleToObject(1.5)
          .duration(3000)
          .opacity(0.75)
          .play();

        await layOnHandsPool.update({
          system: { uses: { spent: layOnHandsPool.system.uses.spent + 5 } },
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
