// Plugins
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

// Variables
const variables = {
  colloquialName: 'draggamil.js'
}

// Banner
const bannerContent = (contents => {
  if (Array.isArray(contents)) {
    if (contents.length === 1) {
      return '// ' + contents[0];
    }
    else {
      return '/**\n' + contents.join('\n * ') + '\n */';
    }
  }
  else if (typeof contents === 'string') {
    if (!contents.includes('\n')) {
      return '// ' + contents;
    }
    else {
      return '/**\n' + contents.replace('\n', '\n * ') + '\n */';
    }
  }
  else {
    return '// ' + contents;
  }
})([
  `${variables.colloquialName ? variables.colloquialName : pkg.name}`
  + ` v${pkg.version} `
  + ` | (c) ${new Date().getFullYear()}`
  + ` ${typeof pkg.author === 'object' ? pkg.author.name : pkg.author}`
  + ` | ${pkg.license} License`
  + ` | ${typeof pkg.repository === 'object' ? pkg.repository.url : pkg.repository}`
]);

// Configs
const configs = [
  {
    input: 'src/draggamil.ts',
    output: [
      {
        format: 'umd',
        name: 'Draggamil',
        file: 'dist/draggamil.js',
        sourcemap: true,
        banner: bannerContent,
      },
      {
        format: 'umd',
        name: 'Draggamil',
        file: 'dist/draggamil.min.js',
        plugins: [terser()],
        sourcemap: true,
        banner: bannerContent,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        extensions: [
          'js', 'ts',
        ],
      }),
    ],
    watch: {
      include: 'src/**/*',
    },
  },
];

export default configs;
