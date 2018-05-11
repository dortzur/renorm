export const equalityCheck = (a, b) => {
  return a === b;
};

export const areEntitiesEqual = (prevEntities, nextEntities) => {
  for (const key in nextEntities) {
    if (
      nextEntities.hasOwnProperty(key) &&
      prevEntities[key] !== nextEntities[key]
    ) {
      return false;
    }
  }
  return true;
};

export function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }
  const [prevInput, prevEntities] = prev;
  const [nextInput, nextEntities] = next;
  if (!equalityCheck(prevInput, nextInput)) {
    return false;
  }

  return areEntitiesEqual(prevEntities, nextEntities);
}

export const toEntity = (arr) =>
  arr.reduce((entityMap, item) => {
    entityMap[item.id] = item;
    return entityMap;
  }, {});

export const getEntity = (id, schema, entities) => ({
  entity: entities[schema.key][id],
  schema,
});
