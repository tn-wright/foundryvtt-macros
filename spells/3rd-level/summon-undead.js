const casterActor = item.actor;
const casterToken = casterActor.getActiveTokens()[0];
const spellLevel = casterActor.system.spells.pact.level;

console.log(item);

const ghostlySpirit = "Actor.iT1w54DN1ha1jZTB";
const putridSpirit = "Actor.NbHbnsjcJmjvFWDr";
const skeletalSpirit = "Actor.WRw92zQXOT8YJpqK";

let summonUuid;
let summonHp;
let summonAttackName;
let summonAttackDamage;

await Dialog.wait({
  title: "Summon Undead",
  content: `
    <form>
        <div class="form-group">
            <label for="undead">Undead Type</label>
            <select name="undead" id="undead">
                <option value="ghostly">Ghostly Spirit</option>
                <option value="putrid">Putrid Spirit</option>
                <option value="skeletal">Skeletal Spirit</option>
            </select>
        </div>
    </form>
    `,
  buttons: {
    confirm: {
      icon: "",
      label: "Summon",
      callback: (html) => {
        const formData = new FormDataExtended(html[0].querySelector("form"))
          .object;
        const undeadType = formData.undead;

        if (undeadType === "putrid") {
          summonUuid = putridSpirit;
          summonHp = 30;
          summonAttackName = "Rotting Claw";
          summonAttackDamage = [
            `1d6[slashing] + 3 + ${spellLevel}`,
            "slashing",
          ];
        } else if (undeadType === "skeletal") {
          summonUuid = skeletalSpirit;
          summonHp = 20;
          summonAttackName = "Grave Bolt";
          summonAttackDamage = [
            `2d4[necrotic] + 3 + ${spellLevel}`,
            "necrotic",
          ];
        } else {
          summonUuid = ghostlySpirit;
          summonHp = 30;
          summonAttackName = "Deathly Touch";
          summonAttackDamage = [
            `1d8[necrotic] + 3 + ${spellLevel}`,
            "necrotic",
          ];
        }
      },
    },
  },
});
console.log(spellLevel);
console.log(summonHp);
summonHp += 10 * (spellLevel - 3);
console.log(summonHp);
console.log(parseInt(summonHp));

const updateData = {
  token: {
    alpha: 0,
  },
  actor: {
    system: {
      abilities: {
        int: {
          value:
            casterActor.system.abilities[
              casterActor.system.attributes.spellcasting
            ].value,
        },
      },
      attributes: {
        ac: {
          value: 11 + spellLevel,
        },
        hp: {
          max: parseInt(summonHp),
          value: parseInt(summonHp),
        },
      },
      details: {
        cr: casterActor.system.details.level,
      },
    },
  },
  embedded: {
    Item: {
      Multiattack: {
        system: {
          description: {
            value: `<div class="ddb"><p class="Stat-Block-Styles_Stat-Block-Body"> The spirit makes ${Math.floor(
              spellLevel / 2
            )} attacks.</p></div>`,
          },
        },
      },
      [summonAttackName]: {
        system: {
          damage: {
            parts: [summonAttackDamage],
          },
        },
      },
    },
  },
};

const portal = new Portal()
  .color(game.user.color)
  //  .texture(item.img)
  .origin(casterToken.center)
  .range(90)
  .addCreature(summonUuid, { updateData: updateData });

const [spawnedUndead] = await portal.spawn();
const location = canvas.grid.getCenterPoint({
  x: spawnedUndead.x,
  y: spawnedUndead.y,
});

new Sequence()
  .effect()
  .file("jb2a.magic_signs.circle.02.necromancy.intro.purple")
  .atLocation(location)
  .belowTokens()
  .scaleToObject(1.5)
  .waitUntilFinished(-1200)
  .effect()
  .file("jb2a.magic_signs.circle.02.necromancy.loop.purple")
  .atLocation(location)
  .belowTokens()
  .scaleToObject(1.5)
  .duration(3000)
  .fadeOut(300)
  .effect()
  .file("jb2a.divine_smite.caster.dark_purple")
  .atLocation(location)
  .scaleToObject(1.4)
  .belowTokens()
  .zIndex(5)
  .animation()
  .on(spawnedUndead)
  .delay(1000)
  .fadeIn(100)
  .effect()
  .file("jb2a.magic_signs.circle.02.necromancy.outro.purple")
  .atLocation(location)
  .belowTokens()
  .scaleToObject(1.5)
  .fadeIn(300)
  .delay(1000)
  .play();
