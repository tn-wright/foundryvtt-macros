Hooks.on("dnd5e.restCompleted", (actor, updates, rest) => {
  const kairosOwnerId = "fSrPDDU2iLLuhZ3I"

  // If the owner of kairos is online, only run this for them
  if (game.users.get(kairosOwnerId).active && game.user.id !== kairosOwnerId) {
    return;
  }

  // If the owner of kairos is not online, let this be run for the GM
  if (!game.users.get(kairosOwnerId).active && !game.user.isGM) {
    return;
  }

  // Only do something if Kairos is taking a long rest
  if(actor.name !== "Kairos" || !updates.longRest) {
    return;
  }

  // Use the Trance feature
  actor.items.find((i) => i.name === "Trance").use();

});