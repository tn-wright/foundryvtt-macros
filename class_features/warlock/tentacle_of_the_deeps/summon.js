let summonRange = item.system.range.value;

let crosshairDistance = 0;
const checkDistance = async (crosshairs) => {
  while (crosshairs.inFlight) {
    await warpgate.wait(100);

    const pathMeasure = canvas.grid.measurePath([
      token.center,
      crosshairs.document,
    ]);
    const distance = pathMeasure.distance;

    if (crosshairDistance !== distance) {
      crosshairDistance = distance;
      if (distance > summonRange) {
        crosshairs.icon = "icons/svg/hazard.svg";
      } else {
        crosshairs.icon = item.img;
      }

      crosshairs.draw();
      crosshairs.label = `${distance} ft.`;
    }
  }
};

let crosshairConfig = {
  size: 1,
  icon: item.img,
  label: "0 ft.",
  tag: "totd",
  snappingBehavior: {
    mode: CONST.GRID_SNAPPING_MODES.CENTER
  },
  rememberControlled: true,
};

let crosshairPosition = await warpgate.crosshairs.show(crosshairConfig, {
  show: checkDistance,
});

if (crosshairPosition.cancelled || crosshairDistance > summonRange) {
  console.log(`TOTD MACRO: Cancelling`);
  return;
}

console.log("Starting Sequence");
new Sequence()
  .effect()
  .file("jb2a.arms_of_hadar.dark_purple")
  .atLocation(crosshairPosition)
  .belowTokens()
  .scale(0.5)
  .scaleIn(0.1, 200, {ease: "easeOutCubic"})
  .scaleOut(0.1, 400, {ease: "easeInCubic"})
  .duration(1000)
  .play();

let optionConfig = { controllingActor: actor };
let [summon] = await warpgate.spawnAt(crosshairPosition, "Tentacle of the Deep", {}, {}, optionConfig);

console.log(summon);