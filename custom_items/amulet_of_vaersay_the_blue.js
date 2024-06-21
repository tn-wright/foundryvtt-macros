var BLUE_FLAG_SCOPE = "world";

var BLUE_UPDATE_HOOK_ID_KEY = "updateHookIdBlue";
var BLUE_DELETE_HOOK_ID_KEY = "deleteHookIdBlue";

var BLUE_ITEM_NAME = "Amulet of Vaersay the Blue";

var BLUE_SPELL_ONE_USES = 1;
var BLUE_SPELL_ONE_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.JYZ1dN1H8aZ5fy4i";
var BLUE_SPELL_ONE_NAME = `Mass Suggestion (${BLUE_ITEM_NAME})`;
var BLUE_SPELL_ONE_MACRO = null;

var BLUE_SPELL_TWO_USES = 1;
var BLUE_SPELL_TWO_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.pN2FDPHNR2MrGiCk";
var BLUE_SPELL_TWO_NAME = `Dominate Person (${BLUE_ITEM_NAME})`;
var BLUE_SPELL_TWO_MACRO = null;

var BLUE_SPELL_THREE_USES = 1;
var BLUE_SPELL_THREE_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.dHRAVTwwaTgiOqwJ";
var BLUE_SPELL_THREE_NAME = `Charm Person (${BLUE_ITEM_NAME})`;
var BLUE_SPELL_THREE_MACRO = null;

var BLUE_SPELL_FOUR_USES = 1;
var BLUE_SPELL_FOUR_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.nIY1uWQZ9lV0nVUL";
var BLUE_SPELL_FOUR_NAME = `Enthrall (${BLUE_ITEM_NAME})`;
var BLUE_SPELL_FOUR_MACRO = null;

var BLUE_SPELL_FIVE_USES = 1;
var BLUE_SPELL_FIVE_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.PQ9gqtk0W8BULHho";
var BLUE_SPELL_FIVE_NAME = `Fast Friends (${BLUE_ITEM_NAME})`;
var BLUE_SPELL_FIVE_MACRO = null;

/****************************************
 *       General Utility Functions       *
 *****************************************/

const logMessage = (level, func, msg) => {
  let logOutput = `${BLUE_ITEM_NAME}: ${func}: ${msg}`;

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
  let featureVal = object.getFlag(BLUE_FLAG_SCOPE, flag);
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
    await object.setFlag(BLUE_FLAG_SCOPE, flag, defaultVal);
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
const item = getObjectFromActor(BLUE_ITEM_NAME);

// Get the event hooks from previous executions, if they exist
let updateHookId = await getFlagOrDefault(item, BLUE_UPDATE_HOOK_ID_KEY, -1);
let deleteHookId = await getFlagOrDefault(item, BLUE_DELETE_HOOK_ID_KEY, -1);

// Add listener for updateItem hook
if (
  !Hooks.events["updateItem"] ||
  !Hooks.events["updateItem"].some((hook) => hook.id === updateHookId)
) {
  updateHookId = Hooks.on("updateItem", async (item, change) => {
    // Check to make sure the event is relevant
    if (item.name !== BLUE_ITEM_NAME) {
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

    let maxActiveEffect = 1;
    item.getEmbeddedCollection("effects").forEach((effect) => {
      if (effect.disabled) {
        return;
      }

      // Get the level numver from the effect name and convert to int
      let num = parseInt(effect.name.match(/\(([^)]+)\)/)[1]);

      if (num > maxActiveEffect) {
        maxActiveEffect = num;
      }
    });

    logMessage("Debug", "addSpellToActor", `Adding spells to actor`);
    if (item.system.equipped && item.system.attuned) {
      // Only add the following spells if the item is at or above level 3
      if (maxActiveEffect < 3) {
        return;
      }

      // Aganazzar's Scorcher
      if (!getObjectFromActor(BLUE_SPELL_ONE_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${BLUE_SPELL_ONE_NAME} not found on actor`
        );
        let spell = await fromUuid(BLUE_SPELL_ONE_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${BLUE_SPELL_ONE_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${BLUE_SPELL_ONE_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: BLUE_SPELL_ONE_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: BLUE_SPELL_ONE_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: BLUE_SPELL_ONE_USES,
            },
          },
        });
        if (BLUE_SPELL_ONE_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${BLUE_SPELL_ONE_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: BLUE_SPELL_ONE_MACRO,
            name: BLUE_SPELL_ONE_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }

      // Fireball
      if (!getObjectFromActor(BLUE_SPELL_TWO_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${BLUE_SPELL_TWO_NAME} not found on actor`
        );
        let spell = await fromUuid(BLUE_SPELL_TWO_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${BLUE_SPELL_TWO_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${BLUE_SPELL_TWO_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: BLUE_SPELL_TWO_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: BLUE_SPELL_TWO_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: BLUE_SPELL_TWO_USES,
            },
          },
        });
        if (BLUE_SPELL_TWO_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${BLUE_SPELL_TWO_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: BLUE_SPELL_TWO_MACRO,
            name: BLUE_SPELL_TWO_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }

      // Only add the following spells if the item is at or above level 4
      if (maxActiveEffect < 4) {
        return;
      }

      // Charm Person
      if (!getObjectFromActor(BLUE_SPELL_THREE_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${BLUE_SPELL_THREE_NAME} not found on actor`
        );
        let spell = await fromUuid(BLUE_SPELL_THREE_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${BLUE_SPELL_THREE_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${BLUE_SPELL_THREE_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: BLUE_SPELL_THREE_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: BLUE_SPELL_THREE_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: BLUE_SPELL_THREE_USES,
            },
          },
        });
        if (BLUE_SPELL_THREE_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${BLUE_SPELL_THREE_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: BLUE_SPELL_THREE_MACRO,
            name: BLUE_SPELL_THREE_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }

      // Enthrall
      if (!getObjectFromActor(BLUE_SPELL_FOUR_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${BLUE_SPELL_FOUR_NAME} not found on actor`
        );
        let spell = await fromUuid(BLUE_SPELL_FOUR_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${BLUE_SPELL_FOUR_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${BLUE_SPELL_FOUR_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: BLUE_SPELL_FOUR_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: BLUE_SPELL_FOUR_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: BLUE_SPELL_FOUR_USES,
            },
          },
        });
        if (BLUE_SPELL_FOUR_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${BLUE_SPELL_FOUR_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: BLUE_SPELL_FOUR_MACRO,
            name: BLUE_SPELL_FOUR_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }

      // Fast Friends
      if (!getObjectFromActor(BLUE_SPELL_FIVE_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${BLUE_SPELL_FIVE_NAME} not found on actor`
        );
        let spell = await fromUuid(BLUE_SPELL_FIVE_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${BLUE_SPELL_FIVE_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${BLUE_SPELL_FIVE_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: BLUE_SPELL_FIVE_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: BLUE_SPELL_FIVE_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: BLUE_SPELL_FIVE_USES,
            },
          },
        });
        if (BLUE_SPELL_FIVE_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${BLUE_SPELL_FIVE_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: BLUE_SPELL_FIVE_MACRO,
            name: BLUE_SPELL_FIVE_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }
    } else if (!item.system.equipped || !item.system.attuned) {
      let maxActiveEffect = 1;
      item.getEmbeddedCollection("effects").forEach((effect) => {
        if (effect.disabled) {
          return;
        }

        // Get the level numver from the effect name and convert to int
        let num = parseInt(effect.name.match(/\(([^)]+)\)/)[1]);

        if (num > maxActiveEffect) {
          maxActiveEffect = num;
        }
      });

      // Only try to remove the following spells if item is at or above level 3
      if (maxActiveEffect < 3) {
        return;
      }

      let spellClone = getObjectFromActor(BLUE_SPELL_ONE_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${BLUE_SPELL_ONE_NAME} on actor`
        );
      }

      spellClone = getObjectFromActor(BLUE_SPELL_TWO_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${BLUE_SPELL_TWO_NAME} on actor`
        );
      }

      // Only try to remove the following spells if item is at or above level 4
      if (maxActiveEffect < 4) {
        return;
      }

      spellClone = getObjectFromActor(BLUE_SPELL_THREE_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${BLUE_SPELL_THREE_NAME} on actor`
        );
      }

      spellClone = getObjectFromActor(BLUE_SPELL_FOUR_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${BLUE_SPELL_FOUR_NAME} on actor`
        );
      }

      spellClone = getObjectFromActor(BLUE_SPELL_FIVE_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${BLUE_SPELL_FIVE_NAME} on actor`
        );
      }
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(BLUE_FLAG_SCOPE, BLUE_UPDATE_HOOK_ID_KEY, updateHookId);
}

// Add listener for preDeleteItem hook
if (
  !Hooks.events["preDeleteItem"] ||
  !Hooks.events["preDeleteItem"].some((hook) => hook.id === deleteHookId)
) {
  deleteHookId = Hooks.on("preDeleteItem", async (item) => {
    // Make sure the event is relevant
    if (item.name !== BLUE_ITEM_NAME) {
      return;
    }

    // Get the listener IDs for this item
    let updateHookId = await getFlagOrDefault(
      item,
      BLUE_UPDATE_HOOK_ID_KEY,
      -1
    );

    let deleteHookid = await getFlagOrDefault(
      item,
      BLUE_DELETE_HOOK_ID_KEY,
      -1
    );

    // Remove the hooks
    Hooks.off("updateItem", updateHookId);
    Hooks.off("preDeleteItem", deleteHookid);

    // Remove the Spells
    logMessage("Debug", "removeSpellFromActor", `Removing spells from actor`);

    let maxActiveEffect = 1;
    item.getEmbeddedCollection("effects").forEach((effect) => {
      if (effect.disabled) {
        return;
      }

      // Get the level numver from the effect name and convert to int
      let num = parseInt(effect.name.match(/\(([^)]+)\)/)[1]);

      if (num > maxActiveEffect) {
        maxActiveEffect = num;
      }
    });

    // Only try to remove the following spells if item is at or above level 3
    if (maxActiveEffect < 3) {
      return;
    }

    let spellClone = getObjectFromActor(BLUE_SPELL_ONE_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${BLUE_SPELL_ONE_NAME} on actor`
      );
    }

    spellClone = getObjectFromActor(BLUE_SPELL_TWO_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${BLUE_SPELL_TWO_NAME} on actor`
      );
    }

    // Only try to remove the following spells if item is at or above level 4
    if (maxActiveEffect < 4) {
      return;
    }

    spellClone = getObjectFromActor(BLUE_SPELL_THREE_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${BLUE_SPELL_THREE_NAME} on actor`
      );
    }

    spellClone = getObjectFromActor(BLUE_SPELL_FOUR_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${BLUE_SPELL_FOUR_NAME} on actor`
      );
    }

    spellClone = getObjectFromActor(BLUE_SPELL_FIVE_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${BLUE_SPELL_FIVE_NAME} on actor`
      );
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(BLUE_FLAG_SCOPE, BLUE_DELETE_HOOK_ID_KEY, deleteHookId);
}

if (item.system.equipped && item.system.attuned) {
  // If the item is equipped and attuned, use the ability
  useAbility();
} else {
  // Otherwise, do nothing and refund the spend resource
  ui.notifications.warn(
    `${item.name} must be equipped and attuned to use its ability...`
  );
  await item.update({
    system: {
      uses: {
        value: item.system.uses.value + 1,
      },
    },
  });
}
