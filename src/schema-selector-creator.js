import { createSelectorCreator } from "reselect";
import {
  areArgumentsShallowlyEqual,
  equalityCheck,
  getEntity,
  toEntity
} from "./utils";

const getAffectedEntities = (id, schema, entities, affectedEntities = []) => {
  if (Array.isArray(schema)) {
    schema = schema[0];
  } else {
    id = [id];
  }
  id.forEach(id => {
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

function entityMemoize(func, schema) {
  let lastArgs = null;
  let lastEntities = null;
  let lastResult = null;
  let newResult = null;
  let lastResultCache = {};
  const rootSchema = Array.isArray(schema) ? schema[0] : schema;

  // we reference arguments instead of spreading them for performance reasons
  return function() {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      newResult = func.apply(null, arguments);
      const newResultCache = toEntity(newResult);
      const [input, entities] = arguments;
      //do magic
      if (lastResult) {
        lastResult = input.map(id => {
          const affected = getAffectedEntities(id, rootSchema, entities);
          const didChange = affected.reduce((didChange, entityObj) => {
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
          return didChange ? newResultCache[id] : lastResultCache[id];
        });
      } else {
        lastResult = newResult;
      }
      lastResultCache = toEntity(lastResult);
      lastArgs = arguments;
      lastEntities = entities;
    }

    return lastResult;
  };
}

export const schemaSelectorCreator = schema =>
  createSelectorCreator(entityMemoize, schema);
