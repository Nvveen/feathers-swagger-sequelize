import 'babel-polyfill'
import chai, { expect } from 'chai'
import chaiThings from 'chai-things'
import Sequelize from 'sequelize'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import service from 'feathers-sequelize'
import swagger from 'feathers-swagger'
import fetch from 'isomorphic-fetch'
import generateSwagger from '../lib/index'
chai.should()
chai.use(chaiThings)

describe('feathers-swagger-sequelize', () => {
  describe('basic functionality', () => {
    let server
    let app
    before(done => {
      const sequelize = new Sequelize('null', 'null', 'null', {
        storage: ':memory:',
        dialect: 'sqlite'
      })
      const User = sequelize.define(
        'users',
        {
          email: {
            type: Sequelize.STRING,
            description: 'An email-adres'
          },
          password: {
            type: Sequelize.STRING,
            description: 'A password'
          }
        },
        {
          description: 'A user'
        }
      )
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
        .use('/users', service({ Model: User }))
        .configure(generateSwagger)
      server = app.listen(12345, () => done())
    })
    after(done => server.close(done))
    it('should support basis functionality with a simple app', async () => {
      const res = await fetch('http://localhost:12345/docs')
      await res.json()
    })
    it('should set the description from the model', async () => {
      const res = await fetch('http://localhost:12345/docs')
      const data = await res.json()
      expect(data).to.have.nested.property(
        'definitions.users.properties.email.description',
        'An email-adres'
      )
      expect(data).to.have.nested.property(
        'definitions.users.properties.password.description',
        'A password'
      )
      expect(data)
        .to.have.property('tags')
        .that.is.an('array')
        .to.include.something.that.has.property('description', 'A user')
    })
  })
})
