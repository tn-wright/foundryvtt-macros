const casterToken = fromUuidSync(args[1]);
const targetToken = fromUuidSync(args[2].tokenUuid);

if (args[0] === "on") {
  const distance = canvas.grid.measurePath([
    casterToken.center,
    targetToken.center,
  ]);

  if (distance <= 5 || distance > 20) {
    return;
  }

  await targetToken.actor.toggleStatusEffect("blinded", { active: true });
} else if (args[0] === "off") {
  await targetToken.actor.toggleStatusEffect("blinded", { active: false });
}
