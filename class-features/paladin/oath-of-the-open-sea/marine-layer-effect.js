const casterActor = item.actor;
const casterToken = casterActor.getActiveTokens()[0];

if (args[0] === "on") {
  new Sequence()
    .effect()
      .file("jb2a.cast_generic.01.blue")
      .opacity(0.1)
      .playbackRate(0.75)
      .atLocation(casterToken.center)
      .scaleToObject(1.5)
      .belowTokens()
      .waitUntilFinished()
    .effect()
      .file("jb2a.fog_cloud.02.white")
      .attachTo(casterToken.center)
      .scale(1.35)
      .randomRotation()
      .scaleIn(0, 500, { ease: "easeOutCubic" })
      .fadeOut(750)
      .opacity(0.9)
      .name(`Marine-Layer-${casterActor.name}`)
      .persist()
    .play();
} else if (args[0] === "off") {
  Sequencer.EffectManager.endEffects({
    name: `Marine-Layer-${casterActor.name}`,
    object: casterToken,
  });
}
