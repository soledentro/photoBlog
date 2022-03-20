const express = require('express')
const req = require('express/lib/request')
const path = require('path')
const hbs = require('hbs')
const nanoid = require('nanoid')
const cookieParser = require('cookie-parser')
const { db } = require('./DB')
const { usersDB } = require('./usersDB')
const { clearCookie } = require('express/lib/response')
const { sessions } = require('./sessions')
const { checkAuth } = require('./src/middelwars/checkAuth')


const server = express()
const PORT = 3000


server.set('view engine', 'hbs')
server.set('views', path.join(process.cwd(), 'src', 'views'))
hbs.registerPartials(path.join(process.cwd(), 'src', 'views', 'partials'))

server.use(express.urlencoded({extended: true}))
server.use(cookieParser())
server.use(express.static(path.join(process.cwd(), 'public')))
server.use(express.json())
server.use((req, res, next) => {
  const sidFromUser = req.cookies.sid

  const currentSession = sessions[sidFromUser]

  if (currentSession) {
    const currentUser = usersDB.users.find((user) => user.email === currentSession.email)
    res.locals.name = currentUser.name
  }

  next()
})

server.get('/auth/signup', (req, res) => {
  res.render('signUp')
})

const idUser = nanoid
server.post('/auth/signup', (req, res) => {
  const {idUser, name, email, password} = req.body
  
  usersDB.users.push({
    idUser,
    name,
    email,
    password,
  })

  const sid = Date.now()

  sessions[sid] = {
    idUser,
    email,
  }

  res.cookie('sid', sid, {
    httpOnly: true,
    maxAge: 600e4,
  })

  res.redirect('/')
})


server.get('/auth/signin', (req, res) => {
  res.render('signIn')
})

server.post('/auth/signin', (req, res) => {
  const {email, password} = req.body

  const currentUser = usersDB.users.find((user) => user.email === email)
  if (currentUser) {
    if (currentUser.password === password) {
      const sid = Date.now()

      sessions[sid] = {
        idUser,
        email,
      }
    
      res.cookie('sid', sid, {
        httpOnly: true,
        maxAge: 600e4,
      })
      return res.redirect('/')
    }
  }
  res.redirect('/auth/signin')
})

server.get('/secret', (req, res) => { 
  res.render('secret')
})

server.get('/', checkAuth, (req, res) => {

  // const currentUser = usersDB.users.find((user) => user.email === email)
  // if (currentUser) {
    const postsQuery = req.query

    let postsForRender = db.postsMessage
  
    if (postsQuery.limit !== undefined && Number.isNaN(+postsQuery.limit) === false) {
      postsForRender = db.postsMessage.slice(0, postsQuery.limit)
    } else if (postsQuery.reverse !== undefined) { //Работает криво
      postsForRender = db.postsMessage.reverse()
    }

    return res.render('main', {listOfPosts: postsForRender})
  // } else {
  //   return res.render('/mainauto')
  // }

})


server.get('/main', (req, res) => { 
  res.render('main')
})


// server.post('/photobook', (req, res) => {
//   const newPost = req.body
//   db.postsMessage.push(newPost)

//   res.redirect('/')
// })

const idPost = nanoid
server.post('/photobook', (req, res) => {
  const {idUser, idPost, photo, post} = req.body
  
  db.postsMessage.push({
    idUser,
    idPost,
    photo,
    post,
  })

  res.redirect('/')
})

server.delete('/photobook/:id', (req, res) => {
  const currentId = usersDB.users.find((user) => user.idUser === id)

    if (currentId) {
      const { id } = req.body

      const onePhotoIndex = db.postsMessage.findIndex((postsMessage) => postsMessage.idPost === id)
      const onePhoto = db.postsMessage[onePhotoIndex]

      if (onePhoto) {
        if (onePhoto.idUser === currentId) {
          db.postsMessage.splice(onePhotoIndex, 1)
          res.sendStatus(200)
        }
        return res.sendStatus(403)
      }
    return res.sendStatus(401)
  }
})

// server.patch('/photobook/:id', (req, res) => {
//   const { id } = req.params
//   const { action } = req.body

//   if (action="delete") {
//    onePhoto.remove()
//   }

//   res.json({})

// })


server.get('/auth/signout/', (req, res) => {
  const sidFromUserCookie = req.cookies.sid
  
  delete sessions[sidFromUserCookie]
 
  res.clearCookie('sid')
  res.redirect('/')
 })

server.get('*', (req, res) => {
  res.render('404')
})

server.listen(PORT, () => {
  console.log(`Server has been started on port: ${PORT}`)
})


// server.get('/secret', checkAuth, (req, res) => { 
//   res.render('secret')
// })

// server.post('/auth/photobook', checkAuth, (req, res) => {
//   const newPost = req.body
//   db.postsMessage.push(newPost)

//   res.redirect('main')
// })


// server.get('/auth/main', (req, res) => { 
//   res.render('main')
// })
// // server.post('/auth/main', (req, res) => {
// //   const newPost = req.body
// //   db.postsMessage.push(newPost)

// //   res.redirect('main')
// // })