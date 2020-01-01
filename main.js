let baseURL = 'https://api.themoviedb.org/3/';
let APIKEY = '';  // Enter your apikey
let baseImageURL = "https://image.tmdb.org/t/p/";
let posterSize = 'w185';


let hidOrDisplay = function () {
  let obj = this.parentNode.lastChild;
  if(obj.style.display == "none") {
     obj.style.display = "";
   }
   else {
     obj.style.display = "none";
  }
}

let createTitle = function (show, data, outputObj) {
  let Name = data.results[show].name;
  let TV_Show = document.createElement('li');
  let TV = document.createElement('a');
  TV.innerHTML = Name;
  TV.addEventListener('click', hidOrDisplay);
  TV_Show.append(TV);
  TV_Show.append(createDiscription(Name, show, data));
  outputObj.append(TV_Show);
}

let createDiscription = function (Name, show, data) {
  let discription = document.createElement('div');
  discription.id = Name;
  discription.style.display = 'none';
  discription.append(displayPoster(show, data, Name));
  discription.append(displayOverview(show, data));
  let tvId = data.results[show].id;
  let url = "".concat(baseURL, 'tv/', tvId, 'popular?api_key=', APIKEY, '&language=en-US');
  fetch(url)
    .then(result=>result.json())
    .then((data)=>{
      discription.append(displayNumberOfSeasons(data));
    })
  return discription;
}

let displayOverview = function (show, data) {
  let overviewShow = document.createElement('p');
  let overview = data.results[show].overview;
  overviewShow.innerHTML = overview;
  return overviewShow;
  }

let displayPoster = function (show, data, name) {
  let posterShow = document.createElement('img');
  posterShow.alt = 'Постер відсутній';
  let posterPath = data.results[show].poster_path;
  if (posterPath == null) {
    return;
  }
  posterShow.src = "".concat(baseImageURL, posterSize, posterPath);
  return posterShow;
  }

let displayNumberOfSeasons = function (data) {
  let numberOfSeasons = document.createElement('p');
  let len = data.seasons[0].episode_count;
  numberOfSeasons.innerHTML = len;
  return numberOfSeasons;

}
  // To get image config
  // let getConfig = function () {
  //   let url = "".concat(baseURL, 'configuration?api_key=', APIKEY);
  //   fetch(url)
  //     .then((result)=>{
  //       return result.json();
  //       })
  //     .then((data)=>{
  //       baseImageURL = data.images.secure_base_url;
  //       configData = data.images;
  //       console.log(configData);
  //       })
  //   }


let getPopular = function (num) {
  if (typeof(num) == 'object'){
    num = 1; 
  }
  output.remove();
  let url = "".concat(baseURL, 'tv/popular?api_key=', APIKEY, '&language=en-US&page=', num);
  fetch(url)
  .then(result=>result.json())
  .then((data)=>{
    let smth = document.createElement('div');
    smth.id = 'output';
    page.append(smth);
    console.log(data);
    for (let show in data.results) {
      createTitle(show, data, output);
    }
    let lastp = data.total_pages;
    updatePagin(lastp, num);
  })
}

let getRated = function (num) {
  if (!num){
    num = 1; 
  }
  output.remove();
  let url = "".concat(baseURL, 'tv/top_rated?api_key=', APIKEY, '&language=en-US&page=', num);
  fetch(url)
  .then(result=>result.json())
  .then((data)=>{
    let smth = document.createElement('div');
    smth.id = 'output';
    page.append(smth);
    for (let show in data.results) {
      createTitle(show, data, output);
    }
    let lastp = data.total_pages;
    updatePagin(lastp, num);

  })
}
// document.addEventListener('DOMContentLoaded', getConfig);
document.addEventListener('DOMContentLoaded', getPopular);

let createPaginNode = function (num, place) {
  let p = document.createElement('a');
  p.num = num;
  p.innerHTML = num;
  p.addEventListener('click', pagin);
  place.append(p);
}


let router = function  (pageNum) {
  if(typeof(pageNum) == 'object'){
    pageNum = 1;
  }
  if(window.location.hash == '#topRated'){
    getRated(pageNum);
  }
  else{
    getPopular(pageNum);
  }
}

window.addEventListener('hashchange', router);
let pagin = function () {
  let center = this.num;
  router(center);
}


let updatePagin = function (lastp, center) {
  if(pagination) {
    pagination.remove();
  }
  let full = document.createElement('div');
  full.id = 'pagination';
  let before = document.createElement('div');
  before.id = 'beforeMain';
  let main = document.createElement('div');
  main.id = 'mainPart';
  let after = document.createElement('div');
  after.id = 'afterMain';
  full. append(before);
  full. append(main);
  full. append(after);
  body.append(full);
  let copyCenter = center;
  if (center < 3) {
    center = 3;
  }
  else if (center > lastp - 3) {
    center = lastp - 2;
  }

  if(!(copyCenter > lastp - 3)) {
    let threep = document.createTextNode('...');
    afterMain.append(threep);
    createPaginNode(lastp, afterMain);
  }
  if(!(copyCenter < 3)){
    createPaginNode(1, beforeMain);
    let threep = document.createTextNode('...');
    beforeMain.append(threep);
  }

  for (let i = center - 2; i < center + 3; i++){
  createPaginNode(i, mainPart);
  }
}

