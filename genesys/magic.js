// First check that the user has 1 target, and exit if they don't
if (game.user.targets.size !== 1) {
  ui.notifications.warn("You must select exactly 1 target...");
  return;
}

// Get the caster actor, the speaker object for that actor, and the target actor
const casterActor = (game.user.character) ? game.user.character : actor;
const casterSpeaker = ChatMessage.getSpeaker(casterActor);
const spellTarget = game.user.targets.first()?.actor;

// Set constants for genesys icons, bolding spans, and common effect descriptions
const DIFFICULTY_DIE_ICON =
  '<span class="dietype starwars difficulty">d</span>';
const ADVANTAGE_ICON = '<span class="dietype genesys advantage">a</span>';
const SETBACK_DIE_ICON = '<span class="dietype starwars setback">b</span>';
const SUCCESS_ICON = '<span class="dietype genesys success">s</span>';
const FAILURE_ICON = '<span class="dietype genesys failure">f</span>';
const ABILITY_DIE_ICON = '<span class="dietype starwars ability">d</span>';

const BOLD_SPAN_START = '<span style="font-weight:bold;">';
const BOLD_SPAN_END = "</span>";

const EFFECT_DESCRIPTIONS = {
  range: `Increase the range of the spell by one range band. This may be added multiple times, increaseing the range by one range band each time.`,
  addTarget: `The spell affects one additional target within range of the spell. In addition, after casting the spell, you may spend ${ADVANTAGE_ICON} to affect one additional target within range of the spell (and may trigger the multiple times, spending ${ADVANTAGE_ICON} each time).`,
};

// #region dialogs

/**
 * Creates the items needed for a dialog showing the enhancements availble for an attack spell. Calls
 *   {@link renderSpellTypeDialog} to render the actual dialog.
 *
 * @param {number} baseDifficulty - the base difficult of the roll. Should be between 0 and 5
 * @param {number} difficultyUpgradeCount - The number of difficulty upgrades to apply
 * @param {number} setbackCount - The number of setback dice to add
 * @param {number} focusLevel - The number of times Mental Focus was used
 * @param {boolean} ignoreStrain - If true, skip the automatic strain application to the caster
 */
function renderAttackDialog(
  baseDifficulty,
  difficultyUpgradeCount,
  setbackCount,
  focusLevel,
  ignoreStrain
) {
  let attackTitle = "Attack Options";
  let attackContent = `
    <p>${BOLD_SPAN_START}Attack:${BOLD_SPAN_END} Select one target at short range (but not engaged). Make an attack following the combat check rules, but using the divine skill. The attack deals damage equal to the linked characteristic plus 1 for every uncancelled ${SUCCESS_ICON}. There is no critical rating, so a triumph must be used to inflict a critical injury.</p>
    <form style="padding:5px">
      <p style="font-weight:bold">Add up to ${
        5 - baseDifficulty
      } more difficulty dice:</p>
      <div class="form-group">
        <input type="checkbox" name="blast">
        <label for="blast" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Blast${BOLD_SPAN_END}: The attack gains the Blast quality with a rating equal to your character's ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="closeCombat">
        <label for="closeCombat" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Close Combat${BOLD_SPAN_END}: May select a target engaged with your character. </label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="deadly">
        <label for="deadly" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Deadly${BOLD_SPAN_END}: The attack gains a Critical rating of 2. The attack also gains the Vicious quality with a rating equal to the character's ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="fire">
        <label for="fire" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Fire${BOLD_SPAN_END}: The attack gains the Burn quality with a rating equal to your character's ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="holy">
        <label for="holy" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Holy/Unholy${BOLD_SPAN_END}: When dealing damage to a target that the GM determins is the antithesis of the character's faith or deity (such as a priest of a god of life attacking an undead zombie), each ${SUCCESS_ICON} deals +2 damage, instead of +1.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="ice">
        <label for="ice" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Ice${BOLD_SPAN_END}: The attack gains the Ensnare quality with a rating equal to the character's ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="impact">
        <label for="impact" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Impact${BOLD_SPAN_END}: The attack gains the Knockdown quality. The attack also gains the Disorient quality with a rating equal to the character's ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="lightning">
        <label for="lightning" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Lightning${BOLD_SPAN_END}: The attack gains the Stun quality with a rating equal to the character's ranks in Knowledge. The attack also gains the Auto-fire quality. (You must increase the difficulty by one to use the Auto-fire quality as normal).</label>
      </div>
      <div class="form-group">
        <input type="number" name="range" value="0" min="0" max="5" style="flex:0.08;">
        <label for="range" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Range${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["range"]
  }</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="destructive">
        <label for="destructive" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Destructive${BOLD_SPAN_END}: The attack gains the Sunder quality. The attack also gains the Pierce wuality with a rating equal to the character's ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="empowered">
        <label for="empowered" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Empowered${BOLD_SPAN_END}: The attack deals damage equal to twice the characteristic linked to the skill (instead of dealing damage equal to the characteristic). If the attack has the Blast quality, it affects all characters within short range, instead of engaged.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="poisonous">
        <label for="poisonous" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Poisonous${BOLD_SPAN_END}: If the attack deals damage, the target must immediately make a Hard (${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Resilience check or suffer wounds equal to the character's rank in Knowledge, and strain equal to the character's ranks in Knowledge. This counts as a poison.</label>
      </div>
    </form>
    `;

  let attackCallback = (html) => {
    const formData = new FormDataExtended(html[0].querySelector("form")).object;
    let range = 0;
    let blast = 0;
    let closeCombat = 0;
    let deadly = 0;
    let fire = 0;
    let holy = 0;
    let ice = 0;
    let impact = 0;
    let lightning = 0;
    let destructive = 0;
    let empowered = 0;
    let poisonous = 0;

    let rangeBand = "short";

    let flavorTextAddons = [];
    let effectsList = [];

    if (formData.blast) {
      blast = 1;
      flavorTextAddons.push("blast");
      effectsList.push(
        `${BOLD_SPAN_START}Blast:${BOLD_SPAN_END} Gain Blast(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.closeCombat) {
      closeCombat = 1;
      rangeBand = "engaged";
      flavorTextAddons.push("close combat");
      effectsList.push(
        `${BOLD_SPAN_START}Close Combat:${BOLD_SPAN_END} Can select engaged targets`
      );
    }

    if (formData.deadly) {
      deadly = 1;
      flavorTextAddons.push("deadly");
      effectsList.push(
        `${BOLD_SPAN_START}Deadly:${BOLD_SPAN_END} Gain Critical(2) and Vicious(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.fire) {
      fire = 1;
      flavorTextAddons.push("fire");
      effectsList.push(
        `${BOLD_SPAN_START}Fire:${BOLD_SPAN_END} Gain Burn(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.holy) {
      holy = 1;
      flavorTextAddons.push("holy");
      effectsList.push(
        `${BOLD_SPAN_START}Holy:${BOLD_SPAN_END} Gain Burn(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.ice) {
      ice = 1;
      flavorTextAddons.push("ice");
      effectsList.push(
        `${BOLD_SPAN_START}Ice:${BOLD_SPAN_END} Gain Ensnare(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.impact) {
      impact = 1;
      flavorTextAddons.push("impact");
      effectsList.push(
        `${BOLD_SPAN_START}Impact:${BOLD_SPAN_END} Gain Knockdown and Disorient(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.lightning) {
      lightning = 1;
      flavorTextAddons.push("lightning");
      effectsList.push(
        `${BOLD_SPAN_START}Lightning:${BOLD_SPAN_END} Gain Auto-fire and Stun(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.range > 0) {
      range = formData.range;

      switch (range) {
        case 1:
          rangeBand = "medium";
          break;
        case 2:
          rangeBand = "long";
          break;
        case 3:
          rangeBand = "extreme";
          break;
      }

      flavorTextAddons.push("range");
      effectsList.push(
        `${BOLD_SPAN_START}Range:${BOLD_SPAN_END} Increase maximum range`
      );
    }

    if (formData.destructive) {
      destructive = 2;
      flavorTextAddons.push("destructive");
      effectsList.push(
        `${BOLD_SPAN_START}Destructive:${BOLD_SPAN_END} Gain Sunder and Pierce(${casterActor.system.skills["Knowledge"].rank})`
      );
    }

    if (formData.empowered) {
      empowered = 2;
      flavorTextAddons.push("empowered");
      effectsList.push(
        `${BOLD_SPAN_START}Empowered:${BOLD_SPAN_END} Deal an extra ${BOLD_SPAN_START}${casterActor.system.characteristics["Willpower"].value}${BOLD_SPAN_END} damage`
      );
    }

    if (formData.poisonous) {
      poisonous = 2;
      flavorTextAddons.push("poisonous");
      effectsList.push(
        `${BOLD_SPAN_START}Poisonous:${BOLD_SPAN_END} Target must make Hard([DD][DD][DD]) Resilience check or suffer ${casterActor.system.skills["Knowledge"].rank} wound and ${casterActor.system.skills["Knowledge"].rank} strain from poison.`
      );
    }

    let difficultyMod =
      range +
      blast +
      closeCombat +
      deadly +
      fire +
      holy +
      ice +
      impact +
      lightning +
      destructive +
      empowered +
      poisonous;
    let totalDifficulty = baseDifficulty + difficultyMod;

    if (totalDifficulty > 5) {
      ui.notifications.warn(
        "You added too many modifiers! The total difficulty of the roll cannot exceed 5..."
      );
      return;
    } else {
      if (!ignoreStrain) increaseStrain(focusLevel);

      let targetRangedDefense = spellTarget.system.stats.defence.ranged;
      let targetMeleeDefense = spellTarget.system.stats.defence.melee;

      let targetDefense = closeCombat
        ? targetMeleeDefense
        : targetRangedDefense;

      ChatMessage.create({
        content: getAttackMessageContent(rangeBand, effectsList),
        speaker: casterSpeaker,
      });

      let flavorText = buildFlavorText("attack", flavorTextAddons);
      createRoll(
        totalDifficulty,
        difficultyUpgradeCount,
        setbackCount + targetDefense,
        focusLevel,
        flavorText
      );
    }
  };

  renderSpellTypeDialog(attackTitle, attackContent, attackCallback);
}

/**
 * Creates the items needed for a dialog showing the enhancements availble for an augment spell. Calls
 *   {@link renderSpellTypeDialog} to render the actual dialog.
 *
 * @param {number} baseDifficulty - the base difficult of the roll. Should be between 0 and 5
 * @param {number} difficultyUpgradeCount - The number of difficulty upgrades to apply
 * @param {number} setbackCount - The number of setback dice to add
 * @param {number} focusLevel - The number of times Mental Focus was used
 * @param {boolean} ignoreStrain - If true, skip the automatic strain application to the caster
 */
function renderAugmentDialog(
  baseDifficulty,
  difficultyUpgradeCount,
  setbackCount,
  focusLevel,
  ignoreStrain
) {
  let augmentTitle = "Augment Options";
  let augmentContent = `
    <p>${BOLD_SPAN_START}Augment:${BOLD_SPAN_END} Concentration. Select one character you are engaged with. If the check succeeds, until the end of your character's next turn, the target increases the ability of any skill checks thay make by one.</p>
    <form style="padding:5px">
      <p style="font-weight:bold">Add up to ${
        5 - baseDifficulty
      } more difficulty dice:</p>
      <div class="form-group">
        <input type="checkbox" name="divineHealth">
        <label for="divineHealth" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Divine Health${BOLD_SPAN_END}: The target increases their wound threshold by a value equal to the character's ranks in Knowledge for the duration of the spell.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="haste">
        <label for="haste" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Haste${BOLD_SPAN_END}: Targets affected by the spell can always perform a second maneuver during their turn without spending strain (they may still only perform two maneuvers a turn).</label>
      </div>
      <div class="form-group">
        <input type="number" name="range" value="0" min="0" max="5" style="flex:0.08;">
        <label for="range" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Range${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["range"]
  }</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="swift">
        <label for="swift" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Swift${BOLD_SPAN_END}: Targets affected by the spell ignore the effects of difficult terrain and cannot be immobilized.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="addTarget">
        <label for="addTarget" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Addition Target${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["addTarget"]
  }</label>
      </div>
    </form>
    `;
  let augmentCallback = (html) => {
    const formData = new FormDataExtended(html[0].querySelector("form")).object;
    let divineHealth = 0;
    let haste = 0;
    let range = 0;
    let swift = 0;
    let addTarget = 0;

    let rangeBand = "engaged";

    let flavorTextAddons = [];
    let effectsList = [];

    if (formData.divineHealth) {
      divineHealth = 1;
      flavorTextAddons.push("divine health");
      effectsList.push(
        `${BOLD_SPAN_START}Divine Health:${BOLD_SPAN_END} Target increases wound threshold by ${casterActor.system.skills["Knowledge"].rank}`
      );
    }

    if (formData.haste) {
      haste = 1;
      flavorTextAddons.push("haste");
      effectsList.push(
        `${BOLD_SPAN_START}Haste:${BOLD_SPAN_END} Target can perform second maneuver without spending strain`
      );
    }

    if (formData.range) {
      range = formData.range;
      switch (range) {
        case 1:
          rangeBand = "short";
          break;
        case 2:
          rangeBand = "medium";
          break;
        case 3:
          rangeBand = "long";
          break;
        case 4:
          rangeBand = "extreme";
          break;
      }

      flavorTextAddons.push("range");
      effectsList.push(
        `${BOLD_SPAN_START}Range:${BOLD_SPAN_END} Increase maximum range`
      );
    }

    if (formData.swift) {
      swift = 1;
      flavorTextAddons.push("swift");
      effectsList.push(
        `${BOLD_SPAN_START}Swift:${BOLD_SPAN_END} Target ignores difficult terrain and cannot be immobilized`
      );
    }

    if (formData.addTarget) {
      addTarget = 2;
      flavorTextAddons.push("additional target");
      effectsList.push(
        `${BOLD_SPAN_START}Additional Target:${BOLD_SPAN_END} Add 1 + spent ${ADVANTAGE_ICON} additional targets`
      );
    }

    let difficultyMod = divineHealth + haste + range + swift + addTarget;
    let totalDifficulty = baseDifficulty + difficultyMod;

    if (totalDifficulty > 5) {
      ui.notifications.warn(
        "You added too many modifiers! The total difficulty of the roll cannot exceed 5..."
      );
      return;
    } else {
      if (!ignoreStrain) increaseStrain(focusLevel);

      ChatMessage.create({
        content: getAugmentMessageContent(rangeBand, effectsList),
        speaker: casterSpeaker,
      });

      let flavorText = buildFlavorText("augment", flavorTextAddons);
      createRoll(
        totalDifficulty,
        difficultyUpgradeCount,
        setbackCount,
        focusLevel,
        flavorText
      );
    }
  };

  renderSpellTypeDialog(augmentTitle, augmentContent, augmentCallback);
}

/**
 * Creates the items needed for a dialog showing the enhancements availble for a barrier spell. Calls
 *   {@link renderSpellTypeDialog} to render the actual dialog.
 *
 * @param {number} baseDifficulty - the base difficult of the roll. Should be between 0 and 5
 * @param {number} difficultyUpgradeCount - The number of difficulty upgrades to apply
 * @param {number} setbackCount - The number of setback dice to add
 * @param {number} focusLevel - The number of times Mental Focus was used
 * @param {boolean} ignoreStrain - If true, skip the automatic strain application to the caster
 */
function renderBarrierDialog(
  baseDifficulty,
  difficultyUpgradeCount,
  setbackCount,
  focusLevel,
  ignoreStrain
) {
  let barrierTitle = "Barrier Options";
  let barrierContent = `
    <p>${BOLD_SPAN_START}Barrier:${BOLD_SPAN_END} Concentration. Select one target you are engaged with (which can be yourself). If the check succeeds, until the end of the character's next turn, reduce the damage of all hits the target suffers by one, and further reduce it by one for every uncanceled ${SUCCESS_ICON}${SUCCESS_ICON} beyond the first.</p>
    <form style="padding:5px">
      <p style="font-weight:bold">Add up to ${
        5 - baseDifficulty
      } more difficulty dice:</p>
      <div class="form-group">
        <input type="checkbox" name="addTarget">
        <label for="addTarget" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Additional Target${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["addTarget"]
  }</label>
      </div>
      <div class="form-group">
        <input type="number" name="range" value="0" min="0" max="5" style="flex:0.08;">
        <label for="range" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Range${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["range"]
  }</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="addDef">
        <label for="addDef" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Add Defense${BOLD_SPAN_END}: Each affected target gains ranged and melee defense equal to your ranks in Knowledge.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="empowered">
        <label for="empowered" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Empowered${BOLD_SPAN_END}: The varrier reduces damage equal to the number of uncanceled ${SUCCESS_ICON} instead of the normal effect.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="sanctuary">
        <label for="sanctuary" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Sanctuary${BOLD_SPAN_END}: Opponents the GM determines are the antithesis of the character's faith or deity automatically disengage from affected targets, and may not engage them for the duration of the spell.</label>
      </div>
    </form>
    `;
  let barrierCallback = (html) => {
    const formData = new FormDataExtended(html[0].querySelector("form")).object;
    let addDef = 0;
    let empowered = 0;
    let range = 0;
    let sanctuary = 0;
    let addTarget = 0;

    let rangeBand = "engaged";

    let flavorTextAddons = [];
    let effectsList = [];

    if (formData.addTarget) {
      addTarget = 1;
      flavorTextAddons.push("additional target");
      effectsList.push(
        `${BOLD_SPAN_START}Additional Target:${BOLD_SPAN_END} Add 1 + spent ${ADVANTAGE_ICON} additional targets`
      );
    }

    if (formData.range) {
      range = formData.range;
      switch (range) {
        case 1:
          rangeBand = "short";
          break;
        case 2:
          rangeBand = "medium";
          break;
        case 3:
          rangeBand = "long";
          break;
        case 4:
          rangeBand = "extreme";
          break;
      }

      flavorTextAddons.push("range");
      effectsList.push(
        `${BOLD_SPAN_START}Range:${BOLD_SPAN_END} Increase maximum range`
      );
    }

    if (formData.addDef) {
      addDef = 2;
      flavorTextAddons.push("add defense");
      effectsList.push(
        `${BOLD_SPAN_START}Add Defense:${BOLD_SPAN_END} Target gains ${casterActor.system.skills["Knowledge"].rank} ranged and melee defense`
      );
    }

    if (formData.empowered) {
      empowered = 2;
      flavorTextAddons.push("empowered");
      effectsList.push(
        `${BOLD_SPAN_START}Empowered:${BOLD_SPAN_END} Barrier reduces damage equal to uncanceled ${SUCCESS_ICON} instead of normal effect`
      );
    }

    if (formData.sanctuary) {
      sanctuary = 2;
      flavorTextAddons.push("sanctuary");
      effectsList.push(
        `${BOLD_SPAN_START}Sanctuary:${BOLD_SPAN_END} Antithesis enemeis disengage target and cannot engage again`
      );
    }

    let difficultyMod = addDef + empowered + range + sanctuary + addTarget;
    let totalDifficulty = baseDifficulty + difficultyMod;

    if (totalDifficulty > 5) {
      ui.notifications.warn(
        "You added too many modifiers! The total difficulty of the roll cannot exceed 5..."
      );
      return;
    } else {
      if (!ignoreStrain) increaseStrain(focusLevel);

      ChatMessage.create({
        content: getBarrierMessageContent(rangeBand, effectsList),
        speaker: casterSpeaker,
      });

      let flavorText = buildFlavorText("barrier", flavorTextAddons);
      createRoll(
        totalDifficulty,
        difficultyUpgradeCount,
        setbackCount,
        focusLevel,
        flavorText
      );
    }
  };

  renderSpellTypeDialog(barrierTitle, barrierContent, barrierCallback);
}

/**
 * Creates the items needed for a dialog showing the enhancements availble for a curse spell. Calls
 *   {@link renderSpellTypeDialog} to render the actual dialog.
 *
 * @param {number} baseDifficulty - the base difficult of the roll. Should be between 0 and 5
 * @param {number} difficultyUpgradeCount - The number of difficulty upgrades to apply
 * @param {number} setbackCount - The number of setback dice to add
 * @param {number} focusLevel - The number of times Mental Focus was used
 * @param {boolean} ignoreStrain - If true, skip the automatic strain application to the caster
 */
function renderCurseDialog(
  baseDifficulty,
  difficultyUpgradeCount,
  setbackCount,
  focusLevel,
  ignoreStrain
) {
  let curseTitle = "Curse Options";
  let curseContent = `
    <p>${BOLD_SPAN_START}Curse:${BOLD_SPAN_END} Concentration. Select one target within short range. If the check succeeds, the target decreases the ability of any skill checks they make by one.</p>
    <form style="padding:5px">
      <p style="font-weight:bold">Add up to ${
        5 - baseDifficulty
      } more difficulty dice:</p>
      <div class="form-group">
        <input type="checkbox" name="enervate">
        <label for="enervate" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Enervate${BOLD_SPAN_END}: If a target suffers strain for any reason, they suffer 1 additional strain.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="misfortune">
        <label for="misfortune" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Misfortune${BOLD_SPAN_END}: After the target makes a check, you may change one ${SETBACK_DIE_ICON} to a face displaying a ${FAILURE_ICON}.</label>
      </div>
      <div class="form-group">
        <input type="number" name="range" value="0" min="0" max="5" style="flex:0.08;">
        <label for="range" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Range${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["range"]
  }</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="addTarget">
        <label for="addTarget" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Additional Target${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["addTarget"]
  }</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="despair">
        <label for="despair" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Despair${BOLD_SPAN_END}: The target's strain and wound thresholds are reduced by an amount equal to the character's ranks in Knowledge. This effect may not be combined with the additional target effect.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="paralyzed">
        <label for="paralyzed" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Paralyzed${BOLD_SPAN_END}: The target is staggered for the duration of the spell. This affect may not be combined with the additional target effect.</label>
      </div>
    </form>
    `;
  let curseCallback = (html) => {
    const formData = new FormDataExtended(html[0].querySelector("form")).object;
    let range = 0;
    let addTarget = 0;
    let enervate = 0;
    let misfortune = 0;
    let despair = 0;
    let paralyzed = 0;

    let rangeBand = "short";

    let flavorTextAddons = [];
    let effectsList = [];

    if (formData.enervate) {
      enervate = 1;
      flavorTextAddons.push("enervate");
      effectsList.push(
        `${BOLD_SPAN_START}Enervate:${BOLD_SPAN_END} Whenever target suffers strain, they suffer 1 more`
      );
    }

    if (formData.misfortune) {
      misfortune = 1;
      flavorTextAddons.push("misfortune");
      effectsList.push(
        `${BOLD_SPAN_START}Misfortune:${BOLD_SPAN_END} After target makes a check, caster may change one ${SETBACK_DIE_ICON} to a face with a ${FAILURE_ICON}`
      );
    }

    if (formData.range) {
      range = formData.range;
      switch (range) {
        case 1:
          rangeBand = "medium";
          break;
        case 2:
          rangeBand = "long";
          break;
        case 3:
          rangeBand = "extreme";
          break;
      }

      flavorTextAddons.push("range");
      effectsList.push(
        `${BOLD_SPAN_START}Range:${BOLD_SPAN_END} Increase maximum range`
      );
    }

    if (formData.addTarget) {
      addTarget = 2;
      flavorTextAddons.push("additional target");
      effectsList.push(
        `${BOLD_SPAN_START}Additional Target:${BOLD_SPAN_END} Add 1 + spent ${ADVANTAGE_ICON} additional targets`
      );
    }

    if (formData.despair) {
      despair = 2;
      flavorTextAddons.push("despair");
      effectsList.push(
        `${BOLD_SPAN_START}Despair:${BOLD_SPAN_END} Target's wound and strain thresholds are reduced by ${casterActor.system.skills["Knowledge"].rank}`
      );
    }

    if (formData.paralyzed) {
      paralyzed = 3;
      flavorTextAddons.push("paralyzed");
      effectsList.push(
        `${BOLD_SPAN_START}Paralyzed:${BOLD_SPAN_END} Target is staggered for duration of the spell`
      );
    }

    let difficultyMod =
      enervate + misfortune + range + despair + addTarget + paralyzed;
    let totalDifficulty = baseDifficulty + difficultyMod;

    if (totalDifficulty > 5) {
      ui.notifications.warn(
        "You added too many modifiers! The total difficulty of the roll cannot exceed 5..."
      );
      return;
    } else {
      if (!ignoreStrain) increaseStrain(focusLevel);

      ChatMessage.create({
        content: getCurseMessageContent(rangeBand, effectsList),
        speaker: casterSpeaker,
      });

      let flavorText = buildFlavorText("curse", flavorTextAddons);
      createRoll(
        totalDifficulty,
        difficultyUpgradeCount,
        setbackCount,
        focusLevel,
        flavorText
      );
    }
  };

  renderSpellTypeDialog(curseTitle, curseContent, curseCallback);
}

/**
 * Creates the items needed for a dialog showing the enhancements availble for a heal spell. Calls
 *   {@link renderSpellTypeDialog} to render the actual dialog.
 *
 * @param {number} baseDifficulty - the base difficult of the roll. Should be between 0 and 5
 * @param {number} difficultyUpgradeCount - The number of difficulty upgrades to apply
 * @param {number} setbackCount - The number of setback dice to add
 * @param {number} focusLevel - The number of times Mental Focus was used
 * @param {boolean} ignoreStrain - If true, skip the automatic strain application to the caster
 */
function renderHealDialog(
  baseDifficulty,
  difficultyUpgradeCount,
  setbackCount,
  focusLevel,
  ignoreStrain
) {
  let healTitle = "Heal Options";
  let healContent = `
    <p>${BOLD_SPAN_START}Heal:${BOLD_SPAN_END} Select one target you are engaged with who is not incapacitated. Upon success, the character heals 1 wound per uncanceled ${SUCCESS_ICON}, and 1 strain per uncanceled ${ADVANTAGE_ICON}.</p>
    <form style="padding:5px">
      <p style="font-weight:bold">Add up to ${
        5 - baseDifficulty
      } more difficulty dice:</p>
      <div class="form-group">
        <input type="checkbox" name="addTarget">
        <label for="addTarget" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Additional Target${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["addTarget"]
  }</label>
      </div>
      <div class="form-group">
        <input type="number" name="range" value="0" min="0" max="5" style="flex:0.08;">
        <label for="range" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Range${BOLD_SPAN_END}: ${
    EFFECT_DESCRIPTIONS["range"]
  }</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="restore">
        <label for="restore" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}) Restoration${BOLD_SPAN_END}: Select one ongoing status effect the target is suffering. This status effect immediately ends.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="healCrit">
        <label for="healCrit" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Heal Critical${BOLD_SPAN_END}: Select one Critical Injury the target is suffering. If the spell is successful, the Critical Injury is also healed.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="reviveIncap">
        <label for="reviveIncap" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Revive Incapacitated${BOLD_SPAN_END}: The character may select targets who are incapacitated.</label>
      </div>
      <div class="form-group">
        <input type="checkbox" name="resurrect">
        <label for="resurrect" style="padding-left:10px">${BOLD_SPAN_START}(${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON}) Resurrection${BOLD_SPAN_END}: The character may select a target who has died during this encounter. If the check is successful, the target is restored to life, suffering wounds equal to their wound threshold. If the check fails, no characters may attempt to resurrect the target again.</label>
      </div>
    </form>
    `;
  let healCallback = (html) => {
    const formData = new FormDataExtended(html[0].querySelector("form")).object;
    let range = 0;
    let addTarget = 0;
    let restore = 0;
    let healCrit = 0;
    let reviveIncap = 0;
    let resurrect = 0;

    let rangeBand = "engaged";

    let flavorTextAddons = [];
    let effectsList = [];

    if (formData.addTarget) {
      addTarget = 1;
      flavorTextAddons.push("additional target");
      effectsList.push(
        `${BOLD_SPAN_START}Additional Target:${BOLD_SPAN_END} Add 1 + spent ${ADVANTAGE_ICON} additional targets`
      );
    }

    if (formData.range) {
      range = formData.range;
      switch (range) {
        case 1:
          rangeBand = "short";
          break;
        case 2:
          rangeBand = "medium";
          break;
        case 3:
          rangeBand = "long";
          break;
        case 4:
          rangeBand = "extreme";
          break;
      }

      flavorTextAddons.push("range");
      effectsList.push(
        `${BOLD_SPAN_START}Range:${BOLD_SPAN_END} Increase maximum range`
      );
    }

    if (formData.restore) {
      restore = 1;
      flavorTextAddons.push("restoration");
      effectsList.push(
        `${BOLD_SPAN_START}Restoration:${BOLD_SPAN_END} End one status effect on the target`
      );
    }

    if (formData.healCrit) {
      healCrit = 2;
      flavorTextAddons.push("heal critical");
      effectsList.push(
        `${BOLD_SPAN_START}Heal Critical:${BOLD_SPAN_END} Heal one critical injury on the target if check successful`
      );
    }

    if (formData.reviveIncap) {
      reviveIncap = 2;
      flavorTextAddons.push("revive incapacitated");
      effectsList.push(
        `${BOLD_SPAN_START}Revive Incapacitated:${BOLD_SPAN_END} Caster may select incapacitated targets`
      );
    }

    if (formData.resurrect) {
      resurrect = 4;
      flavorTextAddons.push("resurrection");
      effectsList.push(
        `${BOLD_SPAN_START}Resurrection:${BOLD_SPAN_END} Caster may select a target who died during this encounter`
      );
    }

    let difficultyMod =
      restore + healCrit + range + reviveIncap + addTarget + resurrect;
    let totalDifficulty = baseDifficulty + difficultyMod;

    if (totalDifficulty > 5) {
      ui.notifications.warn(
        "You added too many modifiers! The total difficulty of the roll cannot exceed 5..."
      );
      return;
    } else {
      if (!ignoreStrain) increaseStrain(focusLevel);

      ChatMessage.create({
        content: getHealMessageContent(rangeBand, effectsList),
        speaker: casterSpeaker,
      });

      let flavorText = buildFlavorText("heal", flavorTextAddons);
      createRoll(
        totalDifficulty,
        difficultyUpgradeCount,
        setbackCount,
        focusLevel,
        flavorText
      );
    }
  };

  renderSpellTypeDialog(healTitle, healContent, healCallback);
}

/**
 * Creates the items needed for a dialog showing the enhancements availble for a utility spell. Calls
 *   {@link renderSpellTypeDialog} to render the actual dialog.
 *
 * Unlike the other spell types, there are no predefined options for this kind of spell. Instead, the dialog content
 *   is just a text field to get the description
 *
 * @param {number} baseDifficulty - the base difficult of the roll. Should be between 0 and 5
 * @param {number} difficultyUpgradeCount - The number of difficulty upgrades to apply
 * @param {number} setbackCount - The number of setback dice to add
 * @param {number} focusLevel - The number of times Mental Focus was used
 * @param {boolean} ignoreStrain - If true, skip the automatic strain application to the caster
 */
function renderUtilityDialog(
  baseDifficulty,
  difficultyUpgradeCount,
  setbackCount,
  focusLevel,
  ignoreStrain
) {
  let utilityTitle = "Utility Options";
  let utilityContent = `
    <p>${BOLD_SPAN_START}Utility:${BOLD_SPAN_END} Utility magic covers all the minor benefits not encapsulated in the other actions. The difficulty should always be Easy (${DIFFICULTY_DIE_ICON}). If that seems to easy for what you want to accomplish, it is likely beyond the scope of utility magic!</p>
    <form style="padding:5px">
      <label for="effect">What would you like the spell to do?</label><br>
      <input type="text" name="effect">
    </form>
    `;
  let utilityCallback = (html) => {
    const formData = new FormDataExtended(html[0].querySelector("form")).object;
    let spellEffect = formData.effect;

    flavorText = casterActor.name + " casts a utility spell to " + spellEffect;

    if (!ignoreStrain) increaseStrain(focusLevel);

    ChatMessage.create({
      content: getUtilityMessageContent(spellEffect),
      speaker: casterSpeaker,
    });

    createRoll(
      baseDifficulty,
      difficultyUpgradeCount,
      setbackCount,
      focusLevel,
      flavorText
    );
  };

  renderSpellTypeDialog(utilityTitle, utilityContent, utilityCallback);
}

/**
 * This callback function is called by the spell type dialog to cast the spell. The callback should handle reading
 *   any form content from the dialog, outputting any chat messages, updating any character stats, and generating the
 *   dice pool for the casting.
 *
 * @callback SpellDialogSubmitCallback
 * @param {HTMLElement} - The html content of the dialog that was just submitted
 */

/**
 * Renders a dialog to cast a specific type of spell given a title, content, and submit button callback.
 * The rendered dialog has a submit button labeled "Cast!" and a cancel button. The dialog is rendered with a width
 *  of 600 pixels.
 *
 * This method is called by {@link renderAttackDialog}, {@link renderAugmentDialog}, {@link renderBarrierDialog},
 *  {@link renderCurseDialog}, {@link renderHealDialog}, and {@link renderUtilityDialog} to render the relevant dialog.
 *
 * @param {string} dialogTitle - The title of the dialog window.
 * @param {string} dialogContent - The main content of the dialog, created as HTML. This should be a form to collect any
 *   user options for the spell.
 * @param {SpellDialogSubmitCallback} submitCallback - The callback function called by the submit button, which performs
 *   any needed actions to cast a spell. Should accept one argument "html", the html content of the dialog, that is
 *   used to get the user input from the form in dialogContent.
 */
function renderSpellTypeDialog(dialogTitle, dialogContent, submitCallback) {
  const dialog = new Dialog({
    title: dialogTitle,
    content: dialogContent,
    buttons: {
      submit: {
        label: "Cast!",
        icon: "<i class='fa-solid fa-hand-sparkles'></i>",
        callback: submitCallback,
      },
      cancel: {
        label: "Cancel",
        icon: "<i class='fa-solid fa-xmark'></i>",
        callback: () => {
          return;
        },
      },
    },
  });

  dialog.render(true, { width: 600 });
}

const magicDialog = new Dialog({
  title: "Cast Magic",
  content: `
<form style="padding:5px">
  <p style="font-weight:bold">Which type of effect would you like to produce:</p>
  <div class="form-group">
    <label for="effectType">Effect Type: </label>
    <select name="effectType">
      <option value="attack">Attack (${DIFFICULTY_DIE_ICON})</option>
      <option value="augment">Augment (${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON})</option>
      <option value="barrier">Barrier (${DIFFICULTY_DIE_ICON})</option>
      <option value="curse">Curse (${DIFFICULTY_DIE_ICON}${DIFFICULTY_DIE_ICON})</option>
      <option value="heal">Heal (${DIFFICULTY_DIE_ICON})</option>
      <option value="utility">Utility (${DIFFICULTY_DIE_ICON})</option>
    </select>
  </div>
  <br><div class="form-group">
    <label for="focus">Mental Focus (0-${casterActor.system.skills["Divine"].rank}): </label>
    <input type="number" name="focus" value="0">
  </div>
  <br><p style="font-weight:bold">Add casting penalties:</p>
  <div class="form-group">
    <input type="checkbox" name="freeHandPenalty">
    <label for="freeHandPenalty">No free hand (${SETBACK_DIE_ICON})</label>
  </div>
  <div class="form-group">
    <input type="checkbox" name="cantSpeak">
    <label for="cantSpeak">Unable to speak (${SETBACK_DIE_ICON}${SETBACK_DIE_ICON})</label>
  </div>
  <div class="form-group">
    <input type="checkbox" name="heavyArmor">
    <label for="heavyArmor">Wearing heavy armor (${SETBACK_DIE_ICON})</label>
  </div>
  <div class="form-group">
    <input type="checkbox" name="interference">
    <label for="interference">Interfering circumstances</label>
  </div><br>
  <p style="font-weight:bold">Overrides:</p>
  <div class="form-group">
    <input type="checkbox" name="ignoreStrain">
    <label for="ignoreStrain">Ignore Strain Increase</label>
  </div>
</form> 
<br>`,
  buttons: {
    submit: {
      label: "Choose",
      icon: "<i class='fa-solid fa-check'></i>",
      callback: (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;
        const effectType = formData.effectType;
        const freeHandPenalty = formData.freeHandPenalty;
        const cantSpeak = formData.cantSpeak;
        const heavyArmor = formData.heavyArmor;
        const interference = formData.interference;
        const ignoreStrain = formData.ignoreStrain;
        const focusLevel = formData.focus;

        if (
          focusLevel < 0 ||
          focusLevel > casterActor.system.skills["Divine"].rank
        ) {
          ui.notifications.warn(
            `Mental Focus requires a value between 0 and ${casterActor.system.skills["Divine"].rank}...`
          );
          return;
        }

        let setbackCount = 0;
        let difficultyUpgradeCount = 0;
        let baseDifficulty = 0;

        if (freeHandPenalty) {
          setbackCount += 1;
        }

        if (cantSpeak) {
          setbackCount += 2;
        }

        if (heavyArmor) {
          setbackCount += 1;
        }

        if (interference) {
          difficultyUpgradeCount += 1;
        }

        if (effectType == "attack") {
          renderAttackDialog(
            1,
            difficultyUpgradeCount,
            setbackCount,
            focusLevel,
            ignoreStrain
          );
        } else if (effectType == "augment") {
          renderAugmentDialog(
            2,
            difficultyUpgradeCount,
            setbackCount,
            focusLevel,
            ignoreStrain
          );
        } else if (effectType == "barrier") {
          renderBarrierDialog(
            1,
            difficultyUpgradeCount,
            setbackCount,
            focusLevel,
            ignoreStrain
          );
        } else if (effectType == "curse") {
          renderCurseDialog(
            2,
            difficultyUpgradeCount,
            setbackCount,
            focusLevel,
            ignoreStrain
          );
        } else if (effectType == "heal") {
          renderHealDialog(1, difficultyUpgradeCount, setbackCount, focusLevel);
        } else if (effectType == "utility") {
          renderUtilityDialog(
            1,
            setbackCount,
            difficultyUpgradeCount,
            focusLevel,
            ignoreStrain
          );
        }
      },
    },
    cancel: {
      label: "Cancel",
      icon: "<i class='fa-solid fa-xmark'></i>",
      callback: () => {
        return;
      },
    },
  },
});

// #endregion

// #region automation

/**
 * Add strain to the caster of the spell.
 *
 * All spells add a base level of 2 strain to the caster. Extra strain can be added as needed using the parameter.
 *
 * @param {number} extraStrain - any extra strain beyond the default amount of 2
 */
function increaseStrain(extraStrain = 0) {
  casterActor.update({
    system: {
      stats: {
        strain: {
          value: casterActor.system.stats.strain.value + 2 + extraStrain,
        },
      },
    },
  });
}

// #endregion

// #region casting messages

/**
 * Generate the content for an attack spell chat message
 *
 * @param {*} rangeBand - The maximum range band the spell can target
 * @param {Array<string>} effectsList - An array of added effect descriptions as string. Each one will be wrapped in
 *   html <p> tags and added to the output. {@link getMessageEffectsList} is used to concatenate the list.
 *
 * @returns {string} the content for the attack chat message
 */
function getAttackMessageContent(rangeBand, effectsList) {
  let messageContent = ``;

  let article =
    "a" + (rangeBand === "extreme" || rangeBand === "engaged" ? "n" : "");

  messageContent += `<p>${BOLD_SPAN_START}${casterActor.name}${BOLD_SPAN_END} is casting ${article} ${BOLD_SPAN_START}${rangeBand} ranged attack${BOLD_SPAN_END} spell at ${BOLD_SPAN_START}${spellTarget.name}${BOLD_SPAN_END}!</p><p>The attack will deal ${BOLD_SPAN_START}${casterActor.system.characteristics["Willpower"].value} + 1/[SU]${BOLD_SPAN_END} damage</p>`;
  messageContent += getMessageEffectsList(effectsList);

  return messageContent;
}

/**
 * Generate the content for an augment spell chat message
 *
 * @param {*} rangeBand - The maximum range band the spell can target
 * @param {Array<string>} effectsList - An array of added effect descriptions as string. Each one will be wrapped in
 *   html <p> tags and added to the output. {@link getMessageEffectsList} is used to concatenate the list.
 *
 * @returns {string} the content for the augment chat message
 */
function getAugmentMessageContent(rangeBand, effectsList) {
  let messageContent = ``;

  let article =
    "a" + (rangeBand === "extreme" || rangeBand === "engaged" ? "n" : "");

  messageContent += `<p>${BOLD_SPAN_START}${casterActor.name}${BOLD_SPAN_END} is casting ${article} ${BOLD_SPAN_START}${rangeBand} ranged attack${BOLD_SPAN_END} spell at ${BOLD_SPAN_START}${spellTarget.name}${BOLD_SPAN_END}!</p><p>The targets adds ${ABILITY_DIE_ICON} to all skill checks until the end of ${casterActor.name}'s next turn</p><p><em>Concentration</em></p>`;
  messageContent += getMessageEffectsList(effectsList);

  return messageContent;
}

/**
 * Generate the content for an barrier spell chat message
 *
 * @param {*} rangeBand - The maximum range band the spell can target
 * @param {Array<string>} effectsList - An array of added effect descriptions as string. Each one will be wrapped in
 *   html <p> tags and added to the output. {@link getMessageEffectsList} is used to concatenate the list.
 *
 * @returns {string} the content for the barrier chat message
 */
function getBarrierMessageContent(rangeBand, effectsList) {
  let messageContent = ``;

  let article =
    "a" + (rangeBand === "extreme" || rangeBand === "engaged" ? "n" : "");

  messageContent += `<p>${BOLD_SPAN_START}${casterActor.name}${BOLD_SPAN_END} is casting ${article} ${BOLD_SPAN_START}${rangeBand} ranged barrier${BOLD_SPAN_END} spell at ${BOLD_SPAN_START}${spellTarget.name}${BOLD_SPAN_END}!</p><p>The target reduces all damage by ${BOLD_SPAN_START}1 + 1/${SUCCESS_ICON}${SUCCESS_ICON}${BOLD_SPAN_END} until the end of ${casterActor.name}'s next turn</p><p><em>Concentration</em></p>`;
  messageContent += getMessageEffectsList(effectsList);

  return messageContent;
}

/**
 * Generate the content for an curse spell chat message
 *
 * @param {*} rangeBand - The maximum range band the spell can target
 * @param {Array<string>} effectsList - An array of added effect descriptions as string. Each one will be wrapped in
 *   html <p> tags and added to the output. {@link getMessageEffectsList} is used to concatenate the list.
 *
 * @returns {string} the content for the curse chat message
 */
function getCurseMessageContent(rangeBand, effectsList) {
  let messageContent = ``;

  let article =
    "a" + (rangeBand === "extreme" || rangeBand === "engaged" ? "n" : "");

  messageContent += `<p>${BOLD_SPAN_START}${casterActor.name}${BOLD_SPAN_END} is casting ${article} ${BOLD_SPAN_START}${rangeBand} ranged curse${BOLD_SPAN_END} spell at ${BOLD_SPAN_START}${spellTarget.name}${BOLD_SPAN_END}!</p><p>The target subtracts ${ABILITY_DIE_ICON} from all skill checks until the end of ${casterActor.name}'s next turn.</p><p><em>Concentration</em></p>`;
  messageContent += getMessageEffectsList(effectsList);

  return messageContent;
}

/**
 * Generate the content for an heal spell chat message
 *
 * @param {*} rangeBand - The maximum range band the spell can target
 * @param {Array<string>} effectsList - An array of added effect descriptions as string. Each one will be wrapped in
 *   html <p> tags and added to the output. {@link getMessageEffectsList} is used to concatenate the list.
 *
 * @returns {string} the content for the heal chat message
 */
function getHealMessageContent(rangeBand, effectsList) {
  let messageContent = ``;

  let article =
    "a" + (rangeBand === "extreme" || rangeBand === "engaged" ? "n" : "");

  messageContent += `<p>${BOLD_SPAN_START}${casterActor.name}${BOLD_SPAN_END} is casting ${article} ${BOLD_SPAN_START}${rangeBand} ranged heal${BOLD_SPAN_END} spell at ${BOLD_SPAN_START}${spellTarget.name}${BOLD_SPAN_END}!</p><p>The target will heal ${BOLD_SPAN_START}1/${SUCCESS_ICON} wounds${BOLD_SPAN_END} and ${BOLD_SPAN_START}1/${ADVANTAGE_ICON} strain${BOLD_SPAN_END}.</p>`;
  messageContent += getMessageEffectsList(effectsList);

  return messageContent;
}

/**
 * Generate the content for an utility spell chat message
 *
 * @param {*} rangeBand - The maximum range band the spell can target
 * @param {string} effect - The effect of the utility spell
 *
 * @returns {string} the content for the utility chat message
 */
function getUtilityMessageContent(effect) {
  let messageContent = ``;

  messageContent += `<p>${BOLD_SPAN_START}${casterActor.name}${BOLD_SPAN_END} is casting a utility spell!</p><p>The spell will ${BOLD_SPAN_START}${effect}${BOLD_SPAN_END}</p>`;

  return messageContent;
}

/**
 * Creates a single html string from an array of strings. Each entry of the array should be a single effect that was
 *   added to a spell. Each of the entries is then wrapped with html <p> tags and added to a single string, along with
 *   an initial line to identify the following lines as extra effects, which is then returned.
 *
 * @param {Array<string>} effectsList - An array of strings for each effect added to a spell
 *
 * @returns {string} A single html string containing all of the added effects to a spell
 */
function getMessageEffectsList(effectsList) {
  if (effectsList.length === 0) {
    return "";
  }

  let messageEffectsList = `<br><p>The spell has these extra effects:</p>`;

  effectsList.forEach((effect) => {
    messageEffectsList += `<p>${effect}</p>`;
  });

  return messageEffectsList;
}

// #endregion

// #region rolling
/**
 * Creates a dice pool for the spell being cast and renders the window.
 *
 * @param {number} magicDifficulty - The difficulty of the check
 * @param {number} magicDifficultyUpgrades - The number of difficulty upgrades to appply
 * @param {number} magicSetbackDice - The number of setback dice to add
 * @param {number} magicBoostDice - The number of boost dice to add
 * @param {string} flavorText - The flavor text to add to the dice pool chat message
 */
function createRoll(
  magicDifficulty,
  magicDifficultyUpgrades,
  magicSetbackDice,
  magicBoostDice,
  flavorText
) {
  const skill = casterActor.system.skills["Divine"];
  const characteristic =
    casterActor.system.characteristics[skill.characteristic];

  let dicePool = new DicePoolFFG({
    ability: Math.max(characteristic.value, skill.rank),
    boost: skill.boost + magicBoostDice,
    setback: skill.setback + magicSetbackDice,
    force: skill.force,
    advantage: skill.advantage,
    dark: skill.dark,
    light: skill.light,
    failure: skill.failure,
    threat: skill.threat,
    success: skill.success,
    triumph: skill.triumph,
    despair: skill.despair,
    upgrades: skill.upgrades,
    remsetback: skill?.remsetback ? skill.remsetback : 0,
    difficulty: magicDifficulty, // default to average difficulty
  });

  while (dicePool.remsetback > 0 && dicePool.setback > 0) {
    dicePool.remsetback -= 1;
    dicePool.setback -= 1;
  }

  dicePool.upgrade(
    Math.min(characteristic.value, skill.rank) + dicePool.upgrades
  );

  dicePool.upgradeDifficulty(magicDifficultyUpgrades);

  new game.ffg.RollBuilderFFG(
    casterActor.sheet,
    dicePool,
    "",
    skill.label,
    null,
    flavorText,
    null
  ).render(true);
}

/**
 * Create the final flavor text for a dice pool given the spell type and a list of enhancement names
 *
 * @param {string} spellType - the type of spell being cast, like "attack" or "barrier"
 * @param {Array<string>} flavorTextAddons - An array of enhancements being added to the spell, like "range", "ice", or
 *   "additional targets"
 *
 * @returns {string} - The flavor text string
 */
function buildFlavorText(spellType, flavorTextAddons) {
  const charName = casterActor.name;
  const numOfAddons = flavorTextAddons.length;

  let article = "a";

  if (spellType === "attack" || spellType === "augment") {
    article = "an";
  }

  let flavorText = charName + " casts " + article + " " + spellType + " spell";

  if (numOfAddons === 0) {
    return flavorText;
  }

  flavorText += " with the ";

  for (let index = 0; index < numOfAddons; index++) {
    if (index === numOfAddons - 1 && index !== 0) {
      flavorText += "and ";
    }

    flavorText += flavorTextAddons[index];

    if (numOfAddons > 2 && index !== numOfAddons - 1) {
      flavorText += ",";
    }

    flavorText += " ";
  }

  flavorText += "augment";

  if (flavorTextAddons.length > 1) {
    flavorText += "s";
  }

  return flavorText;
}

// #endregion

magicDialog.render(true);
