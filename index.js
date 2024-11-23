var bookmarkTitleInput = document.getElementById("bookmarkName");
var bookmarkUrlInput = document.getElementById("bookmarkURL");
var addBookmarkBtn = document.getElementById("submitBtn");
var bookmarkTableBody = document.getElementById("tableContent");
var deleteButtons;
var visitButtons;
var modalCloseButton = document.getElementById("closeBtn");
var infoModal = document.querySelector(".box-info");
var storedBookmarks = [];

// Load stored bookmarks from localStorage
if (localStorage.getItem("bookmarksList")) {
  storedBookmarks = JSON.parse(localStorage.getItem("bookmarksList"));
  for (var i = 0; i < storedBookmarks.length; i++) {
    displayBookmark(i);
  }
}

function displayBookmark(index) {
  var userURL = storedBookmarks[index].siteURL;
  var httpsRegex = /^https?:\/\//g;
  let validatedUrl, formattedUrl;

  if (httpsRegex.test(userURL)) {
    validatedUrl = userURL;
    formattedUrl = validatedUrl
      .split("")
      .splice(validatedUrl.match(httpsRegex)[0].length)
      .join("");
  } else {
    formattedUrl = userURL;
    validatedUrl = `https://${userURL}`;
  }

  var newBookmark = `
              <tr>
                <td>${index + 1}</td>
                <td>${storedBookmarks[index].siteName}</td>              
                <td>
                  <button class="btn btn-visit" data-index="${index}">
                    <i class="fa-solid fa-eye pe-2"></i>Visit
                  </button>
                </td>
                <td>
                  <button class="btn btn-delete pe-2" data-index="${index}">
                    <i class="fa-solid fa-trash-can"></i>
                    Delete
                  </button>
                </td>
            </tr>
            `;
  bookmarkTableBody.innerHTML += newBookmark;

  deleteButtons = document.querySelectorAll(".btn-delete");
  if (deleteButtons) {
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        deleteBookmark(e);
      });
    });
  }

  visitButtons = document.querySelectorAll(".btn-visit");
  if (visitButtons) {
    visitButtons.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        visitWebsite(e);
      });
    });
  }
}

function clearInputFields() {
  bookmarkTitleInput.value = "";
  bookmarkUrlInput.value = "";
}

function capitalizeString(str) {
  let strArr = str.split("");
  strArr[0] = strArr[0].toUpperCase();
  return strArr.join("");
}

addBookmarkBtn.addEventListener("click", function () {
  if (
    bookmarkTitleInput.classList.contains("is-valid") &&
    bookmarkUrlInput.classList.contains("is-valid")
  ) {
    var newBookmark = {
      siteName: capitalizeString(bookmarkTitleInput.value),
      siteURL: bookmarkUrlInput.value,
    };
    storedBookmarks.push(newBookmark);
    localStorage.setItem("bookmarksList", JSON.stringify(storedBookmarks));
    displayBookmark(storedBookmarks.length - 1);
    clearInputFields();
    bookmarkTitleInput.classList.remove("is-valid");
    bookmarkUrlInput.classList.remove("is-valid");
  } else {
    infoModal.classList.remove("d-none");
  }
});

function deleteBookmark(e) {
  bookmarkTableBody.innerHTML = "";
  var deletedIndex = e.target.dataset.index;
  storedBookmarks.splice(deletedIndex, 1);
  storedBookmarks.forEach((_, index) => {
    displayBookmark(index);
  });
  localStorage.setItem("bookmarksList", JSON.stringify(storedBookmarks));
}

function visitWebsite(e) {
  var websiteIndex = e.target.dataset.index;
  var httpsRegex = /^https?:\/\//;
  if (httpsRegex.test(storedBookmarks[websiteIndex].siteURL)) {
    open(storedBookmarks[websiteIndex].siteURL);
  } else {
    open(`https://${storedBookmarks[websiteIndex].siteURL}`);
  }
}

var nameRegex = /^\w{3,}(\s+\w+)*$/;
var urlRegex = /^(https?:\/\/)?(w{3}\.)?\w+\.\w{2,}\/?(:\d{2,5})?(\/\w+)*$/;

bookmarkTitleInput.addEventListener("input", function () {
  validateInput(bookmarkTitleInput, nameRegex);
});

bookmarkUrlInput.addEventListener("input", function () {
  validateInput(bookmarkUrlInput, urlRegex);
});

function validateInput(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
  }
}

function closeModal() {
  infoModal.classList.add("d-none");
}

modalCloseButton.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    closeModal();
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("box-info")) {
    closeModal();
  }
});
