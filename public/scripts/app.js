console.log('sanity check');
// get the profile loginID from the URL
const url = window.location.href;
const id = parseInt(url.substring(url.lastIndexOf('/') + 1));

getProfile(id);

// get profile for the pet
function getProfile(id) {
  // make ajax call
  let api = '/api/pets/' + id;
  $.ajax({
    method: 'GET',
    url: api,
    success: handleSuccess,
    error: handleError
  });
  // populate a pet object from ajax call
  function handleSuccess(res) {
    // check to see if the response object actually has an entry (in this case name, but anything can be used)
    // if not, return error
    // without this, it will be read as a success and will populate the HTML with undefineds
    if (res.name) {
      let pet = res;
      // properly format pet age into year or year and months
      let petFormattedAge;
      if (pet.age > 12) {
        if (pet.age % 12 === 0) {
          petFormattedAge = `${pet.age / 12} years`
        } else {
          petFormattedAge = `${pet.age / 12 } years ${pet.age % 12} months`;
        }
      } else {
        petFormattedAge = `${pet.age} months`;
      }
      // generate HTML for page and then append to main
      let petHTML = `
      <h1>Profile</h1>
      <div class="profile card text-center">
        <img src="/images/${pet.img}" class="card-img-top" alt="..." id="pet-image">
        <div class="card-body">
          <h2 class="card-title">
            <span class="bold" id="name">${pet.name}</span>
            <span> the </span>
            <span class="bold" id="type">${pet.type}</span>
            <i class="fas fa-edit edit-title"></i>
          </h2>

          <p class="card-text" id="bio">${pet.bio}
            <i class="fas fa-edit edit-bio"></i>
          </p>
        </div>

        <ul class="list-group list-group-flush">
          <li class="list-group-item stats">
            <span class="bold prop">Age</span>
            <span class="stat">${petFormattedAge}</span>
            <i class="fas fa-edit edit-stat"></i>
          </li>
        </ul>
      `;
      $('main').append(petHTML);
      // add event listeners for editing
      $('.card').on('click', '.fas.fa-edit', editItem);
      $('.card').on('submit', '.editor', saveItem);
      // add thumb icon to nav
      $('nav .profile-icon').css('background-image', `url(/images/thumb/${pet.img})`);
      // add ID-specific links to header
      $('#profile-link').attr('href', `/profile/${pet.loginId}`);
      $('#sniff-link').attr('href', `/sniff/${pet.loginId}`);
      $('#chat-link').attr('href', `/chat/${pet.loginId}`);
    } else {
      handleError(res);
    }
  };
  // handle a failure
  function handleError(err) {
    let error = `<h1>Error retrieving pet information. Please try again.</h1>`;
    $('main').append(error);
  };
}

function editItem() {
  if ($(this).hasClass('edit-title')) {
    const nameText = $(this).siblings('#name').text().trim();
    const typeText = $(this).siblings('#type').text().trim();

    const clickedItem = $(this).parent();
    clickedItem.html(`
      <form class="editor title">
        <input type="text" id="name" value="${nameText}">
        <input type="text" id="type" value="${typeText}">
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
      `);
    clickedItem.find('input:first-child').focus();
  } else if ($(this).hasClass('edit-bio')) {
    const bioText = $(this).parent('#bio').text().trim();

    const clickedItem = $(this).parent();
    clickedItem.html(`
      <form  class="editor bio">
        <textarea id="biotext" rows="4"></textarea>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
      `);
    $('#biotext').val(bioText);
    clickedItem.find('textarea:first-child').focus();

  } else if ($(this).hasClass('edit-stat')) {
    const statProperty = $(this).siblings('.prop').text().trim();
    const statText = $(this).siblings('.stat').text().trim();

    const clickedItem = $(this).parent();
    clickedItem.html(`
      <form class="editor stat">
        <span class="bold prop">${statProperty}</span>
        <input type="text" id="${statProperty}" value="${statText}">
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
      `);
    clickedItem.find('input').focus();
  }
}

function saveItem(e) {
  e.preventDefault();

  if ($(this).hasClass('title')) {
    const nameText = $(this).children('#name').val().trim();
    const typeText = $(this).children('#type').val().trim();
    // create obj to pass to editProfile
    let editObj = {
      name: nameText,
      type: typeText
    };
    editProfile(editObj);

    const submitItem = $(this).parent();
    submitItem.html(`
      <span class="bold" id="name">${nameText}</span>
      <span> the </span>
      <span class="bold" id="type">${typeText}</span>
      <i class="fas fa-edit edit-title"></i>
      `);
  } else if ($(this).hasClass('bio')) {

    const bioText = $(this).children('#biotext').val().trim();
    // create obj to pass to editProfile
    let editObj = {
      bio: bioText,
    };
    editProfile(editObj);

    const submitItem = $(this).parent();
    submitItem.html(`
      ${bioText}
      <i class="fas fa-edit edit-bio"></i>
      `);
  } else if ($(this).hasClass('stat')) {

    const statText = $(this).children('input').val().trim();
    const propText = $(this).children('span').text().trim();

    const submitItem = $(this).parent();
    submitItem.html(`
      <span class="bold prop">${propText}</span>
      <span class="stat">${statText}</span>
      <i class="fas fa-edit edit-stat"></i>
      `);
  }
}

// update profile via PUT: /api/pets/:id
function editProfile(data) {
  $.ajax({
    method: "PUT",
    url: `/api/pets/${id}`,
    data: data,
    success: (res) => {
      console.log('Success!');
    },
    error: (res) => {
      console.log(res);
    }
  })
}