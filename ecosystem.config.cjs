// PM2 process manager configuration for production
// Start: pm2 start ecosystem.config.cjs
// Save + autostart on reboot: pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: "launchsite-api",
      script: "./artifacts/api-server/dist/index.mjs",
      interpreter: "node",
      interpreter_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: 8080,
      },
      error_file: "/var/log/launchsite/api-error.log",
      out_file: "/var/log/launchsite/api-out.log",
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
    {
      name: "launchsite-router",
      script: "./artifacts/site-router/dist/index.mjs",
      interpreter: "node",
      interpreter_args: "--enable-source-maps",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        CLIENTS_DIR: "/var/www/clients",
        MAIN_DOMAIN: "launchsite.certxa.com",
      },
      error_file: "/var/log/launchsite/router-error.log",
      out_file: "/var/log/launchsite/router-out.log",
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
