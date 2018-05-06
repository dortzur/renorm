export function equalityCheck(a, b) {
  return a === b;
}
export function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  const length = prev.length;
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }

  return true;
}

export const toEntity = arr =>
  arr.reduce((entityMap, item) => {
    entityMap[item.id] = item;
    return entityMap;
  }, {});

export const getEntity = (id, schema, entities) => ({
  entity: entities[schema.key][id],
  schema
});
