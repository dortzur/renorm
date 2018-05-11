/**
 * @param a {*}
 * @param b {*}
 * @return {boolean}
 */
export const equalityCheck = (a, b) => {
  return a === b;
};
/**
 * @param prevEntities {Object}
 * @param nextEntities {Object}
 * @return {boolean}
 */
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

/**
 *
 * @param equalityCheck {func}
 * @param prev {array}
 * @param next {array}
 * @return {boolean}
 */
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

/**
 *
 * @param entityArray {array}
 * @return {object}
 */
export const toEntity = (entityArray) =>
  entityArray.reduce((entityMap, item) => {
    entityMap[item.id] = item;
    return entityMap;
  }, {});
/**
 * @param id {*}
 * @param schema {Schema}
 * @param entities {Object}
 * @return {{entity: {}, schema: Schema}}
 */
export const getEntity = (id, schema, entities) => ({
  entity: entities[schema.key][id],
  schema,
});
