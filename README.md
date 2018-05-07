# Denormalize Selector
A state selector optimized for avoiding React avoidable re-renders with Redux, Reselect and Normalizr.


An avoidable re-render happens when a React component receives 
a shallow copy of one of it's properties, however the object didn't "really" change.
Meaning A deep comparison of all of the object's primitives would find them identical.
This causes a React component to run it's render 
method needlessly, since the render result would be identical to the last one.
  
           
[![npm version](https://img.shields.io/npm/v/denormalize-selector.svg?style=flat-square)](https://www.npmjs.com/package/denormalize-selector)
