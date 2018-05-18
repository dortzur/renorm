# Renorm

A state selector to optimize the usage of React, Redux, Reselect & Normalizr.

[![CircleCI Status](https://circleci.com/gh/dortzur/renorm.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/dortzur/renorm) [![Coverage Status](https://img.shields.io/coveralls/dortzur/renorm.svg?style=flat)](https://coveralls.io/github/dortzur/renorm?branch=master) [![npm version](https://img.shields.io/npm/v/renorm.svg?style=flat-square)](https://www.npmjs.com/package/renorm) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dortzur/renorm/blob/master/LICENSE)

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
* Easy, concise syntax.
 
 
## Examples


## Benchmarks


## Dependencies

* [Reselect](https://github.com/reduxjs/reselect/)
* [Normalizr](https://github.com/paularmstrong/normalizr)

Renorm doesn't bundle these these dependencies on purpose. You'll want to install them separately.

## License

MIT
