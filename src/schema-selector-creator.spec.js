import { Schemas } from '../fixtures/schema-fixture';
import { schemaSelectorCreator } from './schema-selector-creator';

describe('schema-selector-creator', () => {
  it('create an entity selector creator', () => {
    const createEntitySelector = schemaSelectorCreator(Schemas.COMPANY_ARRAY);
    expect(createEntitySelector).toBeInstanceOf(Function);
  });
});
