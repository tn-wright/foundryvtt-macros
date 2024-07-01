const casterActor = item.actor;
const casterToken = casterActor.getActiveTokens()[0];
const fireballTemplate = await canvas.templates.get(args[0].templateId);
const fireballCenter = { x: fireballTemplate.x, y: fireballTemplate.y };

new Sequence()
  .effect()
  .file("jb2a.fireball.beam.orange")
  .atLocation(casterToken)
  .stretchTo(fireballCenter)
  .playbackRate(1.25)
  .wait(1800)
  .effect()
  .file("jb2a.fireball.explosion.orange")
  .atLocation(fireballCenter)
  .scale(1.5)
  .playbackRate(1.75)
  .play();
