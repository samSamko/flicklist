//Save sample data
const sample = {
  movieTitle: "De Volta para o Futuro",
  movieReleaseDate: new Date(1985, 11, 25),
  movieSynopsis:
    "Marty travels back in time using an eccentric scientist's time machine. However, he must make his high-school-aged parents fall in love in order to return to the present.",
  movieRating: 4.7,
};
localStorage.setItem(
  sample.movieTitle.replaceAll(" ", ""),
  JSON.stringify(sample)
);

// Add event listener to show rating based on ranged input
document.getElementById("movieRating").addEventListener("input", (event) => {
  document.getElementById("movieRatingValue").textContent = event.target.value;
});

//Retrieve JSONed movie from storage
function retrieveMovie(id) {
  return JSON.parse(localStorage.getItem(id));
}

// Format date to BR standard
function formatDate(date) {
  var date = new Date(date);

  //Day
  var day = date.getDate().toString();
  day = day.length == 1 ? "0" + day : day;

  //Month
  var month = (date.getMonth() + 1).toString();
  month = month.length == 1 ? "0" + month : month;

  return day + "/" + month + "/" + date.getFullYear();
}

//Enable focus on modal input fields
function setFocusable(el) {
  const inputEls = el.querySelectorAll("input, textarea, button");
  for (let i = 0; i < inputEls.length; i++) {
    inputEls[i].setAttribute("tabindex", "0");
  }
}

//Read all saved key/value pairs in local storage and draw cards
function loadData() {
  // Get all keys in localStorage
  const keys = Object.keys(localStorage);

  // Loop through each key and print the value
  keys.forEach(function (key) {
    if (!document.getElementById(key) && key != "currentEdit") {
      const data = retrieveMovie(key);
      createCard(
        data.movieTitle,
        data.movieReleaseDate,
        data.movieSynopsis,
        data.movieRating
      );
    }
  });
}

// Check if form has required fields filled
function validateMovieForm() {
  //Title
  const movieTitle = document.getElementById("movieTitle");

  //Check if has title
  if (movieTitle.value.replaceAll(" ", "") == "") {
    alert("Preencha o titulo do filme!");
    movieTitle.focus();
    movieTitle.value = "";
    return false;
  }

  //Date
  const movieReleaseDate = document.getElementById("movieReleaseDate");

  //Check if has date
  if (movieReleaseDate.value == "") {
    alert("Preencha a data do filme!");
    movieReleaseDate.focus();
    return false;
  }

  return true;
}

// Save the movie based on form values
function saveMovie() {
  // Validate
  if (!validateMovieForm()) {
    return;
  }

  // Create an object to hold the data from the form
  var data = {
    movieTitle: document.getElementById("movieTitle").value,
    movieReleaseDate: document.getElementById("movieReleaseDate").value,
    movieSynopsis: document.getElementById("movieSynopsis").value,
    movieRating: document.getElementById("movieRating").value,
  };

  // Save the data to localStorage with the key as the name of the movie without whitespaces
  localStorage.setItem(
    data.movieTitle.replaceAll(" ", ""),
    JSON.stringify(data)
  );

  // If form was called from an edit button, delete old ID and card
  const currentEdit = localStorage.getItem("currentEdit");
  if (currentEdit) {
    //If ID (title) changed, delete the old card/ID, else delete the current card and keep ID
    if (movieTitle != currentEdit) {
      localStorage.removeItem(currentEdit);
      document.getElementById(currentEdit).remove();
    } else {
      document.getElementById(movieTitle).remove();
    }
    localStorage.removeItem("currentEdit");
  }

  //Dismiss modal
  const BSModal = document.getElementById("registerMovieModal");
  const modal = bootstrap.Modal.getInstance(BSModal);
  modal.hide();

  //Cleanup and reload
  clearForm();
  loadData();
}

// Pass movie ID and name for deletion
function confirmDeletion(movie) {
  document.getElementById("confirmDeleteButton").dataset.movie = movie;
  document.getElementById("deleteConfirmMovie").textContent =
    retrieveMovie(movie).movieTitle + "?";
}

//Remove movie based on name
function deleteMovie(name) {
  const element = document.getElementById(name);
  if (element) {
    localStorage.removeItem(name);
    element.remove();
  }
}

//Construct an element with all passed atributes and text and append to parent element
function createElement(tagName, attributes = {}, textContent, parentElement) {
  const element = document.createElement(tagName);
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "class") {
      element.classList.add(...value);
    } else {
      //For atributes that have "-" like data
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
  const card = createElement(
    "div",
    { class: ["card", "mb-3"], id: movieTitle.replaceAll(" ", "") },
    null,
    document.getElementById("moviesList")
  );
  const body = createElement("div", { class: ["card-body"] }, null, card);

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
  const footer = createElement(
    "div",
    { class: ["d-flex", "justify-content-between"] },
    null,
    body
  );

  //Rating
  const rating = createElement(
    "h2",
    { class: ["card-text"] },
    movieRating + "/5 ",
    footer
  );
  createElement("i", { class: ["fa-solid", "fa-star"] }, null, rating);

  //Button group
  const buttonGroup = createElement(
    "div",
    {
      class: ["d-md-flex", "justify-content-md-end", "btn-group"],
      role: "group",
    },
    null,
    footer
  );

  //Edit button
  const edit = createElement(
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
  const trash = createElement(
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

// Edit a movie given its ID by loading the values of the movie in storage to the save movie form
function editMovie(id) {
  // Switch heading to inform user
  document.getElementById("registerMovieModalLabel").textContent =
    "Editar Filme";

  //Get current movie data
  const movie = retrieveMovie(id);

  // Fill fields with data
  document.getElementById("movieTitle").value = movie.movieTitle;
  document.getElementById("movieReleaseDate").valueAsDate = new Date(
    movie.movieReleaseDate
  );
  document.getElementById("movieSynopsis").value = movie.movieSynopsis;
  document.getElementById("movieRating").value = parseFloat(movie.movieRating);
  document.getElementById("movieRatingValue").textContent = movie.movieRating;

  // Save original id for usage when saving
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
