import { createSelectorCreator } from 'reselect';
import {
  areArgumentsShallowlyEqual,
  equalityCheck,
  getEntity,
  toEntity,
} from './utils';

/**
 *
 * @param id {*}
 * @param schema {schema.Entity}
 * @param entities {Object}
 * @param affectedEntities {Array}
 * @return {Array}
 */
const getAffectedEntities = (id, schema, entities, affectedEntities = []) => {
  if (Array.isArray(schema)) {
    schema = schema[0];
  } else {
    id = [id];
  }
  id.forEach((id) => {
    const entity = getEntity(id, schema, entities);
    affectedEntities.push(entity);
    Object.entries(schema.schema).forEach(([childKey, childSchema]) => {
      const entityId = entity.entity[childKey];
      return getAffectedEntities(
        entityId,
        childSchema,
        entities,
        affectedEntities
      );
    });
  });
  return affectedEntities;
};

/**
 *
 * @param id {*}
 * @param rootSchema {schema.Entity}
 * @param entities {Object}
 * @param lastEntities {Object}
 * @return {boolean}
 */
const didEntitiesChange = (id, rootSchema, entities, lastEntities) => {
  const affected = getAffectedEntities(id, rootSchema, entities);
  return affected.reduce((didChange, entityObj) => {
    if (didChange) return didChange;
    return (
      entities[entityObj.schema.key][
        entityObj.entity[entityObj.schema.idAttribute]
      ] !==
      lastEntities[entityObj.schema.key][
        entityObj.entity[entityObj.schema.idAttribute]
      ]
    );
  }, false);
};
/**
 *
 * @param input {Array}
 * @param rootSchema {schema.Entity}
 * @param entities {Object}
 * @param newResultEntityMap {Object}
 * @param Cache {Object}
 * @return {Array}
 */
const getOptimizedResult = (
  input,
  rootSchema,
  entities,
  newResultEntityMap,
  Cache
) =>
  input.map(
    (id) =>
      didEntitiesChange(id, rootSchema, entities, Cache.lastEntities)
        ? newResultEntityMap[id]
        : Cache.lastResultEntityMap[id]
  );

/**
 *
 * @param func {function}
 * @param schema {schema.Entity}
 * @return {function}
 */
function entityMemoize(func, schema) {
  const Cache = {
    lastArgs: null,
    lastEntities: null,
    lastResult: null,
    newResult: null,
    lastResultEntityMap: null,
  };

  const rootSchema = Array.isArray(schema) ? schema[0] : schema;

  // we reference arguments instead of spreading them for performance reasons
  return function() {
    if (!areArgumentsShallowlyEqual(equalityCheck, Cache.lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      const [rawInput, entities] = arguments;
      const rawResult = func.apply(null, arguments);
      Cache.newResult = Array.isArray(rawResult) ? rawResult : [rawResult];
      const newResultEntityMap = toEntity(Cache.newResult);

      const input = Array.isArray(rawInput) ? rawInput : [rawInput];
      if (Cache.lastResult) {
        Cache.lastResult = getOptimizedResult(
          input,
          rootSchema,
          entities,
          newResultEntityMap,
          Cache
        );
      } else {
        Cache.lastResult = Cache.newResult;
      }

      Cache.lastResultEntityMap = toEntity(Cache.lastResult);
      Cache.lastArgs = arguments;
      Cache.lastEntities = entities;
    }
    return Array.isArray(schema) ? Cache.lastResult : Cache.lastResult[0];
  };
}

/**
 *
 * @param schema {schema.Entity}
 * @return {function}
 */
export const schemaSelectorCreator = (schema) =>
  createSelectorCreator(entityMemoize, schema);
