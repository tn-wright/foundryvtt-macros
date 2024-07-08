console.log(args);
const tempHpAmount = args[1];
const multiplier = args[2] ?? 1;
const casterActor = fromUuidSync(args[3].actorUuid);
const target = fromUuidSync(args[3].tokenUuid);
const targetId = target.id;

console.log(
  `Setting Temp HP for ${casterActor.name}; HP Amount: ${tempHpAmount}; Multiplier: ${multiplier}`
);

if (args[0] === "on") {
  await casterActor.update({
    system: {
      attributes: {
        hp: {
          temp: tempHpAmount * multiplier,
        },
      },
    },
  });

  new Sequence()
    .effect()
    .file("jb2a.shield_themed.above.ice.01.blue")
    .attachTo(target)
    .scaleToObject(1.5, { unifrom: true, considerTokenScale: true })
    .persist()
    .name(`AoA-${target.id}`)
    .scaleIn(0, 300, { ease: "easeInCubic" })
    .scaleOut(0, 300, { ease: "easeOutCubic" })
    .extraEndDuration(800)
    .play();
}

if (args[0] === "off") {
  Sequencer.EffectManager.endEffects({
    name: `AoA-${target.id}`,
    object: target,
  });

  await casterActor.update({
    system: {
      attributes: {
        hp: {
          temp: 0,
        },
      },
    },
  });
}
