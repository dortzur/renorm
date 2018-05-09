# Denormalize Selector
A state selector optimized for avoiding React avoidable re-renders with Redux, Reselect and Normalizr.

[![CircleCI Status](https://circleci.com/gh/dortzur/denormalize-selector.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/dortzur/denormalize-token) [![Coverage Status](https://img.shields.io/coveralls/dortzur/denormalize-selector.svg?style=flat)](https://coveralls.io/github/dortzur/denormalize-selector?branch=master) [![npm version](https://img.shields.io/npm/v/denormalize-selector.svg?style=flat-square)](https://www.npmjs.com/package/denormalize-selector) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dortzur/denormalize-selector/blob/master/LICENSE)  


An avoidable re-render happens when a React component receives 
a shallow copy of one of it's properties, however the object didn't "really" change.
Meaning A deep comparison of all of the object's primitives would find them identical.
This causes a React component to run it's render 
method needlessly, since the render result would be identical to the last one.
  
           

