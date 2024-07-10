const getMessageContent = (amount, targetName) => {
  return `
<p>Healing <span style="font-weight:bold">${targetName}</span> for ${amount} HP</p>
<div
  class="dnd5e2 chat-card midi-chat-card item-card"
  data-actor-id="qLAtMKIVb1yMNhDk"
  data-actor-uuid="Actor.qLAtMKIVb1yMNhDk"
>
  <div class="card-buttons midi-buttons"></div>
  <div class="midi-results">
    <div class="midi-qol-damage-roll">
      <div style="text-align: center">Damage</div>
      <div class="end-midi-qol-damage-roll"></div>
      <div class="dice-roll midi-damage-roll">
        <div class="dice-result">
          <div class="dice-formula dmgBtn-mqol">
            ${amount}<span class="dmgBtn-container-mqol"
              ><button
                class="dice-total-full-damage-button dice-total-full-button"
                style="
                  background-color: var(--dnd5e-color-failure-background);
                  margin: 0px;
                "
              >
                <i
                  class="fas fa-user-minus"
                  title="Click to apply up to ${amount} damage to selected token(s)."
                ></i></button
              ><button
                class="dice-total-half-damage-button dice-total-half-button"
                style="
                  background-color: var(--dnd5e-color-failure-background);
                  margin: 0px;
                "
              >
                <i title="Click to apply up to ${Math.floor(
                  amount / 2
                )} damage to selected token(s)."
                  >½</i
                ></button
              ><button
                class="dice-total-quarter-damage-button dice-total-quarter-button"
                style="
                  background-color: var(--dnd5e-color-failure-background);
                  margin: 0px;
                "
              >
                <i title="Click to apply up to ${Math.floor(
                  amount / 4
                )} damage to selected token(s)."
                  >¼</i
                ></button
              ><button
                class="dice-total-double-damage-button dice-total-double-button"
                style="
                  background-color: var(--dnd5e-color-failure-background);
                  margin: 0px;
                "
              >
                <i title="Click to apply up to ${
                  amount * 2
                } damage to selected token(s)."
                  >2</i
                ></button
              ><button
                class="dice-total-full-damage-healing-button dice-total-healing-button"
                style="
                  background-color: var(--dnd5e-color-success);
                  margin: 0px;
                "
              >
                <i
                  class="fas fa-user-plus"
                  title="Click to heal up to ${amount} to selected token(s)."
                ></i></button
              ><button
                class="dice-total-full-damage-temp-healing-button dice-total-healing-button"
                style="
                  background-color: var(--dnd5e-color-success-background);
                  margin: 0px;
                "
              >
                <i
                  class="fas fa-user-plus"
                  title="Click to add up to ${amount} to selected token(s) temp HP."
                ></i></button
            ></span>
          </div>
          <div class="dice-tooltip-collapser">
            <div class="dice-tooltip">
              <section class="tooltip-part">
                <div class="dice">
                  <ol class="dice-rolls">
                    <li class="constant">${amount}</li>
                  </ol>
                  <div class="total">
                    <img
                      src="systems/dnd5e/icons/svg/damage/healing.svg"
                      alt="Healing"
                    />
                    <span class="label">Healing</span>
                    <span class="value">${amount}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <h4 class="dice-total">${amount}</h4>
        </div>
      </div>
    </div>
      <div class="end-midi-qol-saves-display"></div>
    </div>
  </div>
</div>
`;
};

const casterActor = item.actor;
const layOnHandsPool = casterActor.items.find(
  (i) => i.name === "Lay on Hands Pool"
);
console.log(layOnHandsPool);
const currentCharges = layOnHandsPool.system.uses.value;
console.log(currentCharges);
const maxCharges = layOnHandsPool.system.uses.max;
console.log(maxCharges);

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
          return;
        }

        if (chargesToUse > currentCharges) {
          ui.notifications.warn(
            `Cannot use ${chargesToUse} charges. Only ${currentCharges} charges remaining...`
          );
          return;
        }

        ChatMessage.create({
          content: getMessageContent(chargesToUse, target.name),
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
