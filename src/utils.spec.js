import {
  areEntitiesEqual,
  equalityCheck,
  toEntity,
  getEntity,
  areArgumentsShallowlyEqual,
  uniqueFilter,
  dotProp,
  getEntityNames,
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
  it('converts arrays to entity maps', () => {
    const entitiesArray = Object.entries(state.entities.stocks).map(
      ([id, entry]) => entry
    );
    const entities = toEntity(entitiesArray);

    expect(entities['AAPL'].name).toEqual('Apple Inc');
    expect(entities['AAPL']).toMatchSnapshot();
  });
  it('checks entity maps equality', () => {
    expect(areEntitiesEqual(state.entities, state.entities)).toBeTruthy();
    expect(
      areEntitiesEqual(state.entities, { ...state.entities })
    ).toBeTruthy();
    const newEntities = (state.entities.stocks = { ...state.entities.stocks });
    expect(areEntitiesEqual(state.entities, newEntities)).toBeFalsy();
  });
  it('filters unique values', () => {
    const arr = ['A', 'B', 'C', 'A', 'C', 'D', 'D', 'B', 'C'];
    expect(arr.filter(uniqueFilter)).toEqual(['A', 'B', 'C', 'D']);
  });
  it('gets deep properties safely', () => {
    const obj = { a: { b: { c: { d: 'prop' } } } };
    expect(dotProp('a.b.c', obj)).toEqual({ d: 'prop' });
    expect(dotProp('a.b.c.d', obj)).toEqual('prop');
    expect(dotProp('a.b.c.d.e', obj)).toBeUndefined();
    expect(dotProp('q', obj)).toBeUndefined();
    expect(dotProp('a.b.c.q', obj)).toBeUndefined();
    expect(dotProp('a.b.c.q')).toBeUndefined();
    expect(dotProp('',obj)).toBeUndefined();
  });
  it('gets entity names', () => {
    expect(getEntityNames(Schemas.COMPANY)).toEqual([
      'companies',
      'stocks',
      'earnings',
    ]);
    expect(getEntityNames(Schemas.STOCK_ARRAY)).toEqual(['stocks', 'earnings']);
  });
});
