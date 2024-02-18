import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const container = document.querySelector("div");
const inputDate = document.querySelector("input");



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

form.addEventListener("submit", (event) => {
  showLoader();
   gallery.innerHTML = "";
   event.preventDefault();
   const searchTerm = inputDate.value;
   searchImages(searchTerm);
    
});

function searchImages(searchTerm) {
  const apiKey = '42288638-d7f8a30b0a31b090439479823';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      } else {
        return response.json();
      }
    })
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message: 'Sorry, there are no images matching <br>your search query. Please try again!</br>',
          position: 'center',
          transitionIn: "fadeInLeft",
        });
        hideLoader()
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
        hideLoader();
      }
    })
    .catch((error) => console.log(error));
   
};