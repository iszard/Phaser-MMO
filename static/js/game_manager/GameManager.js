import Spawner from "./Spawner.js";
import { getTiledProperty, randomNumber, SpawnerType } from "./utils.js";

class GameManager {
  constructor(scene, mapData) {
    this.scene = scene;
    this.mapData = mapData;

    this.spawners = {};
    this.chests = {};
    this.monsters = {};

    this.playerLocations = [];
    this.chestLocations = [];
    this.monsterLocations = [];
  }

  setup() {
    this.parseMapData();
    this.setupEventListener();
    this.setupSpawners();
    this.spawnPlayer();
  }

  parseMapData() {
    this.mapData.forEach((layer) => {
      if (layer.name === "player_locations") {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([
            obj.x + obj.width / 2,
            obj.y - obj.height / 2,
          ]);
        });
      } else if (layer.name === "chest_locations") {
        layer.objects.forEach((obj) => {
          // Newer versions of Tiled put object properties in an array verse the old method of using an object.
          let spawner = Array.isArray(obj.properties.spawner)
            ? getTiledProperty(obj, "spawner")
            : obj.properties.spawner;
          if (this.chestLocations[spawner]) {
            this.chestLocations[spawner].push([
              obj.x + obj.width / 2,
              obj.y - obj.height / 2,
            ]);
          } else {
            this.chestLocations[spawner] = [
              [obj.x + obj.width / 2, obj.y - obj.height / 2],
            ];
          }
        });
      } else if (layer.name === "monster_locations") {
        layer.objects.forEach((obj) => {
          // Newer versions of Tiled put object properties in an array verse the old method of using an object.
          let spawner = Array.isArray(obj.properties.spawner)
            ? getTiledProperty(obj, "spawner")
            : obj.properties.spawner;
          if (this.monsterLocations[spawner]) {
            this.monsterLocations[spawner].push([
              obj.x + obj.width / 2,
              obj.y - obj.height / 2,
            ]);
          } else {
            this.monsterLocations[spawner] = [
              [obj.x + obj.width / 2, obj.y - obj.height / 2],
            ];
          }
        });
      }
    });
  }

  setupEventListener() {
    this.scene.events.on("pickUpChest", (chestId) => {
      // update the spawner
      if (this.chests[chestId]) {
        this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
      }
    });

    this.scene.events.on("monsterAttacked", (monsterId) => {
      // update the spawner
      if (this.monsters[monsterId]) {
        // subtract health monter model
        this.monsters[monsterId].loseHealth();

        // check the monsters health, and if dead remove the object
        if (this.monsters[monsterId].health <= 0) {
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(
            monsterId
          );
          this.scene.events.emit("monsterRemoved", monsterId);
        } else {
          this.scene.events.emit(
            "updateMonsterHealth",
            monsterId,
            this.monsters[monsterId].health
          );
        }
      }
    });
  }

  setupSpawners() {
    const config = {
      spawnInterval: 3000,
      limit: 3,
      spawnerType: "",
      id: "",
    };
    let spawner;

    // create chest spawners
    Object.keys(this.chestLocations).forEach((key) => {
      config.spawnerType = SpawnerType.CHEST;
      config.id = `chest-${key}`;

      spawner = new Spawner(
        config,
        this.chestLocations[key],
        this.addChest.bind(this),
        this.deleteChest.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });

    // create monster spawners
    Object.keys(this.monsterLocations).forEach((key) => {
      config.spawnerType = SpawnerType.MONSTER;
      config.id = `monster-${key}`;

      spawner = new Spawner(
        config,
        this.monsterLocations[key],
        this.addMonster.bind(this),
        this.deleteMonster.bind(this)
      );
      this.spawners[spawner.id] = spawner;
    });
  }

  spawnPlayer() {
    const location =
      this.playerLocations[randomNumber(0, this.playerLocations.length)];
    this.scene.events.emit("spawnPlayer", location);
  }

  addChest(chestId, chest) {
    this.chests[chestId] = chest;
    this.scene.events.emit("spawnChest", chest);
  }

  deleteChest(chestId) {
    delete this.chests[chestId];
  }

  addMonster(monsterId, monster) {
    this.monsters[monsterId] = monster;
    this.scene.events.emit("spawnMonster", monster);
  }

  deleteMonster(monsterId) {
    delete this.monsters[monsterId];
  }
}

export default GameManager;
