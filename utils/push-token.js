const pushPosition = scope.pos;
const pushTarget = game.canvas.tokens.get(scope.targetId);

pushTarget.document.update({
  x: pushPosition.x,
  y: pushPosition.y,
});
