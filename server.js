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

// PUT update pet based on loginId
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

// DELETE delete pet based on loginId
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

// GET index matches, not used frontend
app.get('/api/matches', (req, res) => {
  db.Match.find()
    .exec((err, allMatches) => {
      if (err) return res.json({error: err});
      res.json(allMatches);
  })
});

// GET matches based on one user's loginId
// includes all user's chats
app.get('/api/matches/:id', (req, res) => {
  db.Pet.findOne({loginId: req.params.id})
    .exec((err, foundPet) => {
      if (err) {
        return res.json({error: err});
      } else if (foundPet === null) {
        res.json([]);
      } else {
        db.Match.find({match: foundPet._id})
          .exec((err, foundMatches) => {
            if (err) return res.json({error: err});
            res.json(foundMatches);
        })
      }
    })
});

// POST create new match
// and create new chat object
app.post('/api/matches', (req, res) => {
  // create a chat and add to the new match
  db.Chat.create({}, (err, createdChat) => {
    if (err) return res.json({error: err});

    db.Match.create(req.body, (err, createdMatch) => {
      if (err) return res.json({error: err});
      createdMatch.chatId = createdChat;
      createdMatch.save((err, savedMatch) => {
        if (err) return res.json({error: err});
        res.json(savedMatch)
      })
    })
  })
})

// POST liked someone
// 1. add like if not already liked
// 2. check for mutual likes and create a match
app.post('/api/like/:id', (req, res) => {
  const petId = req.params.id;
  const likedId = req.body.liked;
  
  if (likedId) {
    db.Pet.findOne({_id: petId}).exec((err, foundPet) => {
      if (err) return res.json({error: err});
      console.log(foundPet);

      // check if the like is already there
      if (foundPet.likes.includes(likedId)) {
        console.log('already liked');
        res.json({error: 'Already Liked'});
      } else {
        console.log('not liked yet');
        // 1.Record the like
        foundPet.likes.push(likedId);
        foundPet.save((err, savedLike) => {
          if (err) return res.json({error: err});
          res.json(savedLike)
        })
      }
    })
  }
})

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
