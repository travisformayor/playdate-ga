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
  {liker: '1',likes: '2'}, 
  {liker: '2',likes: '1'}, // mutual
  {liker: '2',likes: '5'}, 
  {liker: '5',likes: '2'}, // mutual
  {liker: '4',likes: '5'},
  {liker: '1',likes: '5'},
]

// To Do: switch this out with function that scans likings array
const mutualLikes = [
  {match_loginID: [1, 2]},
  {match_loginID: [2, 5]},
];

const messages = [
  'Hello there',
  'Oh, hi!',
  'I like parks',
  'Do you like belly rubs?',
  'What do you think of squirrels?',
  'I like sticks',
  'I love walks',
  'Squirrels are great',
  'Laps are the best'
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
    seedMatches(createdPets);
  })
};

function seedLikes(dbPets) {
  // Can't save the same liker twice during the forEach, get parallel save errors
  // So, get unique set of updated likers, and then save them once
  let updatedIds = new Set(); // Set doesn't allow duplicates

  // liking is a global var. See above.
  // Update the liker with there likes
  liking.forEach(like => {
    const liker =  dbPets.find(pet => pet.loginId == like.liker);
    const likes = dbPets.find(pet => pet.loginId == like.likes);
    console.log(`${liker.name} likes ${likes.name}.`);
    liker.likes.push(likes._id);
    updatedIds.add(liker); 
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

function seedMatches(dbPets) {
   // construct match inside the following array
   let seedMatch = {};
  
  // mutualLikes is a global var. See above.
  mutualLikes.forEach(match => {
    // Take mutualLikes and search for mongodb _ids'
    const liker1 =  dbPets.find(pet => pet.loginId == match.match_loginID[0]);
    const liker2 = dbPets.find(pet => pet.loginId == match.match_loginID[1]);
    console.log(`Mutual: ${liker1.name} likes ${liker2.name}.`);
  
    seedMatch.match = [];
    seedMatch.match.push(liker1._id);
    seedMatch.match.push(liker2._id);

    // construct and add on chat record
    // pick a random message
    // To Do: make it randomly pick how many chats they have and loop through this below
    const chat1 = messages[Math.floor(Math.random() * messages.length)];
    const chat2 = messages[Math.floor(Math.random() * messages.length)];

  
    // To Do: Trouble here. The chat schema inside the match schema, how to push that data
    seedMatch.chatId = [];
    seedMatch.chatId.messages = [];
    messageObj1 = {senderId: liker1._id, content: chat1};
    messageObj2 = {senderId: liker2._id, content: chat2};

    seedMatch.chatId.messages.push(messageObj1);
    seedMatch.chatId.messages.push(messageObj2);

    console.log('seed match object:');
    console.log(seedMatch);

    // CREATE Match in db
    db.Match.create(seedMatch, (err, createdMatch) => {
      if (err) {
        return console.log(`Error creating matches: ${err}`);
      }
      console.log(`Created match: ${createdMatch}`);
    });
  })
};