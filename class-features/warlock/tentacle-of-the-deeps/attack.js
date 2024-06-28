const tentacle = game.scenes.current.tokens.find(
  (tkn) => tkn.baseActor.name === "Tentacle of the Deeps"
);

if (!tentacle) {
  ui.notifications.warn("A Tentacle of the Deeps must be summoned first");
  return;
}

let target = game.user.targets.first();

if(!target) {
  ui.notifications.warn("You must select a target before attacking");
  return;
}

const attackItem = tentacle.actor
  .getEmbeddedCollection("items")
  .find((i) => i.name === "Attack");

attackItem.use();
