const express = require('express')
const req = require('express/lib/request')
const path = require('path')
const hbs = require('hbs')
const cookieParser = require('cookie-parser')
const { db } = require('./DB')
const { usersDB } = require('./usersDB')
const { clearCookie } = require('express/lib/response')
const { sessions } = require('./sessions')
const { checkAuth } = require('./src/middelwars/checkAuth')
const { nanoid } = require('nanoid')


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

server.post('/auth/signup', (req, res) => {
  const {name, email, password} = req.body
  
  let newUser = usersDB.users.push({
    name,
    email,
    password,
  })
  console.log("новый юзер", newUser)

  const sid = Date.now()

  sessions[sid] = {
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
  console.log("текущий юзер при входе", currentUser)
  if (currentUser) {
    if (currentUser.password === password) {
      const sid = Date.now()

      sessions[sid] = {
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
    const postsQuery = req.query

    let postsForRender = db.postsMessage
  
    if (postsQuery.limit !== undefined && Number.isNaN(+postsQuery.limit) === false) {
      postsForRender = db.postsMessage.slice(0, postsQuery.limit)
    } 
    
    if (postsQuery.reverse === '') {
      postsForRender = postsForRender.reverse()
    }

    return res.render('main', {listOfPosts: postsForRender})
})

server.get('/main', (req, res) => { 
  res.render('main')
})


server.post('/photobook', (req, res) => {
  const currentUser = req.session?.user?.email
  console.log("текущий юзер", currentUser)
  const {photo, post} = req.body
  const userId = { id: currentUser }
  console.log("юзер id", userId)
  
  let newPost = db.postsMessage.push({
    idPost: nanoid(),
    userId,
    photo,
    post,
  })
  console.log("новый пост", newPost)

  res.redirect('/')
})

server.delete('/photopost', (req, res) => {
  const currentUserId = req.session?.user?.email
  const { id } = req.body
  console.log({ id })
  const onePhotoIndex = db.postsMessage.findIndex((postsMessage) => postsMessage.id === id)
  const onePhoto = db.postsMessage[onePhotoIndex]
  const currentPostId = onePhoto.id

  if (currentPostId == currentUserId) {
          db.postsMessage.splice(onePhotoIndex, 1)
          return res.sendStatus(200)       
    } else { 
      return res.sendStatus(403)
  }
}
)

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