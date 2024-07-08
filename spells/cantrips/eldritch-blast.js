const casterActor = item.actor;
const casterToken = casterActor.getActiveTokens()[0];
const targetToken = args[0].targets[0].object;

if (args[0].hitTargets.length === 0) {
  // If the attack missed, play miss animation
  new Sequence()
    .effect()
    .file("jb2a.eldritch_blast.purple")
    .atLocation(casterToken)
    .stretchTo(targetToken)
    .scale(0.8)
    .missed(true)
    .play();
} else {
  // The attack hit, so play hit animation
  new Sequence()
    .effect()
    .file("jb2a.eldritch_blast.purple")
    .atLocation(casterToken)
    .stretchTo(targetToken)
    .scale(0.8)
    .missed(false)
    .play();
}
