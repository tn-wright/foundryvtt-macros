const userActor = item.actor;

wasHidingFlag = userActor.getFlag("world", "was-hiding");

if(wasHidingFlag) {
  const hidingEffect =  userActor.effects.find((e) => e.name === "Hiding");
  await userActor.deleteEmbeddedDocuments("ActiveEffect", [hidingEffect.id]);
  userActor.unsetFlag("world", "was-hiding");
  return;
} else {
  await userActor.rollSkill("ste");
  userActor.setFlag("world", "was-hiding", true);
}