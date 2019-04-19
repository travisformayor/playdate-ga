const db = require('./models');

// Declare seed pet data
const seedPets = [
  {loginId: 1, name: 'Badger', img: 'badger.jpg', age: '72', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 2, name: 'Bailey', img: 'bailey.jpg', age: '132', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 3, name: 'Bedelia', img: 'bedelia.jpg', age: '7', type: 'Bearded Dragon', bio: 'Placeholder Bio.', likes: []},
  {loginId: 4, name: 'Coraline', img: 'coraline.jpg', age: '24', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 5, name: 'Dakota', img: 'dakota.jpg', age: '132', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 6, name: 'Frodo', img: 'frodo.jpg', age: '6', type: 'Gecko', bio: 'Placeholder Bio.', likes: []},
  {loginId: 7, name: 'Indiana Bones', img: 'indianabones.jpg', age: '5', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 8, name: 'King Bee', img: 'kingbee.jpg', age: '1', type: 'Ducky', bio: 'Quack. Placeholder Bio.', likes: []},
  {loginId: 9, name: 'Lucky', img: 'lucky.jpg', age: '60', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 10, name: 'Moxie', img: 'moxie.jpg', age: '120', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 11, name: 'Nadia', img: 'nadia.jpg', age: '84', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 12, name: 'Oreo', img: 'oreo.jpg', age: '60', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 13, name: 'Orpheus', img: 'orpheus.jpg', age: '24', type: 'Tortoise', bio: 'Placeholder Bio.', likes: []},
  {loginId: 14, name: 'Penelope', img: 'penelope.jpg', age: '24', type: 'Cat', bio: 'Meow. Placeholder Bio.', likes: []},
  {loginId: 15, name: 'Persephone', img: 'persephone.jpg', age: '4', type: 'Gecko', bio: 'Placeholder Bio.', likes: []},
  {loginId: 16, name: 'Sabriel', img: 'sabriel.jpg', age: '84', type: 'Ball Python', bio: 'Placeholder Bio.', likes: []},
  {loginId: 17, name: 'Sierra', img: 'sierra.jpg', age: '96', type: 'Dog', bio: 'Woof. Placeholder Bio.', likes: []},
  {loginId: 18, name: 'Smaug', img: 'smaug.jpg', age: '10', type: 'Bearded Dragon', bio: 'Placeholder Bio.', likes: []},
  {loginId: 19, name: 'Venus', img: 'venus.jpg', age: '4', type: 'Rosy Boa', bio: 'Placeholder Bio.', likes: []}
];

const liking = [
  {id: 1, likes: [2, 5, 12]},
  {id: 2, likes: [1, 5, 12]}, // mutual
  {id: 3, likes: [10, 12]},
  {id: 4, likes: [8, 12]},
  {id: 5, likes: [2, 12]}, // mutual
  {id: 8, likes: [4]}, // mutual
  {id: 9, likes: [18]},
  {id: 10, likes: [3]}, // mutual
  {id: 18, likes: [9]}, // mutual
  {id: 12, likes: [1, 2, 3, 4, 5]}, // all mutual
]

// To Do: switch this out with function that scans likings array
const mutualLikes = findMatches(liking);

const messages = [
  'Hello there', 'Oh, hi!', 'I like parks',
  'Do you like belly rubs?', 'What do you think of squirrels?',
  'I like sticks', 'I love walks', 'Squirrels are great',
  'Laps are the best', 'Smell you later!', 'How was your nap',
  'Humans sure do strange things', 'I like naps', 'Ball!'
]

// DELETE all existing data from collections in order of dependency
// DELETE all Matches
db.Match.deleteMany({}, (err, deletedMatches) => {
  if (err) {
    console.log(`Error deleting matches: ${err}`);
    return;
  }
  console.log(`Removed all pets: ${JSON.stringify(deletedMatches)}`);
  // DELETE all Chats
  db.Chat.deleteMany({}, (err, deletedChats) => {
    if (err) {
      console.log(`Error deleting chats: ${err}`);
      return;
    }
    console.log(`Removed all matches: ${JSON.stringify(deletedChats)}`);
    // DELETE all Pets
    db.Pet.deleteMany({}, (err, deletedPets) => {
      if (err) {
        console.log(`Error deleting pets: ${err}`);
        return;
      }
      console.log(`Removed all chats: ${JSON.stringify(deletedPets)}`);
      // Successfully cleared all collections
      // Can now insert seed data
      seedCollections(); 
    });
  });
});

// CREATE all seed data in collections
function seedCollections() {
  // CREATE all Pets
  db.Pet.create(seedPets, (err, createdPets) => {
    if (err) {
      console.log(`Error creating pets: ${err}`);
      return;
    }
    console.log(`Created ${createdPets.length} pets: ${createdPets}`);
    seedLikes(createdPets);
    createMatchAndChat(createdPets);
  })
};

function seedLikes(dbPets) {
  // Can't save the same liker twice during the forEach, get parallel save errors
  // So, get unique set of updated likers, and then save them once
  let updatedIds = new Set(); // Set doesn't allow duplicates

  // liking is a global var. See above.
  // Update the liker with there likes
  liking.forEach(like => {
    const liker =  dbPets.find(pet => pet.loginId == like.id);
    like.likes.forEach( liked => {
      const likes = dbPets.find(pet => pet.loginId == liked);
      console.log(`${liker.name} likes ${likes.name}.`);
      liker.likes.push(likes._id);
      updatedIds.add(liker); 
    })
  })
  // Save each updated liker once
  updatedIds.forEach(pet => {
    pet.save((err, savedLike) => {
      if (err) { return console.log(err); } 
      else { 
        console.log(`Updated likes for ${savedLike.name}`);
      }
    });
  });
};

function createMatchAndChat(dbPets) {
  // construct match and chat log inside the following objects
  let seedMatch = [];
  let matchCounter = 0;
  // mutualLikes is a global var. See above.
  mutualLikes.forEach(match => {
    // Take mutualLikes and search for mongodb _ids'
    const likers = [];
    likers[0] =  dbPets.find(pet => pet.loginId == match.match_loginID[0]);
    likers[1] = dbPets.find(pet => pet.loginId == match.match_loginID[1]);
    console.log(`Mutual: ${likers[0].name} likes ${likers[1].name}.`);
  
    seedMatch[matchCounter] = {match: [], chatId: {}};
    seedMatch[matchCounter].match.push(likers[0]._id);
    seedMatch[matchCounter].match.push(likers[1]._id);

    // construct messages for match chat
    let messageCount = Math.floor(Math.random() * 10) + 1; // random number between 1 and 10
    let chatObj = {};
    chatObj.messages = [];
    for(let i = 1; i <= messageCount; i++) {
      let message = {};
      const sender = Math.round(Math.random()); // random between 0 and 1;
      message.senderId = likers[sender]._id;
      message.content = messages[Math.floor(Math.random() * messages.length)];
      chatObj.messages.push(message);
    }
    console.log('chat object:');
    console.log(chatObj);
    seedMatch[matchCounter].chatId = chatObj;

    console.log(`match count: ${matchCounter}`);
    matchCounter++;
  })
  createMatch(seedMatch);
};

function createMatch(seedMatch) {
  seedMatch.forEach( match => {
    db.Chat.create(match.chatId, (err, createdChat) => {
      if (err) {
        console.log(`Error creating chats: ${err}`);
        return;
      }
      console.log(`Created chat: ${createdChat._id}`);
      match.chatId = {}; // empty it out so can create match without it (they are already in Chat)

      db.Match.create(match, (err, createdMatch) => {
        if (err) {
          console.log(`Error creating match: ${err}`);
          return;
        }
        createdMatch.chatId = createdChat;  // put the chat object into the match
        console.log(`Added chat: ${createdMatch.chatId._id}`);
        createdMatch.save((err, savedMatch) => {
          if (err) {
            console.log(`Error saving match: ${err}`);
            return;
          }
          console.log(`Saved match: ${savedMatch._id}`);
        })
      })
    })
  })
}

function findMatches(arr) {
  let newArr = [];
  for (let i = 0; i < arr.length; i++){
    arr[i].likes.forEach(likeId => {
      // set a second iterator to 1 higher than the original iterator,
      // since we only need to loop through everything past the current entry
      for (let c = i + 1; c < arr.length; c++){
        if (likeId === arr[c].id && arr[c].likes.includes(arr[i].id)) {
          newArr.push({match_loginID: [arr[i].id, arr[c].id]});
        }
      };
    });
  };
  return newArr;
}