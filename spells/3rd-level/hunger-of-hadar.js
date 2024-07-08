const template = fromUuidSync(args[0].templateUuid);

await new Sequence()
  .effect()
    .file("jb2a.template_circle.out_pulse.02.burst.purplepink")
    .zIndex(2)
    .atLocation(template)
    .belowTokens()
    .duration(2300)
    .scale(1.8)
    .randomRotation()
    .tint("#8800ad")
  .effect()
    .file("jb2a.template_circle.vortex.loop.dark_black")
    .zIndex(1)
    .atLocation(template)
    .belowTokens()
    .playbackRate(2)
    .duration(1500)
    .scale(1.8)
    .randomRotation()
    .tint("#ce1fff")
    .scaleIn(0, 600)
    .fadeOut(100)
    .waitUntilFinished(-200)
  .play();

const darknessData = {
  elevation: 0,
  rotation: 0,
  walls: true,
  vision: false,
  config: {
    negative: true,
    priority: 0,
    alpha: 0.7,
    angle: 360,
    bright: 20,
    color: null,
    coloration: 1,
    dim: 0,
    attenuation: 0.5,
    luminosity: 0.5,
    saturation: 0,
    contrast: 0,
    shadows: 0,
    animation: {
      type: "hole",
      speed: 6,
      intensity: 3,
      reverse: false,
    },
    darkness: {
      min: 0,
      max: 1,
    },
  },
  hidden: false,
  flags: {
    levels: {
      rangeTop: 7.5,
    },
  },
};
const darknessSource = await AmbientLightDocument.create(
  { x: template.x, y: template.y, ...darknessData },
  { parent: canvas.scene }
);

const destroyHookId = Hooks.on("destroyMeasuredTemplate", (temp) => {
  if (template.uuid !== temp.document.uuid) {
    return;
  }
  darknessSource.delete();
  Hooks.off("destroyMeasuredTemplate", destroyHookId);
});
