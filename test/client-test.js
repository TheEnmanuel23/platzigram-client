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