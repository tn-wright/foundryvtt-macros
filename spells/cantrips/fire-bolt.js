const casterToken = canvas.tokens.get(args[0].tokenId);
const target = args[0].targets[0];

new Sequence()
  .effect()
  .file("jb2a.fire_bolt.orange")
  .atLocation(casterToken)
  .stretchTo(target)
  .missed(args[0].hitTargets.length === 0)
  .play();
