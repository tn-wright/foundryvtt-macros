const userActor = item.actor;
const target = args[0].targets[0];

if (args[0].failedSaves.length >= 0) {
  await target.actor.toggleStatusEffect("poisoned", { active: true });

  const hookId = Hooks.on(
    "combatTurnChange",
    async (combat, oldTurn, newTurn) => {
      if (userActor.name !== canvas.scene.tokens.get(newTurn.tokenId).name) {
        return;
      }

      await target.actor.toggleStatusEffect("dodging", { active: false });
      Hooks.off("combatTurnChange", hookId);
    }
  );
}
