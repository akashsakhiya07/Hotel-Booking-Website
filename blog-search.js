// Blog Search and Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog search script loaded');
    
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const blogPosts = document.querySelectorAll('.featured-post, .blog-post.enhanced');
    const categoryButtons = document.querySelectorAll('.blog-categories .category');
    const blogGrid = document.querySelector('.blog-grid');

    console.log('Elements found:', {
        searchInput: !!searchInput,
        searchButton: !!searchButton,
        blogPosts: blogPosts.length,
        categoryButtons: categoryButtons.length,
        blogGrid: !!blogGrid
    });

    if (!searchInput || !searchButton || !blogGrid || blogPosts.length === 0) {
        console.error('Required elements not found');
        return;
    }

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
        console.log('Performing search...');
        const searchTerm = searchInput.value.toLowerCase().trim();
        console.log('Search term:', searchTerm);
        
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

            console.log('Post match:', { title, matches });
            togglePost(post, matches);
            if (matches) hasVisiblePosts = true;
        });

        if (!hasVisiblePosts && searchTerm !== '') {
            showNoResults(`We couldn't find any posts matching "${searchTerm}"`, 'fa-search');
        }
    }

    // Function to filter by category
    function filterByCategory(category) {
        console.log('Filtering by category:', category);
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

            console.log('Category match:', { postTags, postCategory, matches });
            togglePost(post, matches);
            if (matches) hasVisiblePosts = true;
        });

        if (!hasVisiblePosts && category !== 'all') {
            showNoResults(`We couldn't find any posts in the "${category}" category`, 'fa-filter');
        }
    }

    // Event Listeners
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });

    // Live search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    // Category filter
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterByCategory(button.textContent.toLowerCase());
        });
    });

    // Add initial styles
    blogPosts.forEach(post => {
        post.style.opacity = '1';
        post.style.transform = 'translateY(0)';
        post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    console.log('Blog search initialization complete');
}); 