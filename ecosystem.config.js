module.exports = {
  apps: [
    {
      name: 'portfolio-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 7100
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 7100
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z'
    }
  ]
};