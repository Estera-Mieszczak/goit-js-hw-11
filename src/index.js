import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector(".search-form");
const photoList = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

loadMoreBtn.hidden = true;
// Controls the group number

// Controls the number of items in the group
let searchedPhoto;
let page = 1;
const perPage = 40;

form.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        const form = event.target;
        searchedPhoto = form.elements.searchQuery.value;
        
        photoList.innerHTML = "";
        
        await fetchPhoto().then(data => renderPhoto(data));
                
        // Increase the group number
        page += 1;
        loadMoreBtn.hidden = false;
        form.reset();

    // Replace button text after first request
    // if (page > 1) {
    //   fetchPostsBtn.textContent = "Fetch more posts";
    // }
    }   
    catch (error) {
    console.log(error);
  }
});

// loadMoreBtn.addEventListener("click", () => {
//     if (res.hits.length < 40) {
//         loadMoreBtn.hidden = true;
//         Notify.failure("We're sorry, but you've reached the end of search results.");
//     }
//     fetchPhoto().then(data => renderPhoto(data));
//     page += 1;

// })

loadMoreBtn.addEventListener("click", () => {

    fetchPhoto()
    .then(data => {
        if (data.hits.length < 40) {
            loadMoreBtn.hidden = true;
            Notify.failure("We're sorry, but you've reached the end of search results.");
        }
    })
    .then(data => renderPhoto(data));
    page += 1;

})

// function loadMore(total) {
//     if (total.hits.lenght < 40) {
//         loadMoreBtn.hidden = true;
//         Notify.failure("We're sorry, but you've reached the end of search results.");
//     }
// }

const fetchPhoto = async() => {
  
  const API_KEY = '42651602-8bf55650de46c7437c76ae15b'
  const response = await fetch(
    `https://pixabay.com/api/?key=${API_KEY}&per_page=${perPage}&page=${page}&q=${searchedPhoto}&image_type=photo&orientation=horizontal&safesearch=true`
  );
    const photo = await response.json();    
    console.log(photo);
    return photo;   
}

function renderPhoto(photoData) {
    // console.log(photoData);
    if (photoData.hits.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    const totalHits = photoData.totalHits;
    console.log(totalHits);
    const markup = photoData.hits
        .map(({ webformatURL, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
            <img src="${webformatURL}" alt="" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                         <b>Likes:</b> ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views:</b> ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments:</b> ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads:</b> ${downloads}
                    </p>
                </div>
                </div>`;
        })
        .join("");
        // photoList.innerHTML = markup;
    photoList.insertAdjacentHTML("beforeend", markup);
    }