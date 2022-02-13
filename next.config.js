module.exports = {
  async rewrites() {
    return [
      {
        source: '/:username(@.+)',
        destination: '/profile?username=:username', // Matched parameters can be used in the destination
      },
      {
        source: '/hail/:username(@.+)',
        destination: '/hail?driver=:username', // Matched parameters can be used in the destination
      },
    ]
  },
}
