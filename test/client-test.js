'use strict'

const test = require('ava')
const platzigram = require('../')
const fixtures = require('./fixtures')
const nock = require('nock')

let options = {
  endpoints: {
    pictures: 'http://platzigram.test/picture',
    users: 'http://platzigram.test/user',
    auth: 'http://platzigram.test/auth'
  }
}

test.beforeEach(t => {
  t.context.client = platzigram.createClient(options)
})

test('client', t => {
  const client = t.context.client

  t.is(typeof client.getPicture, 'function', 'getPicture is a function')
  t.is(typeof client.savePicture, 'function', 'savePicture is a function')
  t.is(typeof client.likePicture, 'function', 'likePicture is a function')
  t.is(typeof client.listPictures, 'function', 'listPictures is a function')
  t.is(typeof client.listPicturesByTag, 'function', 'listPicturesByTag is a function')
  t.is(typeof client.saveUser, 'function', 'saveUser is a function')
  t.is(typeof client.getUser, 'function', 'getUser is a function')
  t.is(typeof client.auth, 'function', 'auth is a function')
})

test('getPicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()

  nock(options.endpoints.pictures)
    .get(`/${image.publicId}`)
    .reply(200, image)

  let result = await client.getPicture(image.publicId)

  t.deepEqual(image, result)
})

test('savePicture', async t => {
  const client = t.context.client

  let token = 'xxx-xxx-xxx'
  let image = fixtures.getImage()

  let newImage = {
    src: image.url,
    description: image.description
  }

  nock(options.endpoints.pictures, {
    reqheaders: {
      'authorization': `Bearer ${token}`
    }
  })
  .post('/', newImage)
  .reply(201, image)

  let result = await client.savePicture(newImage, token)

  t.deepEqual(image, result)
})

test('likePicture', async t => {
  const client = t.context.client

  let image = fixtures.getImage()
  image.liked = true
  image.likes = 1

  nock(options.endpoints.pictures)
    .post(`/${image.publicId}/like`)
    .reply(200, image)

  let result = await client.likePicture(image.publicId)

  t.deepEqual(image, result)
})

test('listPictures', async t => {
  const client = t.context.client

  let images = fixtures.getImages(3)

  nock(options.endpoints.pictures)
    .get('/list')
    .reply(200, images)

  let result = await client.listPictures()

  t.deepEqual(images, result)
})
