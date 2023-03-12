//Enable focus on modal
function setFocusable(el) {
  const inputEls = el.querySelectorAll("input, textarea, button");
  for (let i = 0; i < inputEls.length; i++) {
    inputEls[i].setAttribute("tabindex", "0");
  }
}

//Sample data
var sample = {
  movieTitle: "De Volta para o Futuro",
  movieReleaseDate: new Date(1985, 12, 25),
  movieSynopsis:
    "Marty travels back in time using an eccentric scientist's time machine. However, he must make his high-school-aged parents fall in love in order to return to the present.",
  movieRating: 4.7,
};

localStorage.setItem(
  sample.movieTitle.replaceAll(" ", ""),
  JSON.stringify(sample)
);

//Read all saved key/value pairs in local storage and draw cards
function loadData() {
  // Get all keys in localStorage
  var keys = Object.keys(localStorage);

  // Loop through each key and print the value
  keys.forEach(function (key) {
    if (!document.getElementById(key) && key != "currentEdit") {
      var value = localStorage.getItem(key);
      var data = JSON.parse(value);
      createCard(
        data.movieTitle,
        data.movieReleaseDate,
        data.movieSynopsis,
        data.movieRating
      );
    }
  });
}

// Select the movies column
const moviesList = document.getElementById("moviesList");

// Show rating on range selector
const ratingValue = document.getElementById("movieRatingValue");
const ratingInput = document.getElementById("movieRating");
ratingValue.textContent = ratingInput.value;
ratingInput.addEventListener("input", (event) => {
  ratingValue.textContent = event.target.value;
});

// Format date to BR standard
function formatDate(date) {
  var date = new Date(date);
  return (
    ("0" + date.getDate()).slice(-2) +
    "/" +
    ("0" + date.getMonth()).slice(-2) +
    "/" +
    date.getFullYear()
  );
}

// Save the movie based on form values
function saveMovie() {
  // Get the input values
  var movieTitle = document.getElementById("movieTitle").value;
  //Check if has title
  if (movieTitle == "") {
    alert("Preencha o titulo do filme!");
    return;
  }

  var movieReleaseDate = document.getElementById("movieReleaseDate").value;
  var movieSynopsis = document.getElementById("movieSynopsis").value;
  var movieRating = document.getElementById("movieRating").value;

  // Create an object to hold the data
  var data = {
    movieTitle: movieTitle,
    movieReleaseDate: movieReleaseDate,
    movieSynopsis: movieSynopsis,
    movieRating: movieRating,
  };

  // Delete old id if name changed
  var currentEdit = localStorage.getItem("currentEdit");
  if (currentEdit && movieTitle != currentEdit) {
    localStorage.removeItem(localStorage.getItem("currentEdit"));
    document.getElementById(localStorage.getItem("currentEdit")).remove();
  }
  localStorage.removeItem("currentEdit");

  // Refresh if ID didnt change
  var exists = document.getElementById(data.movieTitle.replaceAll(" ", ""));
  if (exists) {
    exists.remove();
  }

  // Save the data to localStorage
  localStorage.setItem(
    data.movieTitle.replaceAll(" ", ""),
    JSON.stringify(data)
  );

  //Cleanup and reload
  clearForm();
  loadData();

  //Dismiss modal
  var BSModal = document.getElementById("registerMovieModal");
  var modal = bootstrap.Modal.getInstance(BSModal);
  modal.hide();
}

// Pass movie ID that will be deleted
function confirmDeletion(movie) {
  document.getElementById("confirmDeleteButton").dataset.movie = movie;
}

//Remove movie based on name
function deleteMovie(name) {
  var element = document.getElementById(name);
  if (element) {
    localStorage.removeItem(name);
    element.remove();
  }
}

//Create an element with any atribute and append to parent element
function createElement(tagName, attributes = {}, textContent, parentElement) {
  const element = document.createElement(tagName);
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "class") {
      element.classList.add(...value);
    } else {
      //For atributes that have "-" such as dataset ones
      element.setAttribute(key.replaceAll("_", "-"), value);
    }
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (parentElement) {
    parentElement.appendChild(element);
  }
  return element;
}

// Create a movie card based on input
function createCard(movieTitle, movieReleaseDate, movieSynopsis, movieRating) {
  //div + ID of movie (title)
  var card = createElement(
    "div",
    { class: ["card", "mb-3"], id: movieTitle.replaceAll(" ", "") },
    null,
    moviesList
  );
  var body = createElement("div", { class: ["card-body"] }, null, card);

  //Title and releae date
  createElement("h5", { class: ["card-title"] }, movieTitle, body);
  createElement(
    "h6",
    { class: ["card-subtitle", "mb-2", "text-muted"] },
    formatDate(movieReleaseDate),
    body
  );

  //Synopsis
  createElement("p", { class: ["card-text"] }, movieSynopsis, body);

  //Footer div
  var footer = createElement(
    "div",
    { class: ["d-flex", "justify-content-between"] },
    null,
    body
  );

  //Rating
  var rating = createElement(
    "h2",
    { class: ["card-text"] },
    movieRating + "/5 ",
    footer
  );
  createElement("i", { class: ["fa-solid", "fa-star"] }, null, rating);

  //Button group
  var buttonGroup = createElement(
    "div",
    {
      class: ["d-md-flex", "justify-content-md-end", "btn-group"],
      role: "group",
    },
    null,
    footer
  );

  //Edit button
  var edit = createElement(
    "button",
    {
      type: "button",
      class: ["btn", "btn-secondary"],
      data_movie: movieTitle.replaceAll(" ", ""),
      onclick: "editMovie(this.dataset.movie)",
      data_bs_toggle: "modal",
      aria_label: "Editar",
      data_bs_target: "#registerMovieModal",
    },
    null,
    buttonGroup
  );
  createElement("i", { class: ["fa-solid", "fa-pen-to-square"] }, null, edit);

  //Delete button
  var trash = createElement(
    "button",
    {
      type: "button",
      class: ["btn", "btn-danger"],
      data_movie: movieTitle.replaceAll(" ", ""),
      data_bs_toggle: "modal",
      data_bs_target: "#confirmDeleteModal",
      aria_label: "Excluir",
      onclick: "confirmDeletion(this.dataset.movie)",
    },
    null,
    buttonGroup
  );
  createElement("i", { class: ["fa-solid", "fa-trash"] }, null, trash);
}

// Edit a movie given its ID by loading the values of the movie in storage to the form
function editMovie(id) {
  // Switch heading
  document.getElementById("registerMovieModalLabel").textContent =
    "Editar Filme";

  //Get current movie data
  var storage = localStorage.getItem(id);
  var movie = JSON.parse(storage);

  // Fill fields
  document.getElementById("movieTitle").value = movie.movieTitle;
  document.getElementById("movieReleaseDate").valueAsDate = new Date(
    movie.movieReleaseDate
  );
  document.getElementById("movieSynopsis").value = movie.movieSynopsis;
  document.getElementById("movieRating").value = parseFloat(movie.movieRating);
  document.getElementById("movieRatingValue").textContent = movie.movieRating;

  // Save original id for updating
  localStorage.setItem("currentEdit", id);

  //Enable focus on inputs
  setFocusable(document.getElementById("registerMovieModal"));
}

//Clear form and variables for new data
function clearForm() {
  document.getElementById("registerMovieModalLabel").textContent =
    "Cadastrar Filme";
  document.getElementById("movieForm").reset();
  localStorage.removeItem("currentEdit");

  // Set slider default value
  document.getElementById("movieRating").value = 0;
  document.getElementById("movieRatingValue").textContent = 0;

  //Enable focus on inputs
  setFocusable(document.getElementById("registerMovieModal"));
}
