import { schemaSelectorCreator } from "./schema-selector-creator";
import { denormalize } from "normalizr";

export const createDenormalizeSelector = (getInput, schema, ...entityNames) => {
  const createEntitySelector = schemaSelectorCreator(schema);
  const getEntities = state =>
    Object.entries(state.entities).reduce((acc, [key, val]) => {
      if (entityNames.includes(key)) {
        acc[key] = val;
      }
      return acc;
    }, {});

  return createEntitySelector(getInput, getEntities, (input, entities) =>
    denormalize(input, schema, entities)
  );
};
