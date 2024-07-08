const userActor = item.actor;

const currency = userActor.system.currency;
const worth =
  currency.pp * 10 + currency.gp + currency.sp / 10 + currency.cp / 100;

if (worth < 50) {
  ui.notifications.warn("Not enough money to craft potent poison...");
  return;
}

let targetMoney = 50;
let goldChange = Math.min(currency.gp, targetMoney);
targetMoney -= goldChange;
let platChange = Math.min(currency.pp, Math.floor(targetMoney / 10));
targetMoney -= platChange * 5;
let silvChange = Math.min(currency.sp, targetMoney * 10);
targetMoney -= Math.floor(silvChange / 10);
let copChange = Math.min(currency.cp, targetMoney * 100);

userActor.update({
  system: {
    currency: {
      pp: currency.pp - platChange,
      gp: currency.gp - goldChange,
      sp: currency.sp - silvChange,
      cp: currency.cp - copChange,
    },
  },
});

let poisonItem = userActor.items.find((i) => i.name === "Potent Poison");

if (poisonItem) {
  let currQuantity = poisonItem.system.quantity;
  await poisonItem.update({
    system: {
      quantity: currQuantity + 3,
    },
  });
} else {
  poisonItem = fromUuidSync("Item.F6mW0K2bZAYEmBa3");
  await userActor.createEmbeddedDocuments("Item", [poisonItem]);
}
