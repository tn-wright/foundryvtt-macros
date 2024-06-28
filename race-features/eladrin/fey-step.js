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

const currentSeason = casterActor.items
  .find((i) => i.name.match(/Season - /))
  .name.split(" ")[2];

let teleportToken = casterToken;

// Before teleport season effects

if (currentSeason === "Spring") {
  // Ask if teleporting another create or not

  // If yes, get the target and teleport them instead
  // May want to check that the target is an ally, as they have to be willing
  // Then print a special message that someone else is getting teleported
  console.log("Spring");
} else if (currentSeason === "Winter") {
  // Check if they want to use the ability
  // if yes, get the target and make them roll a wisdom save
  // If they fail, mark them as frightened for 1 round
}

let position = await new Portal()
  .color(game.user.color)
  .texture(item.img)
  .origin(casterToken)
  .range(30)
  .pick();

position = canvas.grid.getTopLeftPoint(position);

const originalAlpha = teleportToken.mesh.alpha;

// Play disappearance effect
new Sequence()
  .effect()
  .file("jb2a.misty_step.01.green")
  .atLocation(teleportToken.center)
  .scale(0.5)
  .duration(3000)
  .play();

// Fade out token
await CanvasAnimation.animate(
  [
    {
      parent: teleportToken.mesh,
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

await teleportToken.document.update(
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
      parent: teleportToken.mesh,
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
  // Check if wants to use the feature
  // If yes, get 2 targets
  // Wisdom save for the targets, charmed if they fail
  // Charmed for 1 minute or until dealt damage
  Chatmessage.create({
    content: "",
    speaker: casterSpeaker,
  });
}
