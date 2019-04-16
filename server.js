const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

// database
const db = require('./models');

// bodyparser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// serve static assets
app.use(express.static(__dirname + '/public'));

// ------ TEST DATA ------
// test pets
// _id is hardcoded as a string for now, since _id will be auto-generated by mongoDB
const pets = [
  {
    _id: 'j4k41o10an',
    loginId: 1,
    name: 'Lucky',
    type: 'cat',
    age: 4,
    bio: `This is test data I don't know what you want from me`,
    img: './public/images/lucky.jpg',
    likes: ['ih9a0dz', '1km1vca9x0f'] // should create match with ih9a0dz
  },
  {
    _id: 'ih9a0dz',
    loginId: 2,
    name: 'Oreo',
    type: 'cat',
    age: 5,
    bio: `It was the 'blurst' of times?! You stupid monkey!`,
    img: './public/images/oreo.jpg',
    likes: ['j4k41o10an'] // should create a match
  },
  {
    _id: '0jdnbl1jaz',
    loginId: 3,
    name: 'Badger',
    type: 'dog',
    age: 3,
    bio: `I'm a doggo!`,
    img: './public/images/oreo.jpg',
    likes: [] // for testing when a pet has no liked pets
  },
  {
    _id: '1km1vca9x0f',
    loginId: 4,
    name: 'Moxie',
    type: 'dog',
    age: 4,
    bio: `Here's lookin' at you, kid.`,
    img: './public/images/moxie.jpg',
    likes: ['ih9a0dz'] // should not result in any matches
  }
];

// test matches
const matches = [
  {
    _id: '1k441z0',
    match: ['j4k41o10an', 'ih9a0dz'],
    chatId: '014lmb3'
  }
];

// test chat history
const chats = [
  {
    _id: '014lmb3',
    messages: [{
        _id: 'b19jcz7',
        senderId: 'j4k41o10an',
        time: 1555365744082,
        content: 'wut u doin?'
      },
      {
        _id: 'llm89z',
        senderId: 'ih9a0dz',
        time: 1555365936326,
        content: 'nm u?'
      }
    ]
  }
];

// ------ ROUTES ------
// root route; show the sniff page not logged in
app.get('/', (req, res) => {
  res.sendFile('/views/sniff.html', {root: __dirname});
});

// profile route
app.get('/profile/:loginid', (req, res) => {
  res.sendFile('/views/profile.html', {root: __dirname});
});

// sniff route logged in
app.get('/sniff/:loginid', (req, res) => {
  res.sendFile('/views/sniff.html', {root: __dirname});
})

// chat route
app.get('/chat/:loginid', (req, res) => {
  res.sendFile('/views/chat.html', {root: __dirname});
});

// ------ API ROUTES ------
// GET index pets
app.get('/api/pets', (req, res) => {
  db.Pet.find()
    .exec((err, allPets) => {
      if (err) return res.json({error: err});
      res.json(allPets);
    })
});

// GET show pet - gets one pet based on loginId
app.get('/api/pets/:id', (req, res) => {
  const login = req.params.id;
  if (isNum(login)) {
    db.Pet.findOne({loginId: login})
      .exec((err, foundPet) => {
        if (err) return res.json({error: err});
        res.json(foundPet);
    })
  } else {
    res.status(404).send('Please enter a numeric Pet ID');
  }
});

// POST create new pet
app.post('/api/pets', (req, res) => {
  db.Pet.create(req.body, (err, createdPet) => {
      if (err) return res.json({error: err});
      res.json(createdPet);
  })
})

// PUT update pet
app.put('/api/pets/:id', (req, res) => {
  const login = req.params.id;
  if (isNum(login)) {
    db.Pet.updateOne({loginId: login}, req.body, (err, updatedPet) => {
      if (err) return res.json({error: err});
      res.json(updatedPet);
    })
  } else {
    res.status(404).send('Please enter a numeric Pet ID');
  }
})

// DELETE delete pet
app.delete('/api/pets/:id', (req, res) => {
  const login = req.params.id;
  if (isNum(login)) {
    db.Pet.deleteOne({loginId: login}, (err, deleteMsg) => {
      if (err) return res.json({error: err});
      res.json(deletedMsg);
    })
  } else {
    res.status(404).send('Please enter a numeric Pet ID');
  }
})

// GET index matches
app.get('/api/matches', (req, res) => {
//  res.json(matches);
db.Match.find()
  .exec((err, allPets) => {
    if (err) return res.json({error: err});
    res.json(allPets);
  })
});

// GET show match
app.get('/api/matches/:id', (req, res) => {
  let id = req.params.id;
  let foundMatch;
  // loops through matches array and finds if its _id is equal to passed id
  matches.forEach((match) => {
    match._id === id ? foundMatch = match : null;
  });
  if (foundMatch) {
    res.json(foundMatch);
  } else {
    res.send(`Cannot find match with ID ${id}.`);
  }
});

// GET index chats
app.get('/api/chats', (req, res) => {
  res.json(chats);
});

// GET show chat - shows one chat history based on id
app.get('/api/chats/:id', (req, res) => {
  let id = req.params.id;
  let foundChat;
  // loops through chats array and finds if its _id is equal to passed id
  chats.forEach((chat) => {
    chat._id === id ? foundChat = chat : null;
  });
  if (foundChat) {
    res.json(foundChat);
  } else {
    res.send(`Cannot find chat with ID ${id}.`);
  }
});

// root route with loginid, redirect to /profile
// adding as last as it's a greedy match
app.get('/:loginid', (req, res) => {
  const login = req.params.loginid;
  if (isNum(login)) {
    res.redirect(302, `/profile/${login}`);
  } else {
    res.sendStatus(404);
  }
})

// is input string numeric
function isNum(str) {
  const regEx = RegExp('^\\d+$');
  return regEx.test(str);
}

// start server
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
