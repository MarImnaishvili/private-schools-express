/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const nextIntl = require("next-intl/plugin");

const withNextIntl = nextIntl();

const nextConfig = {
  webpack(config, { isServer }) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };

    // Suppress Supabase Edge Runtime warnings
    if (isServer) {
      config.ignoreWarnings = [
        { module: /node_modules\/@supabase/ }
      ];
    }

    return config;
  },
};

module.exports = withNextIntl(nextConfig);
