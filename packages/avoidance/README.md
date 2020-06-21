# avoidance.js

<p align="center">
  <a href="https://github.com/stephen-zhao/sophii.co/master/packages/avoidance"><img alt="avoidance.js logo" src="https://raw.githubusercontent.com/stephen-zhao/sophii.co/master/packages/avoidance/branding/avoidancejs_logo.png"/></a>
</p>
<p align="center">
    Make HTML elements avoid your mouse cursor and touches, beautifully.
</p>
<p align="center">
  <img alt="avoidance.js demo animation" src="https://raw.githubusercontent.com/stephen-zhao/sophii.co/master/packages/avoidance/docs/demo.gif"/>
</p>
<p align="center">
  <a href="https://badge.fury.io/js/%40zhaostephen%2Favoidance"><img src="https://badge.fury.io/js/%40zhaostephen%2Favoidance.svg" alt="npm version" height="18"></a>
</p>

## Quick Start

The two easiest ways to use **avoidance.js** are

1. to CDN directly to the distributable browser-ready JS; or
2. to install to your project via a node package manager such as yarn.

### To CDN:

Paste the following into your HTML, either inside `<head>` or at the end of `<body>`, before any javascript that makes use of it.

```html
<script src="https://cdn.jsdelivr.net/npm/@zhaostephen/avoidance@0.1.1/dist/avoidance.var.min.js">
```

### To install to node project:

Run in one of the following (depending on your package manager):

```sh
yarn add @zhaostephen/avoidance
```
```sh
npm install --save @zhaostephen/avoidance
```

### To use:

#### Import

If using with modules, first import the library's main entry point. If using directly in browser, skip this step.

```js
import Avoidance from "@zhaostephen/avoidance";
```

#### Create and run

Then simply instantiate an `Avoidance` on the container of your choice, and call start.

```js
new Avoidance('#my-container').start();
```

Replace `#my-container` with the query selector for the container on which you want the mouse-over/touch effect to occur. All children elements will then be animated as particles.

## API Reference

#### Constructor

```ts
new Avoidance(containerSelector: string, options?: AvoidanceUserOptions, addChildrenAsParticles?: boolean)
```

- `containerSelector`: a query selector (similar to CSS selector) that specifies which elements will activate the avoidance effect when moused over or touched.
- `options` *\[optional\]*:  a options object that specifies parameters for how the avoidance effect behaves. Defaults to `{}`. See the [options section](#configuration-options) below for what can be tweaked!
- `addChildrenAsParticles` *\[optional\]*: a boolean that specifies whether or not the children of the specified containers will be automatically added as particles upon instantiation. Defaults to `true`.

#### Other methods

> TODO: Documentation for other methods will be added later.

## Configuration Options

The `Avoidance` constructor takes in an options object as its second parameter.

### Example

An example `AvoidanceUserOptions` object is given below.

```js
{
  factorMethod: {
    name: "power_inverse",
    offset: 0.5,
    power: 1.7,
  },
  displacementMethod: "proportional_threshold",
  timing: "easeOutCubic",
}
```

### Keys

An `AvoidanceUserOptions` object can take any combination of the following *optional* keys and values.

#### factorMethod

`factorMethod` specifies what method to use to determine the avoidance distance multiplier.

It can be either a string or an object.

- If a string, it can be one of `"inverse"`, `"power_inverse"`, or `"exponential"`.
- If an object, it can contain any combination of the following keys and values:
  - `name`: one of `"inverse"`, `"power_inverse"`, or `"exponential"`.
  - `scale`: a floating-point number.
  - `offset`: a floating-point number.
  - `power`: a floating-point number.

The default behaviour is

```js
{
  name: "power_inverse",
  scale: 1.0,
  offset: 0.0,
  power: 1.6,
}
```

This may be used as a reference point for modifying the values.

If only a name is provided, the default value for the remaining keys will adjust accordingly.

#### displacementMethod

`displacementMethod` specifies what method to use to calculate avoidance displacement, given the distance multiplier.

It can be either a string or an object.

- If a string, it can be one of `"standard"`, `"proportional_threshold"`, or `"absolute_threshold"`.
- If an object, it can contain any combination of the following keys and values:
  - `name`: one of `"standard"`, `"proportional_threshold"`, or `"absolute_threshold"`.
  - `thresholdRadius`: a floating-point number

The default behaviour is

```js
{
  name: "absolute_threshold",
  thresholdRadius: 80.0,
}
```

This may be used as a reference point for modifying the values.

If only a name is provided, the default value for `thresholdRadius` will adjust accordingly.

#### timing

`timing` is a string that specifies an easing for the touch animations.

It can be one of `"linear"`, `"easeOutCubic"`, or `"easeOutExpo"`.

The default value is `"easeOutExpo"`.

#### pathing

`pathing` is a string that specifies the path taken by touch animations.

It can be one of `"linear"` or `"bezierQuad"`.

The default value is `"bezierQuad"`.

#### additional options

> TODO: additional options will come in the future. Stay on the lookout!


## TODO

- support rotation animation
- add typedefs in typescript
- needs further API documentation
