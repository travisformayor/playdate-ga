console.log('sanity check');
const url = window.location.href;
const id = parseInt(url.substring(url.lastIndexOf('/') + 1));

$('.card').on('click', '.fas.fa-edit', editItem);
$('.card').on('submit', '.editor', saveItem);

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
  })
  // populate a pet object from ajax call
  function handleSuccess(res) {
    let pet = res;
    console.log(pet.age);
  };
  // handle a failure
  function handleError(err) {
    let error = `Error retrieving pet information. Please try again.`;
    console.log(error);
  };
  // fill in all the fields with object

}

function editItem() {
  // console.log(this);
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
  // debugger;
  if ($(this).hasClass('title')) {
    // console.log(this);
    const nameText = $(this).children('#name').val().trim();
    const typeText = $(this).children('#type').val().trim();

    const submitItem = $(this).parent();
    submitItem.html(`
      <span class="bold" id="name">${nameText}</span>
      <span> the </span>
      <span class="bold" id="type">${typeText}</span>
      <i class="fas fa-edit edit-title"></i>
      `);
  } else if ($(this).hasClass('bio')) {
    // console.log(this);
    const bioText = $(this).children('#biotext').val().trim();

    const submitItem = $(this).parent();
    submitItem.html(`
      ${bioText}
      <i class="fas fa-edit edit-bio"></i>
      `);
  } else if ($(this).hasClass('stat')) {
    // console.log(this);
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
