if(args[0] === "on") {
  return;
}

const poison = fromUuidSync(args[1]);
const weapon = fromUuidSync(args[2]);

poison.use();