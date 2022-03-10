const { nanoid } = require("nanoid")
const { usersDB } = require("./usersDB")

const db = {
  postsMessage: [
    {
      // idUser: usersDB.users.idUser
      // idPost: nanoid
      photo: 'https://avatars.mds.yandex.net/i?id=2cac8eea95e2d083f3bb241e38c36076-5874989-images-thumbs&n=13&exp=1',
      post: 'Вчера видели енотов. Было очень круто!',
    },
    {
      // idUser: usersDB.users.idUser
      // idPost: nanoid
      photo: 'https://avatars.mds.yandex.net/i?id=bc83a617d46968a78185ea76cce8b7b4-5870008-images-thumbs&n=13&exp=1',
      post: 'Прошедшая выставка роботов нас очень удивила. А вы были на подобных мероприятиях?',
    },
  ],
}


module.exports = {
  db,
}

