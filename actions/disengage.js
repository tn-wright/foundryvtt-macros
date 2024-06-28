const userActor = item.actor;
await userActor.toggleStatusEffect("disengage", { active: true });

const hookId = Hooks.on(
  "combatTurnChange",
  async (combat, oldTurn, newTurn) => {
    if (userActor.name !== canvas.scene.tokens.get(newTurn.tokenId).name) {
      return;
    }

    await userActor.toggleStatusEffect("disengage", { active: false });
    Hooks.off("combatTurnChange", hookId);
  }
);
