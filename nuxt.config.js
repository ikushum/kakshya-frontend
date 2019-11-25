import fs from 'fs'
export default {
  mode: 'spa',
  server: {
    https: {
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }
  },
  head: {
    title: 'Kakshya',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A virtual classroom' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#fff' },
  css: [],
  plugins: [],
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  axios: {
    baseURL: 'http://localhost:3001'
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/signin', method: 'post', propertyName: 'token' },
          logout: false,
          user: { url: '/api/me', method: 'get', propertyName: 'user' }
        }
      }
    },
    redirect: {
      login: '/accounts/login',
      logout: '/accounts/login',
      home: '/'
    }
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#63b5f6'
        }
      }
    }
  },
  build: {
    extend () {}
  }
}
