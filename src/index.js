import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';

const form = document.querySelector(".search-form");
// console.log(form);
const query = document.querySelector('input');
const gallery = document.querySelector(".gallery")
// console.log(query);
const loadButton = document.querySelector(".load-more");
const alertMessage = document.querySelector(".alert");
const BASE_URL = 'https://pixabay.com/api/';
let queryValue = query.value;
let lightbox;
let perPage = 40;
let currentPage = 1;
let totalPages = 5;
let isAlertVisible = false;
let TotalPictures = null
loadButton.classList.add("invisible");


form.addEventListener("submit", onFormSubmit);
loadButton.addEventListener("click", onLoadButtonClick)



function onFormSubmit(e) {
    (e).preventDefault()
    gallery.innerHTML = "";
    queryValue = query.value;
    currentPage = 1;
    console.log(queryValue);
    fetchImages(queryValue).then(images => {
        createMarkup(images);
        currentPage += 1
    })
        .catch(error => console.log(error));
    
    lightbox = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
    });

}

async function fetchImages(queryValue) {
    try {
        const response = await axios.get(`${BASE_URL}?key=29442705-65f5f0476d101e3a0092bd469&q=${queryValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`);
        const arrayImages = await response.data.hits;
         TotalPictures = response.data.totalHits
        // console.log(arrayImages)
        if (arrayImages.length === 0) {
        Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.');
        }
        else {
            if (arrayImages.length !== 0 && currentPage === 1) {
                loadButton.classList.remove("invisible");
                Notiflix.Notify.success(`Hoooray! We found ${TotalPictures} images!`)
            }
        }
        return arrayImages;
    }
    catch(error){console.log(error)}
    }


function onLoadButtonClick() {
    if (currentPage > totalPages) {
        loadButton.classList.add('invisible');
        return toggleAlertPopup()
    }
    fetchImages(queryValue).then(images => {
        createMarkup(images);
        currentPage += 1
    })
        .catch(error => console.log(error));
    
}
function createMarkup(images) {
    console.log(images)
    const markupFull = images.map(image => { return`
    <div class="photo-card">
         <a href="${image.largeImageURL}" class="gallery_link">
          <img class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" width="370px" loading="lazy" />
          </a>
        <div class="info">
              <p class="info-item">
              <b>Likes<br>${image.likes}</b>
              </p>
              <p class="info-item">
              <b>Views<br>${image.views}</b>
              </p>
              <p class="info-item">
              <b>Comments<br>${image.comments}</b>
              </p>
              <p class="info-item">
              <b>Downloads<br>${image.downloads}</b>
              </p>
        </div>
    </div>    
    ` 
     }
     ).join("")
    gallery.innerHTML = markupFull;
    lightbox.refresh();
}

function toggleAlertPopup() {
    if (isAlertVisible) {
      return;
    }
    isAlertVisible = true;
    alertMessage.classList.add("is-visible");
    setTimeout(() => {
      alertMessage.classList.remove("is-visible");
        isAlertVisible = false;
        currentPage = 1
    }, 3000);
};
    
