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
 * @param equalityCheck {function}
 * @param prev {array|IArguments}
 * @param next {array|IArguments}
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
 * @param schema {schema.Entity}
 * @param entities {Object}
 * @return {{entity: {}, schema: schema.Entity}}
 */
export const getEntity = (id, schema, entities) => ({
  entity: entities[schema.key][id],
  schema,
});

export const uniqueFilter = (val, i, arr) => arr.indexOf(val) === i;

export const getEntityNames = (schema, schemaEntities = []) => {
  if (Array.isArray(schema)) {
    schema = schema[0];
  }
  schemaEntities.push(schema.key);
  Object.entries(schema.schema).forEach(([childKey, childSchema]) =>
    getEntityNames(childSchema, schemaEntities)
  );

  return schemaEntities.filter(uniqueFilter);
};

export const dotProp = (path, obj) =>
  path.split('.').reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);

export const uncoveredMethod = () => console.log('uncovered');
