import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

class Weather {
  lat;
  lon;
  apiKey = '8db3ffeab49cecd1a008a048949a3810';
  units = 'imperial';
  fetchWeather = null;
  forecastData = null;

  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }

  getTime() {
    const currentTime = dayjs();
    const timeHTML = `${currentTime.format('MMMM D')}<hr style="border: 1px solid rgba(255, 255, 255, 0.4); margin: 20px; height: 135%; box-shadow: 0px 0px 5px black; border-radius: 10px;" />${currentTime.format('h:mm')}</div></div>`;
  
    document.querySelector('.time-info').innerHTML = timeHTML;
  };

  async getLocationsWeather() {
    try {
      if (!this.lat || !this.lon) {
        console.error("Latitude and Longitude are required.");
        return;
      }

      const weather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&units=${this.units}&appid=${this.apiKey}`);
  
      this.fetchWeather = await weather.json();

      document.title = `Weather For ${this.fetchWeather.name}`;
  
      const currentTemp = ((this.fetchWeather.main.temp).toFixed(1)); 
  
      const itFeelsLike = ((this.fetchWeather.main.feels_like).toFixed(1));
  
      const windSpeed = this.fetchWeather.wind.speed;
  
      const weatherType = this.fetchWeather.weather[0].description.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  
      const humidity = `${this.fetchWeather.main.humidity}%`;
  
      const sunriseTime = dayjs(this.fetchWeather.sys.sunrise * 1000).format('h:mm A');
      const sunsetTime = dayjs(this.fetchWeather.sys.sunset * 1000).format('h:mm A');
  
      const html = `<div class="header">
                      <div class="your-location-info">${this.fetchWeather.name}</div>
                      <div class="time-info"></div>
                    </div>
                    <div class="main-container">
                      <div class="main-content">
                        <div>Weather Summary: ${weatherType}</div>
                        <hr class="easy-to-see-line"/>
                        <div class="temperature-info">Temperature: ${currentTemp}°F</div>
                        <hr class="easy-to-see-line"/>
                        <div class="feels-like-info">Feels Like: ${itFeelsLike}°F</div>
                        <hr class="easy-to-see-line"/>
                        <div class="sun-info">Sunrise: ${sunriseTime} | Sunset: ${sunsetTime}</div>
                        <hr class="easy-to-see-line"/>
                        <div class="wind-info">Wind Speed: ${windSpeed} mph</div>
                        <hr class="easy-to-see-line"/>
                        <div class="humidity-info">Humidity: ${humidity}</div>
                        <hr class="easy-to-see-line"/>
                      </div>
                      <div class="side-rating">
                          <div class="like"><span class="iconamoon--like-thin"></span></div>
                          <div class="dislike"><span class="iconamoon--dislike-thin"></span></div>
                      </div>
                    </div>`;
  
      document.querySelector('.container').innerHTML = html;

      const likeObject = document.querySelector('.like');
      const dislikeObject = document.querySelector('.dislike');

      let thoughts = JSON.parse(localStorage.getItem('thoughts'));
      console.log(thoughts);

      if (thoughts) {
        if (thoughts.includes('dis') && thoughts.includes('fill')) {
          dislikeObject.innerHTML = '<span class="iconamoon--dislike-fill"></span>';
        } else if (!thoughts.includes('dis') && thoughts.includes('fill')) {
          likeObject.innerHTML = '<span class="iconamoon--like-fill"></span>';
        };
      }

      likeObject.addEventListener('click', () => {
        if (likeObject.innerHTML !== '<span class="iconamoon--like-fill"></span>') {
            likeObject.innerHTML = '<span class="iconamoon--like-fill"></span>';
            dislikeObject.innerHTML = '<span class="iconamoon--dislike-thin"></span>'
            saveThoughtsToStorage(likeObject);
          } else {
            likeObject.innerHTML = '<span class="iconamoon--like-thin"></span>';
            saveThoughtsToStorage(likeObject);
          };
      });

      dislikeObject.addEventListener('click', () => {
        if (dislikeObject.innerHTML !== '<span class="iconamoon--dislike-fill"></span>') {
            dislikeObject.innerHTML = '<span class="iconamoon--dislike-fill"></span>';
            likeObject.innerHTML = '<span class="iconamoon--like-thin"></span>'
            saveThoughtsToStorage(dislikeObject);
          } else {
            dislikeObject.innerHTML = '<span class="iconamoon--dislike-thin"></span>';
            saveThoughtsToStorage(dislikeObject);
          };
      });
  
      this.getTime();
    } catch (error) {
      console.error(error);
    };
  };
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const location = new Weather(lat, lon);

    await location.getLocationsWeather();

    setInterval(() => {
      location.getTime();
    }, 1000);
  }, (error) => {
    console.error("Error getting location:", error);
  });
} else {
  console.log("Geolocation is not available in this browser.");
};

function saveThoughtsToStorage(object) {
  localStorage.setItem('thoughts', JSON.stringify(object.innerHTML));
}