const removeHelpEffect = (actor) => {
  const helpEffect = actor.effects.find((e) => e.name === "Help");
  actor.effects.delete(helpEffect.id);
};

const targets = game.user.targets;

if (targets.size > 1) {
  targets.forEach((t) => removeHelpEffect(t.actor));
}

if (targets.size !== 1) {
  ui.notifications.warn("Help requires exactly one target");
  return;
}

const target = targets.first();

game.macros.getName('gm-confirm-')