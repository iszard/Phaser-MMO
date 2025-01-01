export const SpawnerType = {
  MONSTER: "MONSTER",
  CHEST: "CHEST",
};

export function randomNumber(min, max = 0) {
  return Math.floor(Math.random() * max) + min;
}

// Newer versions of Tiled put object properties in an array verse the old method of using an object.
export function getTiledProperty(obj, property_name) {
  for (
    var property_index = 0;
    property_index < obj.properties.length;
    property_index += 1
  ) {
    var property = obj.properties[property_index];
    if (property.name == property_name) {
      return property.value;
    }
  }
}
