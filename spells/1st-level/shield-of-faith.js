let casterActor = item.actor;
let target = game.user.targets.first();

casterActor.setFlag("world", "sof-target-id", target.id);

if (args[0] === "on") {
  new Sequence()
    .effect()
      .file("jb2a.shield.02.intro.yellow")
      .attachTo(target)
      .scale(0.4)
      .waitUntilFinished(-700)
    .effect()
      .file("jb2a.shield.02.loop.yellow")
      .attachTo(target)
      .scale(0.4)
      .persist()
      .name(`SoF-${target.id}`)
      .fadeIn(300)
      .fadeOut(300)
      .extraEndDuration(800)
    .play();
}

if (args[0] === "off") {
  let targetId = casterActor.getFlag("world", "sof-target-id");
  console.log(targetId);
  target = game.canvas.tokens.get(targetId);
  console.log(target);

  Sequencer.EffectManager.endEffects({
    name: `SoF-${target.id}`,
    object: target,
  });

  new Sequence()
    .effect()
    .file("jb2a.shield.02.outro_fade.yellow")
    .attachTo(target)
    .scale(0.4)
    .play();
}
