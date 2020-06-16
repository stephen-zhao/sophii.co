# sophii.co working files

This repo is a collection of javascript files to support the website [sophii.co](sophii.co).

## Usage

The easiest way to use the scripts from this repo is to CDN directly to the distributable JS files.

Both scripts currently require `jQuery`, so it must be imported before any [sophii.co](sophii.co) scripts are sourced. See <https://code.jquery.com/>.

### avoidance.js

Use the following code in your HTML to import the script via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/dist/avoidance-0.1.js">
```

Then, to use the avoidance effect, add the following javascript, replacing `#my-container` with the query selector for the container on which you want the effect to occur.

```js
    new Avoidance('#my-container').start();
```

See extra usage notes below.

### gallery-case-scroll.js

Use the following code in your HTML to import the script via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/dist/gallery-case-scroll-v0.3.2.txt">
```

> Note: This script is not yet available in the general library form, and therefore cannot be publically used yet. A library-ification is scheduled to be done eventually. 


## Roadmap

- `avoidance.js`:
  - needs a major performance revamp (>50 particles)
  - needs to support adding/removing tracked elements
  - support passing custom parameters to avoidance effect
  - support rotation animation
  - support element size / centre of gravity
  - add typedefs in typescript (especially for the API)
- `gallery-case-scroll.js`:
  - needs library-ification
- general:
  - needs API documentation
  - NPM-ify?

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