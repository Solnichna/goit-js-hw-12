import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const container = document.querySelector("div");
const inputDate = document.querySelector("input");
const loadMoreBtn = document.createElement('button');

loadMoreBtn.textContent = 'Load more';
loadMoreBtn.classList.add('load-more-btn');
container.append(loadMoreBtn);

let currentPage = 1;
let searchTerm = '';
let totalHits = 0;
let cardHeight = 0; 

const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  container.insertBefore(loader, loadMoreBtn);
};

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

const showLoadMoreButton = () => {
  loadMoreBtn.style.display = 'block';
};

const hideLoadMoreButton = () => {
  loadMoreBtn.style.display = 'none';
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  searchTerm = inputDate.value;
  showLoader();
  currentPage = 1;
  gallery.innerHTML = "";
  try {
    await searchImages();
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'An error occurred while fetching images. Please try again later.',
      position: 'center',
      transitionIn: "fadeInLeft",
    });
  }
  hideLoader();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  showLoader();
  try {
    await searchImages();
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'An error occurred while fetching images. Please try again later.',
      position: 'center',
      transitionIn: "fadeInLeft",
    });
  }
  hideLoader();
});

async function searchImages() {
  const apiKey = '42288638-d7f8a30b0a31b090439479823';
  const perPage = 15;
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    totalHits = data.totalHits;
    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'center',
        transitionIn: "fadeInLeft",
      });
    } else {
      const markup = data.hits
        .map(data => {
          return `
          <li class="gallery-item"><a href="${data.largeImageURL}">
          <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}"></a>
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
      showLoadMoreButton();
      
      if (gallery.querySelectorAll('.gallery-item').length >= totalHits) {
        hideLoadMoreButton();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'center',
          transitionIn: "fadeInLeft",
        });
      }
      
      if (cardHeight === 0) {
        const card = gallery.querySelector('.gallery-item');
        cardHeight = card.getBoundingClientRect().height;
      }
      
      window.scrollBy({
        top: cardHeight * 2, 
        behavior: 'smooth' 
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
