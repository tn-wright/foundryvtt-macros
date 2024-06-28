Hooks.on("dnd5e.restCompleted", (actor, updates, rest) => {
  // Only do something if Kairos is taking a long rest
  if(actor.name !== "Kairos" || !updates.longRest) {
    return;
  }

  actor.getEmbeddedCollection("items").find((i) => i.name === "Trance").use();

});