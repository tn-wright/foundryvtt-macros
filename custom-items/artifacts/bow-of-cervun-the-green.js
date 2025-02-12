var GREEN_FLAG_SCOPE = "world";

var GREEN_UPDATE_HOOK_ID_KEY = "updateHookIdBlack";
var GREEN_DELETE_HOOK_ID_KEY = "deleteHookIdBlack";

var GREEN_ITEM_NAME = "Cloak of Nesantis the Black";

// !TODO: Do we use these spell settings for the custom attack action that unlocks at level 4?

var GREEN_SPELL_ONE_USES = 1;
var GREEN_SPELL_ONE_UUID = "Compendium.world.spells.Item.tux03ESXNcBevQS8";
var GREEN_SPELL_ONE_NAME = `Destructive Wave (${GREEN_ITEM_NAME})`;
var GREEN_SPELL_ONE_MACRO = null;

var GREEN_SPELL_TWO_USES = 1;
var GREEN_SPELL_TWO_UUID =
  "Compendium.world.ddb-rise-of-dragons-ddb-spells.Item.p6zDJl6RUkCFkfXP";
var GREEN_SPELL_TWO_NAME = `Wall of Water (${GREEN_ITEM_NAME})`;
var GREEN_SPELL_TWO_MACRO = null;

/****************************************
 *       General Utility Functions       *
 *****************************************/

const logMessage = (level, func, msg) => {
  let logOutput = `${GREEN_ITEM_NAME}: ${func}: ${msg}`;

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
  return actor.items.find((obj) => obj.name.trim() === objName);
};

const getFlagOrDefault = async (object, flag, defaultVal) => {
  logMessage(
    "Debug",
    "getFlagOrDefault",
    `Getting flag ${flag} from ${object}`
  );
  let featureVal = object.getFlag(GREEN_FLAG_SCOPE, flag);
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
    await object.setFlag(GREEN_FLAG_SCOPE, flag, defaultVal);
  }

  return featureVal;
};

/****************************************
 *           Ability Functions           *
 *****************************************/

// !TODO: Can this be replaced entirely with the new built in actions?

// Use the ability of the item
const useAbility = async () => {
  logMessage("Info", "useAbility", `Restoring warlock spell slot`);
  await actor.update({
    system: {
      spells: {
        pact: {
          value: actor.system.spells.pact.value + 1,
        },
      },
    },
  });
};

/****************************************
 *          Main Functionality           *
 *****************************************/

// Get this item from the owning character
const item = getObjectFromActor(GREEN_ITEM_NAME);

// Get the event hooks from previous executions, if they exist
let updateHookId = await getFlagOrDefault(item, GREEN_UPDATE_HOOK_ID_KEY, -1);
let deleteHookId = await getFlagOrDefault(item, GREEN_DELETE_HOOK_ID_KEY, -1);

// Add listener for updateItem hook
if (
  !Hooks.events["updateItem"] ||
  !Hooks.events["updateItem"].some((hook) => hook.id === updateHookId)
) {
  updateHookId = Hooks.on("updateItem", async (item, change) => {
    // Check to make sure the event is relevant
    if (item.name !== GREEN_ITEM_NAME) {
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
    item.effects.forEach((effect) => {
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

      // !TODO: Alter the damage on the Hunter's Mark spell on the actor

      if (maxActiveEffect < 3) {
        return;
      }

      // Destructive Wave
      if (!getObjectFromActor(GREEN_SPELL_ONE_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${GREEN_SPELL_ONE_NAME} not found on actor`
        );
        let spell = await fromUuid(GREEN_SPELL_ONE_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${GREEN_SPELL_ONE_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${GREEN_SPELL_ONE_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: GREEN_SPELL_ONE_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: GREEN_SPELL_ONE_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: GREEN_SPELL_ONE_USES,
            },
          },
        });
        if (GREEN_SPELL_ONE_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${GREEN_SPELL_ONE_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: GREEN_SPELL_ONE_MACRO,
            name: GREEN_SPELL_ONE_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }

      // Only add the following spell if the item is at level 4
      if (maxActiveEffect < 4) {
        return;
      }

      // Wall of Water
      if (!getObjectFromActor(GREEN_SPELL_TWO_NAME)) {
        logMessage(
          "Debug",
          "addSpellToActor",
          `Spell ${GREEN_SPELL_TWO_NAME} not found on actor`
        );
        let spell = await fromUuid(GREEN_SPELL_TWO_UUID);
        logMessage(
          "Debug",
          "addSpellToActor",
          `Fetched ${GREEN_SPELL_TWO_NAME} from compendium: ${spell.toJSON()}`
        );
        if (typeof spell === "undefined" || spell === null) {
          logMessage(
            "Error",
            "addSpellToActor",
            `${GREEN_SPELL_TWO_NAME} not found or invalid`
          );
          return;
        }

        let clone = await spell.clone({
          name: GREEN_SPELL_TWO_NAME,
          system: {
            preparation: {
              mode: "atwill",
            },
            uses: {
              max: GREEN_SPELL_TWO_USES,
              per: "dawn",
              prompt: "true",
              recovery: "",
              value: GREEN_SPELL_TWO_USES,
            },
          },
        });
        if (GREEN_SPELL_TWO_MACRO !== null) {
          logMessage(
            "Debug",
            "addSpellToActor",
            `Adding custom item macro to ${GREEN_SPELL_TWO_NAME}`
          );
          clone.setFlag("dae", "macro", {
            macro: GREEN_SPELL_TWO_MACRO,
            name: GREEN_SPELL_TWO_NAME,
            scope: "global",
            type: "script",
          });
        }

        await actor.createEmbeddedDocuments("Item", [clone]);
      }
    } else if (!item.system.equipped || !item.system.attuned) {
      let maxActiveEffect = 1;
      item.effects.forEach((effect) => {
        if (effect.disabled) {
          return;
        }

        // Get the level numver from the effect name and convert to int
        let num = parseInt(effect.name.match(/\(([^)]+)\)/)[1]);

        if (num > maxActiveEffect) {
          maxActiveEffect = num;
        }
      });

      // !TODO: Reset the damage of Hunter's Mark to the default

      // Only try to remove the following spells if item is at or above level 3
      if (maxActiveEffect < 3) {
        return;
      }

      let spellClone = getObjectFromActor(GREEN_SPELL_ONE_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${GREEN_SPELL_ONE_NAME} on actor`
        );
      }

      if (maxActiveEffect < 4) {
        return;
      }

      spellClone = getObjectFromActor(GREEN_SPELL_TWO_NAME);
      if (typeof spellClone !== "undefined" && spellClone !== null) {
        await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
      } else {
        logMessage(
          "Warn",
          "removeSpellFromActor",
          `Unable to find ${GREEN_SPELL_TWO_NAME} on actor`
        );
      }
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(GREEN_FLAG_SCOPE, GREEN_UPDATE_HOOK_ID_KEY, updateHookId);
}

// Add listener for preDeleteItem hook
if (
  !Hooks.events["preDeleteItem"] ||
  !Hooks.events["preDeleteItem"].some((hook) => hook.id === deleteHookId)
) {
  deleteHookId = Hooks.on("preDeleteItem", async (item) => {
    // Make sure the event is relevant
    if (item.name !== GREEN_ITEM_NAME) {
      return;
    }

    // Get the listener IDs for this item
    let updateHookId = await getFlagOrDefault(
      item,
      GREEN_UPDATE_HOOK_ID_KEY,
      -1
    );

    let deleteHookid = await getFlagOrDefault(
      item,
      GREEN_DELETE_HOOK_ID_KEY,
      -1
    );

    // Remove the hooks
    Hooks.off("updateItem", updateHookId);
    Hooks.off("preDeleteItem", deleteHookid);

    // Remove the Spells
    logMessage("Debug", "removeSpellFromActor", `Removing spells from actor`);

    let maxActiveEffect = 1;
    item.effects.forEach((effect) => {
      if (effect.disabled) {
        return;
      }

      // Get the level numver from the effect name and convert to int
      let num = parseInt(effect.name.match(/\(([^)]+)\)/)[1]);

      if (num > maxActiveEffect) {
        maxActiveEffect = num;
      }
    });

    // !TODO: Reset the damage of Hunter's Mark to the default

    // Only try to remove the following spells if item is at or above level 3
    if (maxActiveEffect < 3) {
      return;
    }

    let spellClone = getObjectFromActor(GREEN_SPELL_ONE_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${GREEN_SPELL_ONE_NAME} on actor`
      );
    }

    // Only try to remove the following spells if item is at or above level 4
    if (maxActiveEffect < 4) {
      return;
    }

    spellClone = getObjectFromActor(GREEN_SPELL_TWO_NAME);
    if (typeof spellClone !== "undefined" && spellClone !== null) {
      await actor.deleteEmbeddedDocuments("Item", [spellClone.id]);
    } else {
      logMessage(
        "Warn",
        "removeSpellFromActor",
        `Unable to find ${GREEN_SPELL_TWO_NAME} on actor`
      );
    }
  });

  // Store the id of the listener for reference later
  item.setFlag(GREEN_FLAG_SCOPE, GREEN_DELETE_HOOK_ID_KEY, deleteHookId);
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
