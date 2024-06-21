var RED_FLAG_SCOPE = "world";

var RED_UPDATE_HOOK_ID_KEY = "updateHookIdRed";
var RED_DELETE_HOOK_ID_KEY = "deleteHookIdRed";

var RED_ITEM_NAME = "Helm of Caldrunith the Red";

var RED_SPELL_ONE_USES = 2;
var RED_SPELL_ONE_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.7GImCbivuse6sHZR";
var RED_SPELL_ONE_NAME = `Aganazzar's Scorcher (${RED_ITEM_NAME})`;
var RED_SPELL_ONE_MACRO = null;

var RED_SPELL_TWO_USES = 1;
var RED_SPELL_TWO_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.LJC7ZeAC98QsWKx7";
var RED_SPELL_TWO_NAME = `Fireball (${RED_ITEM_NAME})`;
var RED_SPELL_TWO_MACRO = null;

/****************************************
 *       General Utility Functions       *
 *****************************************/

const logMessage = (level, func, msg) => {
  let logOutput = `${RED_ITEM_NAME}: ${func}: ${msg}`;

  if (level === "Error") {
    console.error(logOutput);
  } else if (level === "Warn") {
    console.warn(logOutput);
  } else if (level === "Info") {
    console.log(logOutput);
  } else {
    console.debug(logOutput);
  }
};

const getObjectFromActor = (objName) => {
  logMessage("Debug", "getObjectFromActor", `Getting ${objName} from actor`);
  return actor
    .getEmbeddedCollection("items")
    .find((obj) => obj.name.trim() === objName);
};

const getFlagOrDefault = async (object, flag, defaultVal) => {
  logMessage(
    "Debug",
    "getFlagOrDefault",
    `Getting flag ${flag} from ${object}`
  );
  let featureVal = object.getFlag(RED_FLAG_SCOPE, flag);
  logMessage(
    "Debug",
    "getFlagOrDefault",
    `Got value ${featureVal} for ${flag}`
  );

  if (typeof featureVal === "undefined" || featureVal === null) {
    logMessage(
      "Debug",
      "getFlagOrDefault",
      `No value found, using default of ${defaultVal}`
    );
    featureVal = defaultVal;
    await object.setFlag(RED_FLAG_SCOPE, flag, defaultVal);
  }

  return featureVal;
};

/****************************************
 *           Ability Functions           *
 *****************************************/

// Use the ability of the item
const useAbility = async () => {
  logMessage("Info", "useAbility", `Restoring sorcery points`);
  var feature = getObjectFromActor("Sorcery Points");
  await feature.update({
    system: {
      uses: {
        value: feature.system.uses.max,
      },
    },
  });
};

/****************************************
 *          Main Functionality           *
 *****************************************/

// Get this item from the owning character
const item = getObjectFromActor(RED_ITEM_NAME);

// Get the event hooks from previous executions, if they exist
let updateHookId = await getFlagOrDefault(item, RED_UPDATE_HOOK_ID_KEY, -1);
let deleteHookId = await getFlagOrDefault(item, RED_DELETE_HOOK_ID_KEY, -1);

// Add listener for updateItem hook
if (
  !Hooks.events["updateItem"] ||
  !Hooks.events["updateItem"].some((hook) => hook.id === updateHookId)
) {
  updateHookId = Hooks.on("updateItem", async (item, change) => {
    // Check to make sure the event is relevant
    if (item.name !== RED_ITEM_NAME) {
      return;
    }

    if (!change.hasOwnProperty("system")) {
      return;
    }

    if (
      !change.system.hasOwnProperty("equipped") &&
      !change.system.hasOwnProperty("attuned")
    ) {
      return;
    }

    logMessage(
      "Debug",
      "addSpellToActor",
      `Adding spells to actor`
    );
    if (item.system.equipped && item.system.attuned) {

      // Aganazzar's Scorcher
      if (!getObjectFromActor(RED_SPELL_ONE_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${RED_SPELL_ONE_NAME} not found on actor`
        );
        let spell = await fromUuid(RED_SPELL_ONE_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${RED_SPELL_ONE_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${RED_SPELL_ONE_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: RED_SPELL_ONE_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: RED_SPELL_ONE_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: RED_SPELL_ONE_USES,
            },
          },
        });
        if (RED_SPELL_ONE_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${RED_SPELL_ONE_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: RED_SPELL_ONE_MACRO,
            name: RED_SPELL_ONE_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }

      // Fireball
      if (!getObjectFromActor(RED_SPELL_TWO_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${RED_SPELL_TWO_NAME} not found on actor`
        );
        let spell = await fromUuid(RED_SPELL_TWO_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${RED_SPELL_TWO_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${RED_SPELL_TWO_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: RED_SPELL_TWO_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: RED_SPELL_TWO_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: RED_SPELL_TWO_USES,
            },
          },
        });
        if (RED_SPELL_TWO_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${RED_SPELL_TWO_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: RED_SPELL_TWO_MACRO,
            name: RED_SPELL_TWO_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }
    } else if (!item.system.equipped || !item.system.attuned) {
      let spellClone = getObjectFromActor(RED_SPELL_ONE_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage("Warn", "removeSpellFromActor", `Unable to find ${RED_SPELL_ONE_NAME} on actor`)
      }

      spellClone = getObjectFromActor(RED_SPELL_TWO_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage("Warn", "removeSpellFromActor", `Unable to find ${RED_SPELL_TWO_NAME} on actor`)
      }
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(RED_FLAG_SCOPE, RED_UPDATE_HOOK_ID_KEY, updateHookId);
}

// Add listener for preDeleteItem hook
if (
  !Hooks.events["preDeleteItem"] ||
  !Hooks.events["preDeleteItem"].some((hook) => hook.id === deleteHookId)
) {
  deleteHookId = Hooks.on("preDeleteItem", async (item) => {
    // Make sure the event is relevant
    if (item.name !== RED_ITEM_NAME) {
      return;
    }

    // Get the listener IDs for this item
    let updateHookId = await getFlagOrDefault(
      item,
      RED_UPDATE_HOOK_ID_KEY,
      -1
    );

    let deleteHookid = await getFlagOrDefault(
      item,
      RED_DELETE_HOOK_ID_KEY,
      -1
    );

    // Remove the hooks
    Hooks.off("updateItem", updateHookId);
    Hooks.off("preDeleteItem", deleteHookid);

    // Remove the Spells
    logMessage(
      "Debug",
      "removeSpellFromActor",
      `Removing ${RED_SPELL_ONE_NAME} from actor`
    );
    let spellClone = getObjectFromActor(RED_SPELL_ONE_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(RED_FLAG_SCOPE, RED_DELETE_HOOK_ID_KEY, deleteHookId);
}

if(item.system.equipped && item.system.attuned) {
  // If the item is equipped and attuned, use the ability
  useAbility();
} else {
  // Otherwise, do nothing and refund the spend resource
  ui.notifications.warn(`${item.name} must be equipped and attuned to use its ability...`);
  await item.update({
    system: {
      uses: {
        value: item.system.uses.value + 1
      }
    }
  });
}