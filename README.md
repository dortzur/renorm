# Renorm

A state selector to optimize the usage of React, Redux, Reselect & Normalizr.

[![CircleCI Status](https://circleci.com/gh/dortzur/renorm.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/dortzur/renorm) [![Coverage Status](https://img.shields.io/coveralls/dortzur/renorm.svg?style=flat)](https://coveralls.io/github/dortzur/renorm?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/98cfe3ff1fc90e570820/maintainability)](https://codeclimate.com/github/dortzur/renorm/maintainability) [![minzipped size](https://img.shields.io/bundlephobia/minzip/renorm.svg?colorB=44cc11&style=square)](https://bundlephobia.com/result?p=renorm) [![npm version](https://img.shields.io/npm/v/renorm.svg?style=flat-square)](https://www.npmjs.com/package/renorm) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dortzur/renorm/blob/master/LICENSE)

## Table of Contents

* [Motivation](#motivation)
* [Solution](#solution)
* [Documentation](#documentation)
* [Installation](#installation)
* [Features](#features)
* [How It Works](#how-it-works)
  * [Memoization Strategy](#memoization-strategy)
    * [Basic Memoization. Based on Reselect's existing defaultMemoize](#basic-memoization-based-on-reselects-existing-defaultmemoize)
    * [Advanced Memoization](#advanced-memoization)
* [Examples](#examples)
  * [Basic Usage](#basic-usage)
* [Performance](#performance)
* [Options](#options)
* [Dependencies](#dependencies)
* [License](#license)

## Motivation

An avoidable re-render happens when a React component receives
a shallow copy of one of it's properties, however the object didn't "really" change.
Meaning A deep comparison of all of the object's primitives would find them identical.
This causes a React component to run it's render
method needlessly, since the render result would be identical to the last one.

## Solution

## Documentation

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

## How It Works

`renorm(inputSelector, schema)`
When you create a renorm selector this is what happens:

1.  A new reselect [selectorCreator](https://github.com/reduxjs/reselect#createselectorcreatormemoize-memoizeoptions)
    is created with the schema you provided.
    Renorm uses a [customized version](#memoization-strategy) of Reselect's `defaultMemoize` optimized for normalizr entities.
2.  Renorm traverses the schema you provided and saves all unique entities found.
3.  Renorm creates an entities selector with only the relevant schema entities
4.  Renorm now uses the Reselect selector creator from #1 which uses input, schema and relevant entities to invoke Normalizr's `denormalize` method.
    This is the return value when invoking `renorm`

### Memoization Strategy

Renorm has a two phase memoization strategy

#### Basic Memoization. Based on Reselect's existing `defaultMemoize`

1.  Check arguments length and null check
2.  Shallow equality of of the input ids and each one of the relevant entity maps (stocks, companies, etc.)
    if all the checks return true the memoized version is returned, otherwise the function is invoked.
    This the exact same process Reselect already does by default.

if the function is invoked Renorm switches to advanced memoization

#### Advanced Memoization

For each the denormalized object, check all underlying entities:

1.  If all underlying entities are shallowly equal to the previous ones, return previous denormalized object.
2.  Else return the denormalized object
3.  Cache results for next run

The big advantage here is that only newly returned objects will trigger React's render.
Without Renorm's advanced memoization every item on the list would trigger React's render, even if you only a single entity was changed!

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

// redux state
const state = {
  companyIds: ['COMP_A', 'COMP_B', 'COMP_C' /*...*/],

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
```

For comparison, here's the same selector without using renorm:

```javascript
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

## Performance

## Options

Renorm's third parameter is an optional options object that contains the following props:

| Name         | Type     | Default Value      | Description                                                           |
| ------------ | -------- | ------------------ | --------------------------------------------------------------------- |
| entitiesPath | string   | "entities"         | Path to the entities object in the state                              |
| process      | function | (result) => result | A function to perform mutation operations before results are returned |

## Dependencies

* [Reselect](https://github.com/reduxjs/reselect/)
* [Normalizr](https://github.com/paularmstrong/normalizr)

## License

MIT
