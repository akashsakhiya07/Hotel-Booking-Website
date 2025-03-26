const navBtn = document.getElementById('nav-btn');
const cancelBtn = document.getElementById('cancel-btn');
const sideNav = document.getElementById('sidenav');
const modal = document.getElementById('modal');

navBtn.addEventListener("click", function () {
    sideNav.classList.add('show');
    modal.classList.add('showModal');
});

cancelBtn.addEventListener('click', function () {
    sideNav.classList.remove('show');
    modal.classList.remove('showModal');
});

window.addEventListener('click', function (event) {
    if (event.target === modal) {
        sideNav.classList.remove('show');
        modal.classList.remove('showModal');
    }
});

// Booking functionality
const API_URL = 'http://localhost:3000/api';

// Fetch rooms from backend
async function fetchRooms() {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        const rooms = await response.json();
        displayRooms(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
    }
}

// Display rooms in the UI
function displayRooms(rooms) {
    const roomsContainer = document.querySelector('.rooms-container');
    roomsContainer.innerHTML = rooms.map(room => `
        <article class="room">
            <div class="room-image">
                <img src="${room.image}" alt="${room.name}">
            </div>
            <div class="room-text">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <p class="rate">
                    <span>₹${room.price}/</span> Per Night
                </p>
                <button type="button" class="btn" onclick="bookRoom('${room._id}')">book now</button>
            </div>
        </article>
    `).join('');
}

// Add Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
document.body.appendChild(script);

// Handle booking form submission
document.querySelector('.book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !user) {
        alert('Please sign in to make a booking');
        window.location.href = 'signin.html';
        return;
    }

    // Get selected room details
    const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom')) || {};
    
    const bookingData = {
        roomType: selectedRoom.type || 'Standard Room',
        checkIn: document.getElementById('chekin-date').value,
        checkOut: document.getElementById('chekout-date').value,
        adults: parseInt(document.getElementById('adult').value),
        children: parseInt(document.getElementById('children').value),
        rooms: parseInt(document.getElementById('rooms').value)
    };

    console.log('Sending booking data:', bookingData); // Debug log

    try {
        const response = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        console.log('Server response:', data); // Debug log
        
        if (response.ok) {
            // Update user data in localStorage with new booking
            const updatedUser = {
                ...user,
                bookings: [...(user.bookings || []), data.booking]
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            alert('Booking successful! Check your profile for booking details.');
            window.location.href = 'profile.html';
        } else {
            alert(data.message || 'Booking failed. Please try again.');
        }
    } catch (error) {
        console.error('Error making booking:', error);
        alert('An error occurred. Please try again.');
    }
});

// Book Now button click handler
document.querySelectorAll('.book-now').forEach(button => {
    button.addEventListener('click', function() {
        const roomCard = this.closest('.room');
        const roomType = roomCard.querySelector('h3').textContent;
        const roomPrice = roomCard.querySelector('.rate').textContent;
        
        // Store selected room details
        sessionStorage.setItem('selectedRoom', JSON.stringify({
            type: roomType,
            price: roomPrice
        }));
        
        // Scroll to booking form
        document.querySelector('.book').scrollIntoView({ behavior: 'smooth' });
    });
});

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const contactData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        if (response.ok) {
            alert('Thank you for contacting us! We will get back to you soon.');
            contactForm.reset();
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('An error occurred. Please try again.');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchRooms();
});

// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && !navLinks.contains(e.target) && menuBtn && !menuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Blog Search and Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const blogPosts = document.querySelectorAll('.featured-post, .blog-post.enhanced');
    const categoryButtons = document.querySelectorAll('.blog-categories .category');
    const blogGrid = document.querySelector('.blog-grid');

    // Function to show/hide posts with animation
    function togglePost(post, show) {
        if (show) {
            post.style.display = 'block';
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 10);
        } else {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
                post.style.display = 'none';
            }, 300);
        }
    }

    // Function to show no results message
    function showNoResults(message, icon = 'fa-search') {
        let noResults = document.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }

        noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas ${icon}" style="font-size: 48px; color: var(--yellow); margin-bottom: 20px;"></i>
                <h3 style="margin-bottom: 10px; color: var(--dark);">No Results Found</h3>
                <p>${message}</p>
            </div>
        `;
        blogGrid.appendChild(noResults);
    }

    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let hasVisiblePosts = false;

        // Remove existing no results message
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        blogPosts.forEach(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const content = post.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(post.querySelectorAll('.post-tags a'))
                .map(tag => tag.textContent.toLowerCase());
            const author = post.querySelector('.post-meta span:nth-child(2)').textContent.toLowerCase();

            const matches = title.includes(searchTerm) || 
                          content.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm)) ||
                          author.includes(searchTerm);

            togglePost(post, matches);
            if (matches) hasVisiblePosts = true;
        });

        if (!hasVisiblePosts && searchTerm !== '') {
            showNoResults(`We couldn't find any posts matching "${searchTerm}"`, 'fa-search');
        }
    }

    // Function to filter by category
    function filterByCategory(category) {
        let hasVisiblePosts = false;

        // Remove existing no results message
        const existingNoResults = document.querySelector('.no-results');
        if (existingNoResults) {
            existingNoResults.remove();
        }

        blogPosts.forEach(post => {
            const postTags = Array.from(post.querySelectorAll('.post-tags a'))
                .map(tag => tag.textContent.toLowerCase());
            const postCategory = post.querySelector('.category-tag')?.textContent.toLowerCase() || 
                               post.querySelector('.featured-tag')?.textContent.toLowerCase();

            const matches = category === 'all' || 
                          postTags.includes(category) || 
                          postCategory === category;

            togglePost(post, matches);
            if (matches) hasVisiblePosts = true;
        });

        if (!hasVisiblePosts && category !== 'all') {
            showNoResults(`We couldn't find any posts in the "${category}" category`, 'fa-filter');
        }
    }

    // Event Listeners
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Live search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
    }

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterByCategory(button.textContent.toLowerCase());
        });
    });
});

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
    .featured-post, .blog-post.enhanced {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    .no-results {
        animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);