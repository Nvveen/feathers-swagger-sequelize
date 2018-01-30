import { expect } from 'chai'
import Sequelize from 'sequelize'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import service from 'feathers-sequelize'

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
        .use('/users', service({ Model: User }))
      server = app.listen(12345, () => done())
    })
    after(done => server.close(done))
    it('should support basis functionality with a simple app', () => {
      console.log('app', app)
    })
  })
})
