const userActor = item.actor;
await userActor.toggleStatusEffect("dodging", { active: true });

const hookId = Hooks.on(
  "combatTurnChange",
  async (combat, oldTurn, newTurn) => {
    if (userActor.name !== canvas.scene.tokens.get(newTurn.tokenId).name) {
      return;
    }

    await userActor.toggleStatusEffect("dodging", { active: false });
    Hooks.off("combatTurnChange", hookId);
  }
);
