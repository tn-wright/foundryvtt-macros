const target = game.user.targets.first();

new Sequence()
  .effect()
  .file("jb2a.flames.01.orange")
  .atLocation(target)
  .scale(1.5)
  .randomRotation()
  .scaleIn(0, 200, { ease: "easeOutCirc" })
  .duration(1250)
  .scaleOut(0, 200, { ease: "easeInCirc" })
  .play();
