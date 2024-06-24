// const name = "rangefinder";
// const size = 2;
// const rings = 3;
// const colors = [0x0000ff, 0x00ff00, 0xff0000];

// const highlights = warpgate.grid.highlightRing(
//   { x: token.x, y: token.y, rings, name },
//   { size, colors, clear: true, lifetime: 0 }
// );

// const loc = await warpgate.crosshairs.show({
//   size: 1,
//   icon: item.img,
//   label: "0 ft.",
//   tag: "totd",
//   snappingBehavior: {
//     mode: CONST.GRID_SNAPPING_MODES.CENTER,
//   },
//   rememberControlled: true,
// });

// if (loc.cancelled) return;

// const { x, y } = canvas.grid.getSnappedPosition(loc.x - 10, loc.y - 10);

// const valid = highlights.find((range) => range.x == x && range.y == y);
// if (!valid) {
//   ui.notifications.error("Destination outside range!");
//   return;
// }

// warpgate.grid.highlightRing({ name });

// await token.document.update({ x, y });




const pushRange = 30; //feet
const tentacle = game.user.targets.first(); //placeable

/* show valid range for bump */
const {distance} = canvas.scene.grid;

warpgate.crosshairs.show({
    lockSize: true,
    lockPosition: true,
    size: tentacle.document.width + pushRange,
    tag: 'range',
    drawIcon: false,
    label: 'Valid Area',
    ...tentacle.center,
})

 /* select destination (not verified within distance) */
let {x, y, cancelled} = await warpgate.crosshairs.show({
    size: 1,
    icon: tentacle.document.texture.src,
    drawIcon: true,
    drawOutline: false,
    tag: 'loc',
    snappingBehavior: { mode: CONST.GRID_SNAPPING_MODES.CENTER }
}, {show: (loc) => loc.initialLayer = warpgate.crosshairs.getTag('range').initialLayer});

/* if an actual move, mutate location */
if (x != tentacle.center.x && 
    y != tentacle.center.y &&
    !cancelled) {

    /* Visual feedback for observers */
    warpgate.plugin.notice(tentacle.center, {ping:'pulse', receivers: warpgate.USERS.ALL})
    warpgate.plugin.notice({x,y}, {ping:'chevron', receivers: warpgate.USERS.ALL})
    
    /* offset destination to top left corner */
    x -= tentacle.w/2;
    y -= tentacle.h/2;

    /* move the target to the new location */
    await warpgate.mutate(
        tentacle.document,
        {token: {x, y}},
        {},
        {
            permanent: true,
            name: 'Tentacle of the Deeps: Move',
            description: `Moving ${tentacle.document.name} up to ${pushRange} ft.`,
        }
    )
} else {
    /* on a cancel, kill the range indicator as well */
    warpgate.crosshairs.getTag('range').inFlight = false;
}