module.exports = {
    target: 'webworker',
    entry: './index.js',
    mode: 'production',
    externals: {
        "itty-router": "itty-router",
        "itty-router-extras": "itty-router-extras"
    }
};