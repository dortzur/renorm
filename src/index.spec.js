import renorm from './';
import { normalize } from 'normalizr';
import stockFixture from '../fixtures/stock-fixure';
import { Schemas } from '../fixtures/schema-fixture';
import produce from 'immer';
import { decamelizeKeys } from 'humps';
const getStocks = (state) => state.stocks;

let state = null;

describe('renorm', () => {
  beforeAll(() => {
    const { result: stocks, entities } = normalize(
      stockFixture,
      Schemas.COMPANY_ARRAY
    );
    state = { stocks, entities };
  });

  it('denormalizes entities', () => {
    const getStocksSelector = renorm(getStocks, Schemas.COMPANY_ARRAY);
    const initialStocks = getStocksSelector(state);
    expect(initialStocks[0]).toMatchSnapshot();
    expect(initialStocks[2]).toMatchSnapshot();
    expect(initialStocks[15]).toMatchSnapshot();
    expect(initialStocks[30]).toMatchSnapshot();
  });

  it('replaces only changed denormalized entities', () => {
    const getStocksSelector = renorm(getStocks, Schemas.COMPANY_ARRAY);
    const initialStocks = getStocksSelector(state);
    const newState = produce(state, (draftState) => {
      draftState.entities.earnings['AAPL_QUARTER_1'].earnings = 15;
    });
    const newStocks = getStocksSelector(newState);
    const changedStocks = newStocks.filter(
      (stock, index) => stock !== initialStocks[index]
    );
    expect(changedStocks).toHaveLength(1);
    expect(changedStocks[0].id).toEqual('COMP_AAPL');
  });

  it('caches values correctly', () => {
    const getStocksSelector = renorm(getStocks, Schemas.COMPANY_ARRAY);
    getStocksSelector(state);
    expect(getStocksSelector.recomputations()).toEqual(1);
    getStocksSelector(state);
    expect(getStocksSelector.recomputations()).toEqual(1);
    state = { ...state, entities: { ...state.entities } };
    getStocksSelector(state);
    expect(getStocksSelector.recomputations()).toEqual(1);
    const stocks = getStocksSelector(state);
    state = produce(state, (draftState) => {
      draftState.stocks.push('COMP_AAPL');
      return draftState;
    });
    const changedStocks = getStocksSelector(state);

    expect(getStocksSelector.recomputations()).toEqual(2);
    expect(changedStocks).toHaveLength(stocks.length + 1);
    expect(
      changedStocks.filter((stock, index) => stock !== stocks[index])
    ).toHaveLength(1);
  });

  it('denormalizes a single entity', () => {
    const getAppleStock = renorm(() => 'AAPL', Schemas.STOCK);
    const appleStock = getAppleStock(state);
    getAppleStock(state);
    expect(appleStock).toMatchSnapshot();
    getAppleStock({ ...state });
    expect(getAppleStock.recomputations()).toEqual(1);

    const newState = produce(state, (draftState) => {
      draftState.entities.stocks['AAPL'].name = 'Apple';
    });
    getAppleStock(newState);
    expect(getAppleStock.recomputations()).toEqual(2);
  });

  it('uses a process function', () => {
    const getStocksSelector = renorm(getStocks, Schemas.COMPANY_ARRAY, {
      process: (result) => decamelizeKeys(result),
    });
    const result = getStocksSelector(state);
    expect(result[1]).toEqual(
      expect.objectContaining({
        company_name: 'Apple Inc.',
        financial_status: 'N',
        id: 'COMP_AAPL',
        market_category: 'Q',
        round_lot_size: 100,
        security_name: 'Apple Inc. - Common Stock',
      })
    );
    expect(result[1]).toMatchSnapshot();

    const getAppleStock = renorm(() => 'AAPL', Schemas.STOCK, {
      process: (result) => decamelizeKeys(result),
    });
    const appleStock = getAppleStock(state);
    expect(appleStock).toMatchSnapshot();
    expect(appleStock).toEqual(
      expect.objectContaining({
        change: -7.08,
        field4: '',
        id: 'AAPL',
        last_earnings_report: {
          earnings: 77598,
          quarter: 3,
          report_id: 'AAPL_QUARTER_3',
        },
      })
    );
  });
});
