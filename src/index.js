import { schemaSelectorCreator } from './schema-selector-creator';
import { denormalize } from 'normalizr';
import { dotProp, getEntityNames } from './utils';

const defaultOptions = { entityReducerPath: 'entities' };

/**
 *
 * @param getInput {function}
 * @param schema {schema.Entity}
 * @param options {object}
 * @return {function}
 */
export const createDenormalizeSelector = (getInput, schema, options = {}) => {
  const createEntitySelector = schemaSelectorCreator(schema);
  const entityNames = getEntityNames(schema);
  options = Object.assign({}, defaultOptions, options);
  const getEntities = (state) =>
    Object.entries(dotProp(options.entityReducerPath, state)).reduce(
      (acc, [key, val]) => {
        if (entityNames.includes(key)) {
          acc[key] = val;
        }
        return acc;
      },
      {}
    );

  return createEntitySelector(getInput, getEntities, (input, entities) =>
    denormalize(input, schema, entities)
  );
};
