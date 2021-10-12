const path = require("path");

module.exports = {
  stories: ["../src/components/**/**/*.stories.tsx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],

  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.js$/,
      use: [
        {
          loader: require.resolve("babel-loader"),
          options: {
            plugins: [require.resolve("@babel/plugin-proposal-optional-chaining")],
          },
        },
      ],
      include: require.resolve("@decentralized-identity/ion-tools"),
    });
    config.resolve.alias = {
      ...config.resolve.alias,
      "@emotion/core": require.resolve("@emotion/react"),
      "emotion-theming": require.resolve("@emotion/react"),
      jose: path.join(__dirname, "../node_modules/jose/dist/node/cjs"),
    };
    return config;
  },
};
