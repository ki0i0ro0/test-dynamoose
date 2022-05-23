const express = require('express')
const bodyParser = require('body-parser')
const dynamoose = require('dynamoose')
const _ = require('lodash')
dynamoose.aws.sdk.config.update({
  accessKeyId: 'AKID',
  secretAccessKey: 'SECRET',
  region: 'us-east-1',
})
dynamoose.aws.ddb.local()
const Todo = dynamoose.model(
  'Todo',
  {
    userId: {
      type: String,
      hashKey: true,
    },
    createdAt: {
      type: String,
      rangeKey: true,
    },
    updatedAt: String,
    title: String,
    content: String,
  },
  {
    create: true, // Create a table if not exist,
  },
)

const router = express()
const port = 3000
// urlencodedとjsonは別々に初期化する
router.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
router.use(bodyParser.json())

router.get('/', (req, res, next) => {
  const userId = 'aaa'
  let lastKey = req.query.lastKey

  return Todo.query('userId')
    .eq(userId)
    .exec((err, result) => {
      if (err) return next(err, req, res, next)

      res.status(200).json(result)
    })
})

router.get('/:createdAt', (req, res, next) => {
  const userId = res.locals.userId
  const createdAt = String(req.params.createdAt)

  return Todo.get({ userId, createdAt }, function (err, result) {
    if (err) return next(err, req, res, next)

    res.status(200).json(result)
  })
})

router.post('/', (req, res, next) => {
  const body = req.body
  console.log(req.body)
  body.createdAt = new Date().toISOString()
  body.updatedAt = new Date().toISOString()
  body.userId = body.userId
  res.locals.userId = body.userId
  req.query.lastKey = body.createdAt
  return new Todo(body).save((err, result) => {
    if (err) return next(err, req, res, next)

    res.status(201).json(result)
  })
})

// router.put('/:createdAt', (req, res, next) => {
//   const userId = res.locals.userId
//   const createdAt = req.params.createdAt
//   const body = req.body

//   if (body.createdAt) delete body.createdAt

//   body.updatedAt = new Date().toISOString()

//   return new Todo(
//     _.assign(body, {
//       userId,
//       createdAt,
//     }),
//   ).save((err, result) => {
//     if (err) return next(err, req, res, next)

//     res.status(200).json(result)
//   })
// })

// router.delete('/:createdAt', (req, res, next) => {
//   const createdAt = req.params.createdAt
//   const userId = res.locals.userId

//   if (!createdAt) return res.status(400).send('Bad request. createdAt is undefined')

//   return Todo.delete(
//     {
//       userId,
//       createdAt,
//     },
//     (err) => {
//       if (err) return next(err, req, res, next)

//       res.status(204).json()
//     },
//   )
// })

router.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
