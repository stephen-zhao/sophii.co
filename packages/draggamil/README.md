# draggamil.js

<p align="center">
    Make HTML elements draggable my touch and mouse.
</p>
<p align="center">
  <a href="https://badge.fury.io/js/%40zhaostephen%2Fdraggamil"><img src="https://badge.fury.io/js/%40zhaostephen%2Fdraggamil.svg" alt="npm version" height="18"></a>
</p>

## Quick Start

The two easiest ways to use **draggamil.js** are

1. to CDN directly to the distributable browser-ready JS; or
2. to install to your project via a node package manager.

### To CDN:

Choose one of the following script tags to add directly to your HTML.

```html
<!-- Get a specific version -->
<script src="https://cdn.jsdelivr.net/npm/@zhaostephen/draggamil@0.1.0/dist/draggamil.min.js"></script>

<!-- Get patch fixes within the minor version -->
<script src="https://cdn.jsdelivr.net/npm/@zhaostephen/draggamil@0.1/dist/draggamil.min.js"></script>

<!-- Get minor updates and patch fixes within the major version -->
<script src="https://cdn.jsdelivr.net/npm/@zhaostephen/draggamil@0/dist/draggamil.min.js"></script>

<!-- Always get the latest version -->
<!-- Not recommended for production sites! Only use if you know what you're doing. -->
<script src="https://cdn.jsdelivr.net/npm/@zhaostephen/draggamil/dist/draggamil.min.js"></script>
```

### To install to a Node.js project:

Run in one of the following in your project directory (depending on your package manager):

```sh
yarn add @zhaostephen/draggamil
```
```sh
npm install --save @zhaostephen/draggamil
```

### To use:

#### Import

If using with ES modules, import the library like so:

```js
import Draggamil from "@zhaostephen/draggamil";
```

If using CommonJS, import the library like so:

```js
const Draggamil = require("@zhaostephen/draggamil");
```

If using directly in the browser, the library is accessible through a global variable, `Draggamil`.

#### Create and run

Then simple make a call to `Draggamil` passing in the container and draggable items by query selector string.

```js
Draggamil('#container', '.draggable');
```

Replace `'#container'` with the query selector for the container on which you want the elements to be draggable within. Replace `'.draggable'` with the query selector for all items which you want to be draggable.

## TODO

- support multi-touch, keeping track of multiple items being dragged (with independently tracked motions) simultaneously
- support multiple containers on the same page
