var WHITE_FLAG_SCOPE = "world";

var WHITE_UPDATE_HOOK_ID_KEY = "updateHookIdWhite";
var WHITE_DELETE_HOOK_ID_KEY = "deleteHookIdWhite";

var WHITE_ITEM_NAME = "Shield of Maniessyr the White";

var WHITE_SPELL_ONE_USES = 3;
var WHITE_SPELL_ONE_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.GVumwXmVWxt1yUlA";
var WHITE_SPELL_ONE_NAME = `Absorb Elements (${WHITE_ITEM_NAME})`;
var WHITE_SPELL_ONE_MACRO = null;

/****************************************
 *       General Utility Functions       *
 *****************************************/

const logMessage = (level, func, msg) => {
  let logOutput = `${WHITE_ITEM_NAME}: ${func}: ${msg}`;

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
  let featureVal = object.getFlag(WHITE_FLAG_SCOPE, flag);
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
    await object.setFlag(WHITE_FLAG_SCOPE, flag, defaultVal);
  }

  return featureVal;
};

/****************************************
 *           Ability Functions           *
 *****************************************/

// Use the ability of the item
const useAbility = async () => {
  logMessage("Info", "useAbility", `Restoring channel divinity uses`);
  var feature = getObjectFromActor("Channel Divinity");
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
const item = getObjectFromActor(WHITE_ITEM_NAME);

// Get the event hooks from previous executions, if they exist
let updateHookId = await getFlagOrDefault(item, WHITE_UPDATE_HOOK_ID_KEY, -1);
let deleteHookId = await getFlagOrDefault(item, WHITE_DELETE_HOOK_ID_KEY, -1);

// Add listener for updateItem hook
if (
  !Hooks.events["updateItem"] ||
  !Hooks.events["updateItem"].some((hook) => hook.id === updateHookId)
) {
  updateHookId = Hooks.on("updateItem", async (item, change) => {
    // Check to make sure the event is relevant
    if (item.name !== WHITE_ITEM_NAME) {
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

      // Absorb Elements
      if (!getObjectFromActor(WHITE_SPELL_ONE_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${WHITE_SPELL_ONE_NAME} not found on actor`
        );
        let spell = await fromUuid(WHITE_SPELL_ONE_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${WHITE_SPELL_ONE_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${WHITE_SPELL_ONE_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: WHITE_SPELL_ONE_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: WHITE_SPELL_ONE_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: WHITE_SPELL_ONE_USES,
            },
          },
        });
        if (WHITE_SPELL_ONE_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${WHITE_SPELL_ONE_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: WHITE_SPELL_ONE_MACRO,
            name: WHITE_SPELL_ONE_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }
    } else if (!item.system.equipped || !item.system.attuned) {
      let spellClone = getObjectFromActor(WHITE_SPELL_ONE_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage("Warn", "removeSpellFromActor", `Unable to find ${WHITE_SPELL_ONE_NAME} on actor`)
      }
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(WHITE_FLAG_SCOPE, WHITE_UPDATE_HOOK_ID_KEY, updateHookId);
}

// Add listener for preDeleteItem hook
if (
  !Hooks.events["preDeleteItem"] ||
  !Hooks.events["preDeleteItem"].some((hook) => hook.id === deleteHookId)
) {
  deleteHookId = Hooks.on("preDeleteItem", async (item) => {
    // Make sure the event is relevant
    if (item.name !== WHITE_ITEM_NAME) {
      return;
    }

    // Get the listener IDs for this item
    let updateHookId = await getFlagOrDefault(
      item,
      WHITE_UPDATE_HOOK_ID_KEY,
      -1
    );

    let deleteHookid = await getFlagOrDefault(
      item,
      WHITE_DELETE_HOOK_ID_KEY,
      -1
    );

    // Remove the hooks
    Hooks.off("updateItem", updateHookId);
    Hooks.off("preDeleteItem", deleteHookid);

    // Remove the Spells
    logMessage(
      "Debug",
      "removeSpellFromActor",
      `Removing ${WHITE_SPELL_ONE_NAME} from actor`
    );
    let spellClone = getObjectFromActor(WHITE_SPELL_ONE_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(WHITE_FLAG_SCOPE, WHITE_DELETE_HOOK_ID_KEY, deleteHookId);
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
