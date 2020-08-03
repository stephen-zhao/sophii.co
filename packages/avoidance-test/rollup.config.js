import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import path from 'path';
import fs from 'fs';

// Build up list of tests
const inputDir = fs.opendirSync('src');
const inputFileNames = [];
let dirent = inputDir.readSync();
while (dirent) {
  if (dirent.isFile()) {
    inputFileNames.push(dirent.name);
  }
  dirent = inputDir.readSync();
}
inputDir.closeSync();


// Create rollup config entries for each test
const configs = inputFileNames.map(inputFileName => ({
  input: path.join('src', inputFileName),
  output: {
    format: 'umd',
    file: path.join('dist', inputFileName),
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
  ],
}));

export default configs;