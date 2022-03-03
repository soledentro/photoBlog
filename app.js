const express = require('express')
const req = require('express/lib/request')
const path = require('path')
const { db } = require('./DB')

const PORT = 3000
const server = express()
server.set('view engine', 'hbs')
server.set('views', path.join(__dirname, 'src', 'views'))

server.use(express.urlencoded({extended: true}))

server.get('/', (req, res) => {
  const postsQuery = req.query

  let postsForRender = db.postsMessage
 
  if (postsQuery.limit !== undefined && Number.isNaN(+postsQuery.limit) === false) {
    postsForRender = db.postsMessage.slice(0, postsQuery.limit)
  }

  res.render('main', {listOfPosts: postsForRender})
})

server.post('/photobook', (req, res) => {
  const newPost = req.body
  db.postsMessage.push(newPost)

  res.redirect('/')
})

server.get('*', (req, res) => {
  res.render('404')
})

server.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})
