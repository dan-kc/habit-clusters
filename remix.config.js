/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*', '**/*.test.*'],
  future: {
    unstable_tailwind: true,
  },
  server: process.env.NETLIFY || process.env.NETLIFY_LOCAL ? './server.js' : undefined,
  serverBuildPath: '.netlify/functions-internal/server.js',
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
};
