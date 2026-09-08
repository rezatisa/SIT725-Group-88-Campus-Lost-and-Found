document.addEventListener('DOMContentLoaded', () => {
  // Get ID from URL parameter
  const params = new URLSearchParams(window.location.search);
  const itemId = params.get('id');

  if (!itemId) {
    console.error('No item ID provided');
    return;
  }

  // Fetch item details from API
  fetch(`/api/items/${itemId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Item not found');
      }
      return response.json();
    })
    .then(item => {
      displayItemDetails(item);
    })
    .catch(error => {
      console.error('Error loading item:', error);
      alert('Error loading item: ' + error.message);
    });
});

function displayItemDetails(item) {
  // Get all the elements in the HTML
  const badges = document.querySelectorAll('.badge-wf');
  const title = document.querySelectorAll('.lorem-line')[0];
  const categoryValue = document.querySelectorAll('div[style*="grid-template-columns"]')[0];
  const descriptionBox = document.querySelector('.box.p-3');
  const contactBox = document.querySelector('.box-strong.p-3');
  
  // Update type badge
  if (badges[0]) {
    badges[0].textContent = item.type.toUpperCase();
    badges[0].className = `badge-wf ${item.type === 'lost' ? 'badge-lost' : 'badge-found'}`;
  }
  
  // Update status badge
  if (badges[1]) {
    badges[1].textContent = (item.status || 'active').toUpperCase();
  }

  // Update title
  if (title) {
    title.textContent = item.title;
    title.style.width = 'auto';
  }

  // Update category, location, and dates
  const categorySection = document.querySelectorAll('div[style*="grid-template-columns"]')[0];
  if (categorySection) {
    const categoryDivs = categorySection.querySelectorAll('div');
    if (categoryDivs.length >= 8) {
      categoryDivs[1].textContent = item.category;
      categoryDivs[3].textContent = item.location;
      
      // Format date
      const dateObj = new Date(item.date);
      const formattedDate = dateObj.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      categoryDivs[5].textContent = formattedDate;
      categoryDivs[7].textContent = formattedDate; // Using same date for "Date reported"
    }
  }

  // Update description
  if (descriptionBox) {
    const descLines = descriptionBox.querySelectorAll('.lorem-line');
    if (descLines.length > 0) {
      descLines[0].textContent = item.description;
      descLines[0].style.width = 'auto';
      // Hide other placeholder lines
      for (let i = 1; i < descLines.length; i++) {
        descLines[i].style.display = 'none';
      }
    }
  }

  // Update collection instructions and contact
  if (contactBox) {
    const contactLink = contactBox.querySelector('a');
    if (contactLink) {
      // You can customize this based on item type and handover method
      contactLink.textContent = 'Contact reporter →';
      contactLink.href = 'mailto:reporter@deakin.edu.au';
    }
  }

  console.log('Item details loaded successfully:', item);
}