import { createDenormalizeSelector } from './';
import { normalize } from 'normalizr';
import stockFixture from '../fixtures/stock-fixure';
import { Schemas } from '../fixtures/schema-fixture';

let state = null;
const getStocks = (state) => state.stocks;

describe('create-denormalize-select', () => {
  beforeAll(() => {
    const { result: stocks, entities } = normalize(
      stockFixture,
      Schemas.COMPANY_ARRAY
    );
    state = { stocks, entities };
  });

  it('does stuff', () => {
    const getStocksSelector = createDenormalizeSelector(getStocks, Schemas.COMPANY_ARRAY, 'companies', 'earnings', 'stocks');
    const stocks = getStocksSelector(state);
    expect(stocks[0]).toMatchSnapshot();
    expect(stocks[2]).toMatchSnapshot();
    expect(stocks[15]).toMatchSnapshot();
    expect(stocks[30]).toMatchSnapshot();

  });
});
