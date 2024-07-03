const characterName = scope.charName;
const action = scope.action;

let returnValue = false;

await Dialog.confirm({
  title: "Confirm",
  content: `<p><span style="font-weight:bold">Character</span>: ${characterName}</p>
  <p><span style="font-weight:bold">Action</span>: ${action}</p>`,
  yes: () => {
    returnValue = true;
  },
  no: () => {},
});

return returnValue;
