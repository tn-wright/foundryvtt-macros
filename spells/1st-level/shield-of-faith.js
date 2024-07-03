const casterActor = item.actor;
let targetId = args[1].tokenId;
let target = game.canvas.tokens.get(targetId);

casterActor.setFlag("world", "sof-target-id", targetId);

if (args[0] === "on") {
  new Sequence()
    .effect()
      .file("jb2a.shield.02.intro.yellow")
      .attachTo(target)
      .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
      .waitUntilFinished(-700)
    .effect()
      .file("jb2a.shield.02.loop.yellow")
      .attachTo(target)
      .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
      .persist()
      .name(`SoF-${target.id}`)
      .fadeIn(300)
      .fadeOut(300)
      .extraEndDuration(800)
    .play();
}

if (args[0] === "off") {
  targetId = casterActor.getFlag("world", "sof-target-id");
  target = game.canvas.tokens.get(targetId);

  Sequencer.EffectManager.endEffects({
    name: `SoF-${target.id}`,
    object: target,
  });

  new Sequence()
    .effect()
    .file("jb2a.shield.02.outro_fade.yellow")
    .attachTo(target)
    .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
    .play();
}
