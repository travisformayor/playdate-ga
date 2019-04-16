console.log('sanity check');


// When the user clicks the edit better next to a list item
// $('#taskList').on('click', '.edit', editItem);

// When user hits enter in the edit form
$('#taskList').on('submit', '.editor', saveItem);


$('#edit-title').on('click', editItem);
// $('#edit-bio').on('click', editBio);
// $('#edit-stat').on('click', editStat);

function editItem() {
  // debugger;
  // console.log(this);
  if (this.id === "edit-title") {
    console.log(this.id);
    // Get current text to pre-fill input
    const nameText = $(this).siblings('#name').text();
    const typeText = $(this).siblings('#type').text();
	  // Replace with edit form
    const clickedItem = $(this).parent();
    clickedItem.html(`
      <form class="editor title">
        <input type="text" value="${nameText}">
        <input type="text" value="${typeText}">
        <button type="submit" class="btn btn-primary">Save</button>
      </form>
      `);
  } else if (this.id === "edit-bio") {

  } else if (this.id === "edit-stat") {
    
  }


}

function saveItem(e) {
	e.preventDefault();
	// Select the to-do list item the user wants to save
	const listItem = $(this).parent();
	// Get the value of the input inside of this item
	const itemText = listItem.find('input').val();
	// Replace the input in the list item with the value of the input field
	const newListItem = '<input type="checkbox"><span class="item">' + itemText + '</span><a href="#" class="edit">Edit</a><a href="#" class="remove">Remove</a>';
	// Append the list item to our ordered to-do list
	listItem.html(newListItem);	
}