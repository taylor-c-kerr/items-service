module.exports = {
  apps: [{
    name: 'items-service',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-3-19-56-126.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/items.pem',
      ref: 'origin/master',
      repo: 'git@github.com:tck14/items-service.git',
      path: '/home/ubuntu/items-service',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
