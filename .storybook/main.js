const path = require("path");

module.exports = {
  stories: ["../src/components/**/**/*.stories.tsx"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@emotion/core": path.join(__dirname, "../node_modules/@emotion/react"),
          "emotion-theming": path.join(__dirname, "../node_modules/@emotion/react"),
        },
      },
    };
  },
};
