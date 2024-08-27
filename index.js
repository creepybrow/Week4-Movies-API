document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '1e914fe5'; // Replace with your OMDB API key
  const movieList = document.querySelector('.movies');
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');
  const loadingindicator = document.getElementById('loading-indicator');
  const errorMessage = document.createElement('div'); //Create error message
  const starsContainer = document.querySelector('.stars');
  errorMessage.id = 'error-message';
  errorMessage.style.color = 'red';
  errorMessage.style.textAlign = 'center';

  


  document.body.insertBefore(errorMessage,document.querySelector('.theater'));//Insert error message in the body


  let hasSearched = false; // Flag to track if a search has been made

  function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 5 + 0.2; // Size of star
    const left = Math.random() * 50; // Horizontal star position
    const top = Math.random() * 50; // Vertical star position
    const duration = Math.random() * 10 + 5; // Duration of animation in seconds
    star.style.width = `${size}px`;
    star.style.height = `${size * 2}px`; // Make the star longer
    star.style.left = `${left}vw`;
    star.style.top = `${top}vh`;
    star.style.animation = `shoot ${duration}s linear forwards`;

    // Remove star after animation ends
    star.addEventListener('animationend', () => {
      star.remove();
    });
    starsContainer.appendChild(star);
  }

  function startCreatingStars() {
    setInterval(createStar, 100); // Create a new star every 100ms
  }

  // Start creating Stars
  startCreatingStars();

  // Function to fetch and display movies based on search query
  async function fetchMovies(query) {
    loadingindicator.classList.remove('hidden'); // Show loading indicator
    loadingindicator.style.display = 'block';
    const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        displayMovies(data.Search); // Display the list of movies
        hasSearched = true; // Set the flag to true when a search is made
      } else {
        console.error('Error:', data.Error);
        movieList.innerHTML = '<p>No movies found. Please try another search.</p>';
        hasSearched = true; // Set the flag to true even if no movies are found
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      movieList.innerHTML = '<p>Error fetching movies. Please try again.</p>';
      hasSearched = true; // Set the flag to true in case of an error
    } finally {
      // Hide the loading indicator
      setTimeout(() => {
        loadingindicator.style.display = 'none';
      }, 100);
      updateScrollArrowsVisibility();
    }
  }

  // Function to open the modal with movie details
  function openModal(movie) {
    modalImage.src = movie.Poster;
    modalTitle.textContent = movie.Title;
    modalYear.textContent = movie.Year;
    modalPlot.textContent = movie.Plot || 'No plot Available.';
    modal.classList.remove('hidden'); // Show the modal
  }

  // Function to close the modal
  function closeModal() {
    modal.classList.add('hidden'); // Hide the modal
  }

  // Function to display movies in the TV screen
  function displayMovies(movies) {
    movieList.innerHTML = ''; // Clear previous movies
    movies.forEach(movie => {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <p>${movie.Title}</p>
        <p>${movie.Year}</p>
      `;
      movieElement.addEventListener('click', () => openModal(movie));
      movieList.appendChild(movieElement);
    });
  }

  // Function to scroll movies to left
  function scrollMoviesLeft() {
    movieList.scrollBy({ left: -200, behavior: 'smooth' });
  }

  function scrollMoviesRight() {
    movieList.scrollBy({ left: 200, behavior: 'smooth' });
  }

  // Event listeners for scroll buttons
  prevButton.addEventListener('click', scrollMoviesLeft);
  nextButton.addEventListener('click', scrollMoviesRight);

  function updateScrollArrowsVisibility() {
    const hasMovies = movieList.children.length > 0;
    if (hasSearched) {
      prevButton.style.display = hasMovies ? 'block' : 'none';
      nextButton.style.display = hasMovies ? 'block' : 'none';
    } else {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
    }
  }
  updateScrollArrowsVisibility();

  // Event listener for the search button
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      errorMessage.classList.add('hidden'); // Hide error message if input is valid
      fetchMovies(query); // Fetch and display movies
    } else {
      errorMessage.textContent = 'Please enter a movie title.'; // Set error message text
      errorMessage.classList.remove('hidden'); // Show error message
      movieList.innerHTML = ''; // Clear movie list
      hasSearched = false; // Reset search flag
    }
  });

  // Event listener for the search input field to clear movies if input is empty
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query === '') {
      movieList.innerHTML = ''; // Clear movie list when input is empty
      hasSearched = false;
      errorMessage.classList.add('hidden'); // Hide error message
    }
    updateScrollArrowsVisibility();
  });
  // Event Listener for the Enter key press in the search input
  searchInput.addEventListener('keydown', (event)=>{
    if(event.key === 'Enter'){
      event.preventDefault();//Prevent the default action
      searchButton.click();//Trigger the click event on the search button
    }
  })

  modalCloseButton.addEventListener('click', closeModal);
});
