const userActor = item.actor;
const hidingEffect =  userActor.effects.find((e) => e.name === "Hiding");

if(hidingEffect) {
  await userActor.deleteEmbeddedDocuments("ActiveEffect", [hidingEffect.id]);
  return;
} else {
  await userActor.rollSkill("ste");
}