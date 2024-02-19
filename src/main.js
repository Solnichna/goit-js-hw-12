import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from "axios"; 

const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const container = document.querySelector("div");
const inputDate = document.querySelector("input");
const loadMoreBtn = document.querySelector(".load-more");

let searchTerm = '';
let page = 1;

const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  container.append(loader);
};

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

const showLoadMoreBtn = () => {
  loadMoreBtn.style.display = "block";
};

const hideLoadMoreBtn = () => {
  loadMoreBtn.style.display = "none";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showLoader();
  gallery.innerHTML = "";
  searchTerm = inputDate.value;
  page = 1;
  try {
    await searchImages();
    showLoadMoreBtn();
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener("click", async () => {
  showLoader();
  try {
    page++;
    await searchImages();
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader();
  }
});

async function searchImages() {
  const apiKey = '42288638-d7f8a30b0a31b090439479823';
  const perPage = 15;
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  try {
    const response = await axios.get(url);
    
    if (response.data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching <br>your search query. Please try again!</br>',
        position: 'center',
        transitionIn: "fadeInLeft",
      });
    } else {
      const totalHits = response.data.totalHits;
      const currentHits = page * perPage;
      if (currentHits >= totalHits) {
        hideLoadMoreBtn();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'center',
          transitionIn: "fadeInLeft",
        });
      }

      const galleryItemHeight = gallery.querySelector('.gallery-item').getBoundingClientRect().height;
      const markup = response.data.hits.map(data => {
        return `
          <li class="gallery-item">
            <a href="${data.largeImageURL}">
              <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}">
            </a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p>
            <p><b>Downloads: </b>${data.downloads}</p>
          </li>`;
      }).join('');
      gallery.insertAdjacentHTML("beforeend", markup);
      const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionType: 'attr',
        captionsData: 'alt',
        captionPosition: 'bottom',
        fadeSpeed: 150,
        captionSelector: "img",
        captionDelay: 250,
      });
      lightbox.on('show.simplelightbox').refresh();

      window.scrollBy({
        top: galleryItemHeight * 2,
        behavior: 'smooth'
      });
    }
  } catch (error) {
    throw new Error(error.response.status);
  }
}
