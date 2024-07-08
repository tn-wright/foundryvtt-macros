const casterActor = item.actor;
let targetId = args[1].tokenId;
let target = game.canvas.tokens.get(targetId);

casterActor.setFlag("world", "ma-target-id", targetId);

if (args[0] === "on") {
  new Sequence()
    .effect()
      .file("jb2a.shield.01.intro.blue")
      .attachTo(target)
      .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
      .waitUntilFinished(-700)
    .effect()
      .file("jb2a.shield.01.loop.blue")
      .attachTo(target)
      .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
      .persist()
      .name(`MA-${target.id}`)
      .fadeIn(300)
      .fadeOut(300)
      .extraEndDuration(800)
    .play();
}

if (args[0] === "off") {
  targetId = casterActor.getFlag("world", "ma-target-id");
  target = game.canvas.tokens.get(targetId);

  Sequencer.EffectManager.endEffects({
    name: `MA-${target.id}`,
    object: target,
  });

  new Sequence()
    .effect()
    .file("jb2a.shield.01.outro_explode.blue")
    .attachTo(target)
    .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
    .play();
}
