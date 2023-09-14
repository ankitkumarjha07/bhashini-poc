const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Specify the base URL path you want to proxy (e.g., /api)
    createProxyMiddleware({
      target: 'https://dhruva-api.bhashini.gov.in', // Replace with the external API URL
      changeOrigin: true,
      secure: false, // Change this to 'true' if you need to use HTTPS
      pathRewrite: {
        '^/api': '', // Optional: Remove the base URL path from the request
      },
    })
  );
};