const casterActor = item.actor;
const casterToken = casterActor.getActiveTokens()[0];
const targetToken = args[0].targets[0].object;

await Dialog.confirm({
  label: "Repelling Blast",
  content: `<p>Would you like to push the target with Repelling Blast?</p><br>`,
  yes: async () => {
    await game.macros
      .getName("gm-push-actor")
      .execute({
        pusherId: casterToken.id,
        targetId: targetToken.id,
        distance: 10,
      });
  },
  no: () => {
    return;
  },
  defaultYes: false,
});
