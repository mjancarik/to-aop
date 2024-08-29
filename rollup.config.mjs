const config = {
  input: 'src/main.mjs',
  output: [
    {
      file: `./dist/toAop.js`,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: `./dist/toAop.cjs`,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: `./dist/toAop.mjs`,
      format: 'esm',
      exports: 'named',
    },
  ],
};

export default config;
