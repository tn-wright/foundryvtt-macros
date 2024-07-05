const userActor = item.actor;

let poisonOptions = ``;
actor.items.forEach((i) => {
  if (i.system?.type?.value !== "poison") {
    return;
  }

  poisonOptions += `<option value=${i.uuid} >${i.name}</option>\n`;
});

let weaponOptions = ``;
actor.items.forEach((i) => {
  if (i.type !== "weapon") {
    return;
  }

  if (i.container) {
    return;
  }

  if (i.name === "Unarmed Strike") {
    return;
  }

  weaponOptions += `<option value=${i.uuid} >${i.name}</option>\n`;
});

new Dialog({
  title: "Apply Poison",
  content: `
  <p>Choose which features to activate during your trance:</p><br>
<form>
  <div class="form-group">
    <label for="poison">Poison</label>
    <select name="poison">
      ${poisonOptions}
    </select>
  </div>
  <div class="form-group">
    <label for="weapon">Weapon</label>
    <select name="weapon">
      ${weaponOptions}
    </select>
  </div>
</form>
<br>
  `,
  buttons: {
    apply: {
      icon: "",
      label: "Apply",
      callback: async (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;
        const poison = fromUuidSync(formData.poison);
        const weapon = fromUuidSync(formData.weapon);

        const duration = poison.system.duration;
        console.log(duration);
        let durationMultiplier = 1;
        switch(duration.units) {
          case "minute":
            durationMultiplier = 60;
            break;
          case "hour":
            durationMultiplier = 3600;
            break;
          case "day":
            durationMultiplier = 86400;
            break;
          default:
            break;
        }

        const poisonDurationSeconds = duration.value * durationMultiplier;
        console.log(poisonDurationSeconds);
        const actionType = weapon.system.actionType;
        console.log(actionType);

        await userActor.createEmbeddedDocuments("ActiveEffect", [{
          changes: [{
            key: `macro.execute`,
            mode: 0,
            priority: 20,
            value: `use-poison ${poison.uuid} ${weapon.uuid}`
          }],
          label: "Poisoned Weapon",
          duration: { seconds: poisonDurationSeconds },
          origin: item.uuid,
          icon: item.img,
          flags: {
            dae: {
              showIcon: true,
              specialDuration: [`1Hit:${actionType}`]
            }
          }
        }])
      },
    },
    cancel: {
      icon: "",
      label: "Cancel",
      callback: () => {},
    },
  },
}).render(true);
