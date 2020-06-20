# sophii.co working files

This repo is a collection of javascript files to support the website [sophii.co](sophii.co).


## Usage

The easiest way at the moment to use the scripts from this repo is to CDN directly to the distributable JS files, transpiled and ready to use directly in the browser. Once the scripts are properly packaged and published to npm, there will be other ways to use them.

### avoidance.js

Use the following code in your HTML to import the script via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/packages/avoidance/dist/avoidance.var.min.js">
```

Then, to use the avoidance effect, add the following javascript, replacing `#my-container` with the query selector for the container on which you want the effect to occur.

```js
    new Avoidance('#my-container').start();
```

See extra usage notes below.

### gallery-case-scroll.js

This script currently requires `jQuery`. See <https://code.jquery.com/>.

Use the following code in your HTML to import the script via CDN, after jQuery is imported:

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/dist/gallery-case-scroll-v0.3.2.txt">
```

> Note: This script is not yet available in the general library form, and therefore cannot yet be conveniently used. A library-ification is scheduled to be done eventually.


## Roadmap

- `avoidance.js`:
  - support for mobile "touch"
  - support rotation animation
  - add typedefs in typescript (especially for the API)
  - needs API documentation
  - needs features highlight in README
  - needs publish to NPM
- `gallery-case-scroll.js`:
  - needs library-ification
  - needs documentation
  - basically needs a complete rework


## Extra Usage Tips

The javascript needs to execute after DOM has loaded for it to register all of the elements that it needs to work with.
To do this, either use jQuery's `$(...)` function, like so:

```html
<script>
  $(function() {
    new Avoidance('#my-container').start();
  });
</script>
```

or place a self-executing function at the end of the HTML body, like so:

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
