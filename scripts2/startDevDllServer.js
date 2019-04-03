process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const paths = require('../config/paths');

function startDevDllServer() {
  const dllName = 'rsdll';
  // const dllManifestPath = paths.resolveApp('build/static/rsdll-manifest.json');

  console.log('Starting dev dll...');

  let wpConfig = require('../config/webpack.config.dev');
  wpConfig = {
    ...wpConfig,
    output: { ...wpConfig.output },
    plugins: [...wpConfig.plugins],
  };
  wpConfig.output.filename = `${dllName}.js`;
  wpConfig.output.library = dllName;
  wpConfig.output.path = paths.resolveApp('dll');
  wpConfig.plugins.push(
    new webpack.DllPlugin({
      path: paths.dllManifest,
      name: dllName,
      context: paths.appSrc,
    })
  );

  return new Promise((resolve, reject) => {
    webpack(wpConfig, err => {
      if (err) {
        console.log('dll build failed:');
        console.log(err.stack || err);
        reject();
        return;
      }
      console.timeEnd('Prod dll build success');
      resolve();
    });
  });
}

// buildProdDll();

module.exports = buildProdDll;
