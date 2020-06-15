# sophii.co working files

This repo is a collection of javascript files to support the website [sophii.co](sophii.co).

## Usage

The easiest way to use the scripts from this repo is to CDN directly to the distributable JS files.

For the latest version of `avoidance.js`:

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/dist/avoidance-0.1.js">
```

For the latest version of `gallery-case-scroll.js` (currently unavailable as a general library):

```html
<script src="https://cdn.jsdelivr.net/gh/stephen-zhao/sophii.co/dist/gallery-case-scroll-v0.3.2.txt">
```

Both scripts currently require `jQuery`, so it must be imported before any [sophii.co](sophii.co) scripts are sourced. See <https://code.jquery.com/>.

## Roadmap

- `avoidance.js`:
  - needs a major performance revamp
  - needs to support adding/removing tracked elements
- `gallery-case-scroll.js`:
  - needs library-ification
- general:
  - needs API documentation
  - NPM-ify?