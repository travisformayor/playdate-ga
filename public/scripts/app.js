console.log('sanity check');

$('.card').on('click', '.fas.fa-edit', editItem);
$('.card').on('submit', '.editor', saveItem);

function editItem() {
  console.log(this);
  if (this.id === "edit-title") {
    // console.log(this.id);
    const nameText = $(this).siblings('#name').text();
    const typeText = $(this).siblings('#type').text();

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

  } else if (this.id === "edit-stat") {

  }
}

function saveItem(e) {
  e.preventDefault();
  if ($(this).hasClass('title')) {
    // console.log(this);
    const nameText = $(this).children('#name').val();
    const typeText = $(this).children('#type').val();

    const submitItem = $(this).parent();
    submitItem.html(`
      <span class="bold" id="name">${nameText}</span>
      <span> the </span>
      <span class="bold" id="type">${typeText}</span>
      <i class="fas fa-edit" id="edit-title"></i>
      `);
  }

	// // Select the to-do list item the user wants to save
	// const listItem = $(this).parent();
	// // Get the value of the input inside of this item
	// const itemText = listItem.find('input').val();
	// // Replace the input in the list item with the value of the input field
	// const newListItem = '<input type="checkbox"><span class="item">' + itemText + '</span><a href="#" class="edit">Edit</a><a href="#" class="remove">Remove</a>';
	// // Append the list item to our ordered to-do list
	// listItem.html(newListItem);	
}