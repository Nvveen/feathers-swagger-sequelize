# feathers-swagger-sequelize

[![Greenkeeper badge](https://badges.greenkeeper.io/Nvveen/feathers-swagger-sequelize.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/Nvveen/feathers-swagger-sequelize.svg?branch=master)](https://travis-ci.org/Nvveen/feathers-swagger-sequelize)

> Use `feathers-swagger` and `(feathers-)sequelize` to add documentation from the models
> directly to Swagger

This version is configured to work with Swagger UI 3.x

## Installation

```
npm install feathers feathers-swagger feathers-sequelize  feathers-swagger-sequelize
```

### Basic example

```js
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import service from 'feathers-sequelize'
import swagger from 'feathers-swagger'
import Sequelize from 'sequelize'
import generateSwagger from 'feathers-swagger-sequelize'

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
const app = express(feathers())
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
app.listen(12345)
```

Go to `localhost:12345` to see the generated documentation.

# License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE)
