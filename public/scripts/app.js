console.log('sanity check');

$('.card').on('click', '.fas.fa-edit', editItem);
$('.card').on('submit', '.editor', saveItem);

function editItem() {
  console.log(this);
  if (this.id === "edit-title") {
    // console.log(this.id);
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
  } else if (this.id === "edit-bio") {
    // console.log(this.id);
    const bioText = $(this).parent('#bio').text().trim();

    const clickedItem = $(this).parent();
    clickedItem.html(`
      <form  class="editor bio">
        <textarea id="biotext" rows="4"></textarea>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
      `);
    $('#biotext').val(bioText);
    // debugger;
    clickedItem.find('textarea:first-child').focus();

  } else if (this.id === "edit-stat") {

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
      <i class="fas fa-edit" id="edit-title"></i>
      `);
  } else if ($(this).hasClass('bio')) {
    // console.log(this);
    const bioText = $(this).children('#biotext').val().trim();

    const submitItem = $(this).parent();
    submitItem.html(`
      ${bioText}
      <i class="fas fa-edit" id="edit-bio"></i>
      `);
  }
	
}