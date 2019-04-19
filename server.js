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
  res.sendFile('/views/index.html', {root: __dirname});
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

// GET a pets info and details about all their mutual matches
// Gets matches based on one user's loginId
// Includes all user's chats
// 1. get all matches
app.get('/api/matches/:id', (req, res) => {
  // Find the pet document
db.Pet.findOne({loginId:  req.params.id})
  .catch(err => res.json({error: err}))
  .then(foundPet => {
    if (foundPet === null) {
      res.json({error: 'null'});
    } else {
      // 2. Find all their matches
      db.Match.find({match: foundPet._id})
        .catch(err => res.json({error: err}))
        .then(foundMatches => {
          if (foundMatches === null) {
            res.json({error: 'null'});
          } else {
            // 3a. remove requestor pet
            let matchIds = [];
            foundMatches.forEach(match => {
              const petIdIndex = match.match.indexOf(foundPet._id);
              match.match.splice(petIdIndex, 1);
              // 3b. get list of match ids
              matchIds.push(match.match);
            })
            // 4. search all match ids and get their pet info
            db.Pet.find({_id: matchIds})
            .catch(err => res.json({error: err}))
            .then(foundPets => {
              if (foundPets === null) {
                res.json({error: 'null'});
              } else {
                // 5. construct response.
                // foundMatches + foundPets info
                foundMatches.forEach(match => {
                  const pet =  foundPets.find(pet => pet._id == match.match[0]);
                  match.match[0] = {
                    id: pet._id,
                    name: pet.name,
                    img: pet.img
                  };
                })
                // 6. send match + requester pet json
                foundPet.likes = '';
                foundPet.likes[0] = {foundMatches};
                // foundPet.likes = foundMatches;
                res.json(foundPet);
              }
            })
          }
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
// 2. check for mutual likes
// 3. create a match, with embedded chat
app.post('/api/like/:id', (req, res) => {
  const petId = req.params.id;
  const likedId = req.body.liked;

  if (likedId) {
    db.Pet.findOne({_id: petId})
      .catch(err => res.json({error: err}))
      .then(foundPet => {
        if (foundPet === null) {
          res.json({error: 'null'});
        }
      // check if the like is already there
      if (foundPet.likes.includes(likedId)) {
        res.json({error: 'Already Liked'});
      } else {
        // 1.Record the like
        foundPet.likes.push(likedId);
        foundPet.save((err, savedLike) => {
          if (err) return res.json({error: err});
        })

        // 2. Find if it's a mutual match
        db.Pet.findOne({_id: likedId}).exec((err, foundLike) => {
          if (err) return res.json({error: err});

          if (foundLike.likes.includes(petId)) {

            // 3. Create a match with embedded blank chat
            // 3.a) create a blank chat and add to the new match
            db.Chat.create({}, (err, createdChat) => {
              if (err) return res.json({error: err});

              const matchObj = {};
              matchObj.match = [petId, likedId];

              db.Match.create(matchObj, (err, createdMatch) => {
                if (err) return res.json({error: err});
                createdMatch.chatId = createdChat;
                createdMatch.save((err, savedMatch) => {
                  if (err) return res.json({error: err});
                  res.json(savedMatch);
                })
              })
            })
          } else {
            // Not mutual, but still a like
            res.json(foundPet.likes);
          }
        })
      }
    })
  }
})

// POST route - creates a new message in a chat and adds it to message history
app.post('/api/message/:chatid', (req, res) => {
  const chatId = req.params.chatid;
  const senderId = req.body.senderId;
  const content = req.body.content;

  // find chat in the database
  db.Chat.findOne({_id:  chatId})
  .catch(err => res.json({error: err}))
  .then(foundChat => {
    if (foundChat === null) {
      res.json({error: 'null'});
    } else {
      // push the message object to the chatId.messages array
      foundChat.messages.push({
        senderId: senderId,
        content: content
      });
      foundChat.save((err, savedChat) => {
        if (err) res.json({error: err});
        res.json(savedChat);
      });
    };
  })
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