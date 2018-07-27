import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  input: 'src/main.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
    nodeResolve({
      jsnext: true
    }),
    commonjs()
  ]
};

if (env === 'es' || env === 'cjs') {
  config.output = { format: env };
}

if (env === 'umd') {
  config.output = { format: 'umd', name: 'ConsumeMultipleContexts' };

  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  );
}

export default config;
