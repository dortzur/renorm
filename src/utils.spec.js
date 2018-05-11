import {
  areEntitiesEqual,
  equalityCheck,
  toEntity,
  getEntity,
  areArgumentsShallowlyEqual,
} from './utils';
import { normalize } from 'normalizr';
import { Schemas } from '../fixtures/schema-fixture';
import stockFixture from '../fixtures/stock-fixure';

let state = null;
describe('utils', () => {
  beforeAll(() => {
    const { result: stocks, entities } = normalize(
      stockFixture,
      Schemas.COMPANY_ARRAY
    );
    state = { stocks, entities };
  });
  it('checks equality', () => {
    const baba = {};
    const shallowCopyBaba = { ...baba };
    expect(equalityCheck(baba, baba)).toBeTruthy();
    expect(equalityCheck(baba, shallowCopyBaba)).toBeFalsy();
  });
  it('gets an entity', () => {
    const apple = getEntity(state.stocks[1], Schemas.COMPANY, state.entities);
    expect(apple.schema).toEqual(Schemas.COMPANY);
    expect(apple.entity.id).toEqual('COMP_AAPL');
    expect(apple).toMatchSnapshot();

  });
});
