# Renorm

A state selector to optimize the usage of React, Redux, Reselect & Normalizr.

[![CircleCI Status](https://circleci.com/gh/dortzur/renorm.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/dortzur/renorm) [![Coverage Status](https://img.shields.io/coveralls/dortzur/renorm.svg?style=flat)](https://coveralls.io/github/dortzur/renorm?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/98cfe3ff1fc90e570820/maintainability)](https://codeclimate.com/github/dortzur/renorm/maintainability) [![npm version](https://img.shields.io/npm/v/renorm.svg?style=flat-square)](https://www.npmjs.com/package/renorm) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dortzur/renorm/blob/master/LICENSE)

## Motivation

An avoidable re-render happens when a React component receives
a shallow copy of one of it's properties, however the object didn't "really" change.
Meaning A deep comparison of all of the object's primitives would find them identical.
This causes a React component to run it's render
method needlessly, since the render result would be identical to the last one.

## Installation

```shell
yarn add renorm
```

```shell
npm install --save renorm
```

## Features

* Discovers entities used in your selector automatically.
* Significant performance boost when selecting a list of entities.
* Developer friendly syntax.

## Examples

### Basic Usage

```javascript
// schema
import { schema } from 'normalizr';
const stockSchema = new schema.Entity('stocks');
const companySchema = new schema.Entity('companies', {
  stock: stockSchema,
});
export const Schemas = {
  STOCK: stockSchema,
  STOCK_ARRAY: [stockSchema],
  COMPANY: companySchema,
  COMPANY_ARRAY: [companySchema],
};

// redux state example
const state = {
  companyIds: ['COMP_A', 'COMP_B' /*...*/],
  entities: {
    companies: {
      /*company entities...*/
    },
  },
  stocks: {
    /*stock entities...*/
  },
};

//renorm selector
import renorm from 'renorm';
const getCompanyIds = (state) => state.companyIds;
const getCompanies = renorm(getCompanyIds, Schemas.COMPANY_ARRAY);

//and here's the same selector without renorm
import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
const getCompanyIds = (state) => state.companyIds;
const getCompanyEntities = (state) => state.entities.companies;
const getStockEntities = (state) => state.entities.stocks;
export const getCompanies = createSelector(
  getCompanyIds,
  getCompanyEntities,
  getStockEntities,
  (stockList, companies, stocks) =>
    denormalize(stockList, Schemas.COMPANY_ARRAY, {
      companies,
      stocks,
    })
);
```

## Options

## Benchmarks

## Dependencies

* [Reselect](https://github.com/reduxjs/reselect/)
* [Normalizr](https://github.com/paularmstrong/normalizr)

Renorm doesn't bundle these these dependencies on purpose. You'll want to install them separately.

## License

MIT
