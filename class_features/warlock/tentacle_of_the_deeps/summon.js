// let summonRange = item.system.range.value;

// let crosshairDistance = 0;
// const checkDistance = async (crosshairs) => {
//   while (crosshairs.inFlight) {
//     await warpgate.wait(100);

//     const pathMeasure = canvas.grid.measurePath([
//       token.center,
//       crosshairs.document,
//     ]);
//     const distance = pathMeasure.distance;

//     if (crosshairDistance !== distance) {
//       crosshairDistance = distance;
//       if (distance > summonRange) {
//         crosshairs.icon = "icons/svg/hazard.svg";
//       } else {
//         crosshairs.icon = item.img;
//       }

//       crosshairs.draw();
//       crosshairs.label = `${distance} ft.`;
//     }
//   }
// };

// let crosshairConfig = {
//   size: 1,
//   icon: item.img,
//   label: "0 ft.",
//   tag: "totd",
//   interval: -1,
//   rememverControlled: true,
// };

// let crosshairPosition = await warpgate.crosshairs.show(crosshairConfig, {
//   show: checkDistance,
// });

// if (crosshairPosition.cancelled || crosshairDistance > summonRange) {
//   console.log(`TOTD MACRO: Cancelling`);
//   return;
// }

console.log("Summoning");
let [summon] = await warpgate.spawn("Tentacle of the Deep");

console.log("Starting Sequence");
new Sequence()
  .effect()
  .file("jb2a.liquid.splash.blue")
  .atLocation(crosshairPosition)
  .scale(0.4)
  .duration(2500)
  .play();

let options = { controllingActor: actor };

console.log(summon);