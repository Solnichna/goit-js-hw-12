import{a as g,i as p,S as h}from"./assets/vendor-951421c8.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();const b=document.querySelector(".form"),l=document.querySelector(".gallery"),L=document.querySelector("div"),w=document.querySelector("input"),d=document.querySelector(".load-more");let S="",i=1;const u=()=>{const o=document.createElement("span");o.classList.add("loader"),L.append(o)},m=()=>{const o=document.querySelector(".loader");o&&o.remove()},v=()=>{d.computedStyleMap.display="block"},$=()=>{d.computedStyleMap.display="none"};b.addEventListener("submit",async o=>{o.preventDefault(),u(),l.innerHTML="",w.value,i=1;try{await y(),v()}catch(s){console.log(s)}finally{m()}});d.addEventListener("click",async()=>{u();try{i++,await y()}catch(o){console.log(o)}finally{m()}});async function y(){const c=`https://pixabay.com/api/?key=42288638-d7f8a30b0a31b090439479823&q=${S}&image_type=photo&orientation=horizontal&safesearch=true&page=${i}&per_page=${15}`;try{const r=await g.get(c);if(r.data.hits.length===0)p.error({message:"Sorry, there are no images matching <br>your search query. Please try again!</br>",position:"center",transitionIn:"fadeInLeft"});else{const e=r.data.totalHits;i*15>=e&&($(),p.info({message:"We're sorry, but you've reached the end of search results.",position:"center",transitionIn:"fadeInLeft"}));const a=l.querySelector(".gallery-item").getBoundingClientRect().height,f=r.data.hits.map(n=>`
          <li class="gallery-item">
            <a href="${n.largeImageURL}">
              <img class="gallery-image" src="${n.webformatURL}" alt="${n.tags}">
            </a>
            <p><b>Likes: </b>${n.likes}</p>
            <p><b>Views: </b>${n.views}</p>
            <p><b>Comments: </b>${n.comments}</p>
            <p><b>Downloads: </b>${n.downloads}</p>
          </li>`).join("");l.insertAdjacentHTML("beforeend",f),new h(".gallery a",{captions:!0,captionType:"attr",captionsData:"alt",captionPosition:"bottom",fadeSpeed:150,captionSelector:"img",captionDelay:250}).on("show.simplelightbox").refresh(),window.scrollBy({top:a*2,behavior:"smooth"})}}catch(r){throw new Error(r.response.status)}}
//# sourceMappingURL=commonHelpers.js.map
