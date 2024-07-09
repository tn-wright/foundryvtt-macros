const position = scope.pos;
const lightData = scope.data;

return await AmbientLightDocument.create(
  { x: position.x, y: position.y, ...lightData },
  { parent: canvas.scene }
);
