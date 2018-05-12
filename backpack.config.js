// backpack.config.js
module.exports = {
  webpack: (config, options, webpack) => {
    console.log('CONIFG', config, options);
    // Perform customizations to config
    // Important: return the modified config
    return config;
  }
};
