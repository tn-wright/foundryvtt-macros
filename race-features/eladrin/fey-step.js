const wait = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateSummerMessage = (dmgAmount) => {
  return `
<div class="dnd5e2 chat-card midi-chat-card item-card">
  <section class="card-header description collapsible collapsed">
    <header class="summary">
      <img
        class="gold-icon"
        src="icons/magic/control/debuff-energy-snare-green.webp"
        alt="Fey Step - Summer"
      />
      <div class="name-stacked border">
        <span class="title">Fey Step - Summer</span>
        <span class="subtitle"> Feature </span>
      </div>
      <i class="fas fa-chevron-down fa-fw"></i>
    </header>
    <section class="details collapsible-content card-content"></section>
  </section>
  <div class="midi-results">
    <div class="midi-qol-damage-roll">
      <div style="text-align: center">Damage</div>
      <div class="dice-roll midi-damage-roll">
        <div class="dice-result">
          <div class="dice-formula dmgBtn-mqol">${dmgAmount}</div>
          <div class="dice-tooltip-collapser">
            <div class="dice-tooltip">
              <section class="tooltip-part">
                <div class="dice">
                  <ol class="dice-rolls">
                    <li class="roll">${dmgAmount}</li>
                  </ol>
                  <div class="total">
                    <img
                      src="systems/dnd5e/icons/svg/damage/fire.svg"
                      alt="Fire"
                    />
                    <span class="label">fire</span>
                    <span class="value">${dmgAmount}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <h4 class="dice-total">${dmgAmount}</h4>
        </div>
      </div>
    </div>
  </div>
</div>

  `;
};

const casterActor = item.parent;
const casterToken = casterActor.getActiveTokens()[0];
const casterSpeaker = ChatMessage.getSpeaker(casterToken);

const currentSeason = casterActor
  .getEmbeddedCollection("items")
  .find((i) => i.name.match(/Season - /))
  .name.split(" ")[2];

// Before teleport season effects

if (currentSeason === "Spring") {
  console.log("Spring");
} else if (currentSeason === "Winter") {
  console.log("Winter");
}

let position = await new Portal()
  .color(game.user.color)
  .texture(item.img)
  .origin(casterToken)
  .range(30)
  .pick();

position = canvas.grid.getTopLeftPoint(position);

const originalAlpha = casterToken.mesh.alpha;

// Play disappearance effect
new Sequence()
  .effect()
  .file("jb2a.misty_step.01.green")
  .atLocation(casterToken.center)
  .scale(0.5)
  .duration(3000)
  .play();

// Fade out token
await CanvasAnimation.animate(
  [
    {
      parent: casterToken.mesh,
      attribute: "alpha",
      to: 0,
    },
  ],
  {
    duration: 500,
    easing: "easeOutCircle",
    wait: wait(800),
  }
);

await casterToken.document.update(
  { x: position.x, y: position.y, elevation: position.elevation },
  { animate: false }
);

// Play appearance effect
new Sequence()
  .effect()
  .file("jb2a.misty_step.02.green")
  .atLocation(canvas.grid.getCenterPoint(position))
  .scale(0.5)
  .duration(3000)
  .play();

//fade in token
await CanvasAnimation.animate(
  [
    {
      parent: casterToken.mesh,
      attribute: "alpha",
      from: 0,
      to: originalAlpha,
    },
  ],
  {
    duration: 300,
    easing: "easeInCircle",
    wait: wait(1300),
  }
);

// After teleport season effects
if (currentSeason === "Summer") {
  ChatMessage.create({
    content: generateSummerMessage(casterActor.system.attributes.prof),
    speaker: casterSpeaker,
  });
} else if (currentSeason === "Autumn") {
  console.log("Autumn");
}
