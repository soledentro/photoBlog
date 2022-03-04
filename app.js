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
  } else if (postsQuery.reverse !== undefined) { //вариант 3. Работает криво
    postsForRender = db.postsMessage.reverse()
  }

  res.render('main', {listOfPosts: postsForRender})

//вариант 1
  // let reversePhoto = db.postsMessage.reverse()
  // if (postsQuery.reverse === true) {
  //   res.render('main', {listOfPeople: reversePhoto})
  // } 
})


//вариант 2
// server.get('/', (req, res) => {
//   const postsRevQuery = req.query.reverse
//   let reversePhoto = db.postsMessage
//   if (postsRevQuery.reverse === true) {
//     reversePhoto = db.postsMessage.reverse()
//   } 
//   res.render('main', {listOfPeople: reversePhoto})
// })


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
