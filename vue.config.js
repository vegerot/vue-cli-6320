// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SimpleProgressWebpackPlugin =
  process.env.IN_DOCKER && require('simple-progress-webpack-plugin');

/**
 *  @typedef { import("@vue/cli-service").ProjectOptions } Options
 *  @type { Options }
 */
module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  lintOnSave: false,

  /* Rudimentary support for IE11 can be added by adding
   * `transpileDependencies: ['vuetify', 'js-cookie-vue']`
   */
  transpileDependencies: ['js-cookie-vue'],

  devServer: {
    disableHostCheck: true,
    // https: true,
    // key: fs.readFileSync('../aviato-network/key.pem'),
    // cert: fs.readFileSync('../aviato-network/cert.pem'),
    inline: true,
    progress: !process.env.IN_DOCKER && !process.env.CI,
    stats: 'verbose',
  },

  parallel: 8,

  configureWebpack: (config) => {
    // get a reference to the existing ForkTsCheckerWebpackPlugin
    const existingForkTsChecker = config.plugins.filter(
      (p) => p instanceof ForkTsCheckerWebpackPlugin,
    )[0];

    // remove the existing ForkTsCheckerWebpackPlugin
    // so that we can replace it with our modified version
    config.plugins = config.plugins.filter(
      (p) => !(p instanceof ForkTsCheckerWebpackPlugin),
    );

    // copy the options from the original ForkTsCheckerWebpackPlugin
    // instance and add the memoryLimit property
    const forkTsCheckerOptions = existingForkTsChecker.options;
    forkTsCheckerOptions.memoryLimit = 4096;

    /** probably `undefined` */
    const ogWorkers = forkTsCheckerOptions.workers;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const os = require('os');
    forkTsCheckerOptions.workers = os.cpus().length >= 2 ? os.cpus().length / 2 : ogWorkers;

    forkTsCheckerOptions.tsconfig = './tsconfig.build.json';

    config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));

    if (process.env.IN_DOCKER) {
      config.plugins.push(new SimpleProgressWebpackPlugin({ format: 'minimal' }));
    }
  },

  pwa: {
    appleMobileWebAppStatusBarStyle: '#87878d',
  },
};
