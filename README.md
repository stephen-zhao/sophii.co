# sophii.co working files

This repo is a collection of javascript files to support the website [sophii.co](https://sophii.co). There are scripts which manage a ["avoidance cloud" effect](https://github.com/stephen-zhao/sophii.co/tree/master/packages/avoidance), which control touch-friendly draggable elements, and which create a dynamic horizontally-scrollable page.


## Quick Start

The two easiest ways to use the scripts from this repo are

1. to CDN directly to the distributable browser-ready JS; or
2. to install to your project via a package manager such as yarn.

See the instructions below for each specific script and how to access the entry points.

### avoidance.js

<p align="center">
  <a href="https://github.com/stephen-zhao/sophii.co/tree/master/packages/avoidance"><img alt="avoidance.js logo" src="https://raw.githubusercontent.com/stephen-zhao/sophii.co/master/packages/avoidance/branding/avoidancejs_logo.png"/></a>
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

For details about features, usage, and roadmap, see the [**avoidance.js** repo homepage](https://github.com/stephen-zhao/sophii.co/tree/master/packages/avoidance).

### draggamil.js

<p align="center">
    Make HTML elements draggable by touch and mouse.
</p>
<p align="center">
  <a href="https://badge.fury.io/js/%40zhaostephen%2Fdraggamil"><img src="https://badge.fury.io/js/%40zhaostephen%2Fdraggamil.svg" alt="npm version" height="18"></a>
</p>

For details about features, usage, and roadmap, see the [**draggamil.js** repo homepage](https://github.com/stephen-zhao/sophii.co/tree/master/packages/draggamil).

### gallery-case-scroll.js

> Note: This script is not yet available in the general library form, and therefore cannot yet be conveniently used. A library-ification is scheduled to be done eventually.

This script currently requires `jQuery`. See <https://code.jquery.com/>.

Use the following code in your HTML to import the script via CDN, after jQuery is imported:

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/dist/gallery-case-scroll-v0.3.2.txt">
```

## Roadmap

- `avoidance.js`:
  - See [TODO](https://github.com/stephen-zhao/sophii.co/tree/master/packages/avoidance#todo)
- `draggamil.js`:
  - See [TODO](https://github.com/stephen-zhao/sophii.co/tree/master/packages/draggamil#todo)
- `gallery-case-scroll.js`:
  - needs library-ification
  - needs documentation
  - basically needs a complete rework


## Extra Usage Tips

The javascript needs to execute after DOM has loaded for it to register all of the elements that it needs to work with.
To do this, either use jQuery's `$(...)` function, like so (this depends on jQuery):

```html
<script>
  $(function() {
    new Avoidance('#my-container').start();
  });
</script>
```

or place a self-executing function at the end of the HTML body, like so (this is browser-native):

```html
<html>
  <body>
    <!-- all the things! -->
    <script>
      (function() {
        new Avoidance('#my-container').start();
      })();
    </script>
  </body>
</html>
```
