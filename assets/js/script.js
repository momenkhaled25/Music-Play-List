'use strict';

let secondTimeRunning = 0;
let minutesTimeRunning = 0;
let RangeFillWidth = 0;
let RangeFillWidthProgress; 
let setIntervalRange;


let inslaztion = function(){
  
  clearInterval(setIntervalRange)
  secondTimeRunning = 0;
  minutesTimeRunning = 0;
  RangeFillWidth = 0;
  RangeFill.style.width = 0;
  dataSeekRange.value = 0;
  dataRunningTime.textContent = '0:00'
  minutesUpdateSeekRange = 0;
  secondsUpdateSeekRange = 0;
  timecodeUpdateSeekRange = '';
  result = 0 ;
}




const dataPlayBtn = document.querySelector('[data-play-btn]');
const dataRunningTime = document.querySelector('[data-running-time]');
const RangeFill = document.querySelector('[data-range-fill]')

/**
 * all music information
 */

const musicData = [
  {
    backgroundImage: "./assets/images/poster-1.jpg",
    posterUrl: "./assets/images/poster-1.jpg",
    title: "Shababeek",
    album: "Shababeek",
    year: 1983,
    artist: "Mohamed Mounir",
    musicPath: "./assets/music/music-1.mp3"
  },
  {
    backgroundImage: "./assets/images/poster-2.webp",
    posterUrl: "./assets/images/poster-2.webp",
    title: "Men Zaman",
    album: "Men Zaman",
    year: 1993,
    artist: "Aida el Ayoubi",
    musicPath: "./assets/music/music-2.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-3.jpg",
    posterUrl: "./assets/images/poster-3.jpg",
    title: "ALA AD MA HABEINA",
    album: "ALA AD MA HABEINA",
    year: 1977,
    artist: "Ali Elhagger",
    musicPath: "./assets/music/music-3.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-4.jpg",
    posterUrl: "./assets/images/poster-4.jpg",
    title: "Lessa-Faker",
    album: "Aghla Elnas",
    year: 1995,
    artist: "Mohamed Mohey",
    musicPath: "./assets/music/music-4.mp3",
  },
  {
    backgroundImage: "./assets/images/poster-5.webp",
    posterUrl: "./assets/images/poster-5.webp",
    title: "Bahlam Maak",
    album: "Oyoyun el-Qalb",
    year: 1980,
    artist: "Nagat Al-Saghira",
    musicPath: "./assets/music/music-5.mp3",
  },
];

/**
 * PLAYLIST
 * 
 * Add All Music In Playlist , form 'musicData'
 */
const dataMusicList = document.querySelector('[data-music-list]');

for(let i=0 ; i< musicData.length ; i++){
  dataMusicList.innerHTML +=
  `
    <li>
      <button class="music-item" data-playlist-toggler data-playlist-item="${i}">
          <img src="${musicData[i].posterUrl}" width="800" height="800" alt="${musicData[i].title}Album Poster"
          class="img-cover"
          >
          <div class="item-icon">
              <span class="material-symbols-rounded">equalizer</span>
          </div>
          <div>

          </div>
      </button>
    </li>  
  `;
}

 
/**
 * PLAYLIST MODAL SIDEBAR TOGGLE
 * 
 * Show 'playlist' modal sidebar when click on Playlist Button in Top app bar
 * and hide when click on overlay or any playlist-item
 */

const playListToggler = document.querySelectorAll('[data-playlist-toggler]');
const playList = document.querySelector('[data-playlist]');
const overlay  = document.querySelector('[data-overlay]');


for(let i = 0 ; i<playListToggler.length ; i++){
  playListToggler[i].addEventListener("click",function(){
    playList.classList.toggle('active');
    overlay.classList.toggle('active')
    document.body.classList.toggle('modalActive');
  })
}


/*
*PLAYLIST ITEM
*
*REMOVE ACTIVE STATE FROM FROM LAST PLAYED
*ADD ACTIVE STATE IN CLICKED
*/

const musicItem = document.querySelectorAll('.music-item');

let lastMusicItem = 0 ; 
let currentMusicItem = 0;


const changePlayListItem = function(){
  musicItem[lastMusicItem].classList.remove('playing');
  musicItem[currentMusicItem].classList.add('playing');
}

musicItem.forEach(item => {
  item.addEventListener('click',function(){
    inslaztion();
    lastMusicItem = currentMusicItem;
    currentMusicItem = Number(this.dataset.playlistItem);
    changePlayListItem();
    ChangeInformationOnPlayer();
   
  }) 
});



/**
 * PLAYER
 * 
 * Change all visual information on player. based on current music
 */
const musicBanner = document.querySelector('[data-player-banner]');
const dataTitle  = document.querySelector('[data-title]');
const dataAlbum  = document.querySelector('[data-album]');
const dataYear = document.querySelector('[data-year]');
const dataArtist = document.querySelector('[data-artist]');

const audioSourse = new Audio(musicData[currentMusicItem].musicPath) 

let ChangeInformationOnPlayer = function(){
  musicBanner.src = musicData[currentMusicItem].posterUrl;
  musicBanner.setAttribute('alt' , `${musicData[currentMusicItem].title} Album poster`);
  document.body.style.backgroundImage = `url(${musicData[currentMusicItem].backgroundImage})` 
  dataTitle.innerHTML = `${musicData[currentMusicItem].title}`;
  dataAlbum.innerHTML = `${musicData[currentMusicItem].album}`;
  dataYear.innerHTML = `${musicData[currentMusicItem].year}`;
  dataArtist.innerHTML = `${musicData[currentMusicItem].artist}`;
  
  audioSourse.src = musicData[currentMusicItem].musicPath;
 
}

//UPDATE PLAYER DURATION
const getDataTime = function(duration){
  let minutes = Math.floor(duration / 60); //duration / 60 
  let seconds = Math.ceil(duration - (minutes * 60))   //duration - minutes(s)
  let timecode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  return timecode;
}

const dataDuration = document.querySelector('[data-duration]');
const  dataSeekRange   = document.querySelector('[data-seek]');

audioSourse.addEventListener('loadedmetadata', function() {
  dataSeekRange.max  =  Math.ceil(audioSourse.duration);
  
  dataDuration.textContent =  getDataTime(Number(dataSeekRange.max))
});




/**
 * PLAY MUSIC
 * 
 * play and pause music when click on play button
 */



musicItem.forEach(item => {

  item.addEventListener('click',function(){
    if(audioSourse.paused)
    {
      clearInterval(setIntervalRange); 
      clearInterval(setIntervalUpdateRangeSong)
      checkTimerAndRange();
      audioSourse.play();
      dataPlayBtn.classList.add('active'); 
      setIntervalRange = setInterval(updataSeekRange, 1000);

    }else{
      audioSourse.pause();
      dataPlayBtn.classList.remove('active'); 
      clearInterval(setIntervalRange); 
       
    }
  }) 
});





let flag = 0;
let secFlag = 0;

dataPlayBtn.addEventListener("click",function(){
 if (timecodeUpdateSeekRange === getDataTime(Number(dataSeekRange.max))) {
    nextMusic();
    audioSourse.play();
  }
 if(dataPlayBtn.classList.contains('active')){
    audioSourse.pause();
    dataPlayBtn.classList.remove('active'); 
    clearInterval(setIntervalRange);
    clearInterval(setIntervalUpdateRangeSong)
 }else{
  clearInterval(setIntervalRange);
  clearInterval(setIntervalUpdateRangeSong)
  audioSourse.play();
  dataPlayBtn.classList.add('active'); 
  if(secFlag !== 0)
  {
    setIntervalUpdateRangeSong = setInterval(updataRangeSong , 1000)
    flag = 1;
  }
  if(flag === 0){
    setIntervalRange = setInterval(updataSeekRange, 1000);
   
  }
 
 }
})

 let rangeWidth = function(){
  RangeFillWidthProgress = 100 / Number(dataSeekRange.max);
  RangeFillWidth+=RangeFillWidthProgress;
  RangeFill.style.width = `${RangeFillWidth}%`
 }


let updataSeekRange = function(){

  checkTimerAndRange();
  secondTimeRunning++;
 
  if(secondTimeRunning > 59)
  {
    secondTimeRunning = 0;
    minutesTimeRunning++;
  }

  let runningTime = `${minutesTimeRunning}:${secondTimeRunning < 10 ? "0" : ""}${secondTimeRunning}`
  dataRunningTime.textContent = runningTime;

  dataSeekRange.value++;
  RangeFillWidthProgress = 100 / Number(dataSeekRange.max);
  RangeFillWidth+=RangeFillWidthProgress;
  RangeFill.style.width = `${RangeFillWidth}%`


}

let minutesUpdateSeekRange = 0;
let secondsUpdateSeekRange = 0;
let timecodeUpdateSeekRange = '';
let result ;
let valueDataSeekRange;

let setIntervalUpdateRangeSong;
dataSeekRange.addEventListener('input',function(){
  secFlag = 1;
    valueDataSeekRange = this.value
    result  = (valueDataSeekRange * 100 ) /  Number(dataSeekRange.max);
    RangeFill.style.width = `${result}%`

      clearInterval(setIntervalRange);
      clearInterval(setIntervalUpdateRangeSong)
      minutesUpdateSeekRange = Math.floor(Number(valueDataSeekRange) / 60); 
      secondsUpdateSeekRange = Math.ceil(Number(valueDataSeekRange)  - (minutesUpdateSeekRange * 60))
      timecodeUpdateSeekRange = `${minutesUpdateSeekRange}:${secondsUpdateSeekRange < 10 ? "0" : ""}${secondsUpdateSeekRange}`
      dataRunningTime.textContent = timecodeUpdateSeekRange;

        audioSourse.currentTime =  Math.ceil(valueDataSeekRange); 
    


        if(dataPlayBtn.classList.contains('active'))
        {
          
          setIntervalUpdateRangeSong = setInterval(updataRangeSong , 1000)
        }
          

    })


    let updataRangeSong  = function(){
      checkTimerAndRange();

      result+=RangeFillWidthProgress;
      RangeFill.style.width = `${result}%`
      dataSeekRange.value++;
      secondsUpdateSeekRange++;
      if(secondsUpdateSeekRange > 59)
      {
        secondsUpdateSeekRange = 0;
        minutesUpdateSeekRange++;
      }
     
      timecodeUpdateSeekRange = `${minutesUpdateSeekRange}:${secondsUpdateSeekRange < 10 ? "0" : ""}${secondsUpdateSeekRange}` ;
      dataRunningTime.textContent = timecodeUpdateSeekRange;     

  }

  //Repeat button
  let dataRepeat = document.querySelector('[data-repeat]');
  
  dataRepeat.addEventListener('click',function(){
    dataRepeat.classList.toggle('active');
    checkTimerAndRange();
  })

  let randomMusic = (Math.round(Math.random()) * musicData.length ) - 1;

  //data-shuffle button

  let dataShuffle = document.querySelector('[data-shuffle]')
  dataShuffle.addEventListener('click',function(){
    dataShuffle.classList.toggle('active');
    checkTimerAndRange();
  })

  let nextMusic = function(){
    flag = 0;
    secFlag = 0
     clearInterval(setIntervalRange)
     clearInterval(setIntervalUpdateRangeSong);
    
     inslaztion();
     if(dataRepeat.classList.contains('active'))
     {
      currentMusicItem =  currentMusicItem;
     }
     else if(dataShuffle.classList.contains('active')){
        let randomMusic = Math.floor(Math.random() * musicData.length);
          currentMusicItem = randomMusic;
      
     }
     else{
      lastMusicItem = currentMusicItem;
      currentMusicItem = ++currentMusicItem;
     }


     changePlayListItem();
     ChangeInformationOnPlayer();
     setIntervalRange = setInterval(updataSeekRange, 1000);
     
  }

  let checkTimerAndRange = function() {
    if (timecodeUpdateSeekRange === getDataTime(Number(dataSeekRange.max))) {
        nextMusic();
        audioSourse.play();
      }
    
  };



// NEXT button
let dataSkipNext = document.querySelector('[data-skip-next]');

    



dataSkipNext.addEventListener('click',function(){

if(!dataPlayBtn.classList.contains('active'))
{
  dataPlayBtn.classList.add('active')
}

  flag = 0;
  secFlag = 0;

  clearInterval(setIntervalRange)
  clearInterval(setIntervalUpdateRangeSong);
 
  inslaztion();
  lastMusicItem = currentMusicItem;

    if(currentMusicItem == musicData.length - 1)
    {
     currentMusicItem = 0;
    }
   else{
    currentMusicItem = ++currentMusicItem;
   }
  

  changePlayListItem();
  ChangeInformationOnPlayer();
  setIntervalRange = setInterval(updataSeekRange, 1000);
  audioSourse.play()
})



//previous button
let dataSkipPrev = document.querySelector('[data-skip-prev]');

dataSkipPrev.addEventListener('click',function(){

  if(!dataPlayBtn.classList.contains('active'))
  {
    dataPlayBtn.classList.add('active')
  }
  
    flag = 0;
    secFlag = 0;
  
    clearInterval(setIntervalRange)
    clearInterval(setIntervalUpdateRangeSong);
   
    inslaztion();
    lastMusicItem = currentMusicItem;
    if(currentMusicItem == 0)
    {
      currentMusicItem = musicData.length - 1;
    }
    else{
      currentMusicItem = --currentMusicItem;
    }
    
  
    changePlayListItem();
    ChangeInformationOnPlayer();
    setIntervalRange = setInterval(updataSeekRange, 1000);
    audioSourse.play()
  })
  







