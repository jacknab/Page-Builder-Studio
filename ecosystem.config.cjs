// PM2 process manager configuration for production
// Start:          pm2 start ecosystem.config.cjs
// Reload updates: pm2 reload ecosystem.config.cjs --update-env
// Save + reboot:  pm2 save && pm2 startup
//
// env_file loads .env so DATABASE_URL, JWT_SECRET, MAILGUN_* etc.
// are available on first start AND after server reboots.

module.exports = {
  apps: [
    {
      name: "launchsite-api",
      script: "./artifacts/api-server/dist/index.mjs",
      interpreter: "node",
      interpreter_args: "--enable-source-maps",
      env_file: ".env",
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
      env_file: ".env",
      env: {
        NODE_ENV: "production",
        PORT: 3002,
        CLIENTS_DIR: "/var/www/clients",
        MAIN_DOMAIN: "launchsite.certxa.com",
        TEMPLATE_DIST: "./artifacts/nail-salon-template/dist",
      },
      error_file: "/var/log/launchsite/router-error.log",
      out_file: "/var/log/launchsite/router-out.log",
      time: true,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
