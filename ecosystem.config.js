module.exports = {
  apps: [{
    name: 'fliegercamp',
    script: 'npm',
    args: 'start',
    cwd: /var/www/vhosts/fliegercamp.de/httpdocs/app',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/fliegercamp/error.log',
    out_file: '/var/log/fliegercamp/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    time: true
  }]
};
