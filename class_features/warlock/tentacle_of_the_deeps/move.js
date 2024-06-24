const tentacle = game.scenes.current.tokens.find(tkn => tkn.baseActor.name === "Tentacle of the Deep")._object;

const name = "rangefinder";
const size = 6;
const rings = 1;
const colors = [0x00ff00];

const highlights = warpgate.grid.highlightRing(
  { x: tentacle.x, y: tentacle.y, rings, name },
  { size, colors, clear: true, lifetime: 0 }
);

console.log(highlights);

const loc = await warpgate.crosshairs.show({
  size: 1,
  icon: item.img,
  tag: "totd",
  snappingBehavior: {
    mode: CONST.GRID_SNAPPING_MODES.CENTER,
  },
  rememberControlled: true,
});

if (loc.cancelled) {
  warpgate.grid.highlightRing({ name });
  return
};

const { x, y } = canvas.grid.getSnappedPoint({x: loc.x, y: loc.y}, {mode: CONST.GRID_SNAPPING_MODES.VERTEX});

const valid = highlights.find((range) => range.x == x && range.y == y);
if (!valid) {
  ui.notifications.error("Destination outside range!");
  warpgate.grid.highlightRing({ name });
  return;
}

warpgate.grid.highlightRing({ name });

await CanvasAnimation.animate(
  [
      {
          parent: placeable.mesh,
          attribute: "alpha",
          to: 0,
      },
  ],
  {
      duration: 300,
      easing: "easeOutCircle",
  },
);

await tentacle.document.update({ x: x, y: y, elevation: position.elevation }, { animate: false });

//fade in token
await CanvasAnimation.animate(
  [
      {
          parent: placeable.mesh,
          attribute: "alpha",
          from: 0,
          to: originalAlpha,
      },
  ],
  {
      duration: 300,
      easing: "easeInCircle",
  },
);




// const pushRange = 30; //feet
// const tentacle = game.scenes.current.tokens.find(tkn => tkn.baseActor.name === "Tentacle of the Deep")._object;

// /* show valid range for bump */
// const {distance} = canvas.scene.grid;

// console.log(tentacle.document.width + pushRange);

// warpgate.crosshairs.show({
//     lockSize: true,
//     lockPosition: true,
//     size: tentacle.document.width + pushRange + 1,
//     tag: 'range',
//     label: 'Valid Area',
//     fillColor: game.user.color,
//     fillAlpha: 0.5,
//     drawOutline: true,
//     borderColor: game.user.color,
//     ...tentacle.center,
// })

//  /* select destination (not verified within distance) */
// let {x, y, cancelled} = await warpgate.crosshairs.show({
//     size: 1,
//     icon: item.img,
//     drawIcon: true,
//     drawOutline: false,
//     tag: 'loc',
//     snappingBehavior: { mode: CONST.GRID_SNAPPING_MODES.CENTER }
// }, {show: (loc) => loc.initialLayer = warpgate.crosshairs.getTag('range').initialLayer});

// /* if an actual move, mutate location */
// if (x != tentacle.center.x && 
//     y != tentacle.center.y &&
//     !cancelled) {

//     /* Visual feedback for observers */
//     warpgate.plugin.notice(tentacle.center, {ping:'pulse', receivers: warpgate.USERS.ALL})
//     warpgate.plugin.notice({x,y}, {ping:'chevron', receivers: warpgate.USERS.ALL})
    
//     /* offset destination to top left corner */
//     x -= tentacle.w/2;
//     y -= tentacle.h/2;

//     /* move the target to the new location */
//     await warpgate.mutate(
//         tentacle.document,
//         {token: {x, y}},
//         {},
//         {
//             permanent: true,
//             name: 'Tentacle of the Deeps: Move',
//             description: `Moving ${tentacle.document.name} up to ${pushRange} ft.`,
//         }
//     )
// } else {
//     /* on a cancel, kill the range indicator as well */
//     warpgate.crosshairs.getTag('range').inFlight = false;
// }