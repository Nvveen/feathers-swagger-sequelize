import 'babel-polyfill'
import { expect } from 'chai'
import Sequelize from 'sequelize'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import service from 'feathers-sequelize'
import swagger from 'feathers-swagger'
import fetch from 'isomorphic-fetch'
import generateSwagger from '../lib/index'

describe('feathers-swagger-sequelize', () => {
  describe('basic functionality', () => {
    let server
    let app
    before(done => {
      const sequelize = new Sequelize('null', 'null', 'null', {
        storage: ':memory:',
        dialect: 'sqlite'
      })
      const User = sequelize.define('users', {
        email: Sequelize.STRING,
        password: Sequelize.STRING
      })
      app = express(feathers())
        .configure(express.rest())
        .configure(
          swagger({
            docsPath: '/docs',
            info: {
              title: 'API Documentation',
              description: 'API Documentation'
            }
          })
        )
        .configure(generateSwagger)
        .use('/users', service({ Model: User }))
      server = app.listen(12345, () => done())
    })
    after(done => server.close(done))
    it('should support basis functionality with a simple app', async () => {
      const res = await fetch('http://localhost:12345/docs')
      const data = await res.json()
      console.log('data', data)
    })
  })
})
