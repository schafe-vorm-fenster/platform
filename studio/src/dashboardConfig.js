export default {
  widgets: [
      {
      name: 'netlify',
      options: {
        title: 'Deployment',
        sites: [
          {
            title: 'Develop Preview',
            apiId: 'e1e134fe-8327-43ad-b88c-7ffda1b61001',
            buildHookId: '5e6ba82e0e393cfeab7ca081',
            name: 'schafe-vorm-fenster-develop',
          },
          {
            title: 'Live Website',
            apiId: '66f0684d-1f14-4048-8a89-e55b09dd066c',
            buildHookId: '5e6ba886e61d60ffdda11b51',
            name: 'schafe-vorm-fenster-website'
          }
        ]
      }
    }
  ]
}