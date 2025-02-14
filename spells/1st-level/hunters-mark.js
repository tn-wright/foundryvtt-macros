const workflow = args[0].workflow;

// stop if this was not executed as a damage bonus
if (args[0].macroPass !== "DamageBonus") {
  return;
}

let sourceActor = args[0].actor;

// Only run if it's for an attack roll that hit and the attacker has an onUpdateTarget flag
if (
  !["rwak", "mwak", "rsak", "msak"].includes(workflow.activity.actionType) ||
  args[0].hitTargets?.length <= 0 ||
  !sourceActor.flags?.dae?.onUpdateTarget
) {
  return;
}

let hitTargetUuid = args[0].hitTargets[0]?.uuid;

// Only run if the hit target matches the target of Hunter's Mark in the onUpdateTarget flag
if (
  !sourceActor.flags.dae.onUpdateTarget?.find(
    (flag) =>
      flag.flagName === "Hunter's Mark" &&
      flag.sourceTokenUuid === hitTargetUuid
  )
) {
  return;
}

return new game.system.dice.DamageRoll(
  "1d6",
  {},
  {
    isCritical: workflow.isCritical,
    properties: ["mgc"],
    type: "force",
    flavor: "Hunter's Mark",
  }
);
