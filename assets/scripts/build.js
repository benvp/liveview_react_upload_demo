const esbuild = require('esbuild');

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const deploy = args.includes('--deploy');

const loader = {
  // Add loaders for images/fonts/etc, e.g. { '.svg': 'file' }
};

const plugins = [
  // Add and configure plugins here
];

let opts = {
  entryPoints: ['src/app.ts'],
  bundle: true,
  target: 'es2017',
  outdir: '../priv/static/assets',
  logLevel: 'info',
  loader,
  plugins,
};

if (watch) {
  opts = {
    ...opts,
    watch,
    sourcemap: 'inline',
    tsconfig: 'tsconfig.dev.json',
  };
}

if (deploy) {
  opts = {
    ...opts,
    minify: true,
  };
}

const promise = esbuild.build(opts);

if (watch) {
  promise.then(_result => {
    process.stdin.on('close', () => {
      process.exit(0);
    });

    process.stdin.resume();
  });
}
