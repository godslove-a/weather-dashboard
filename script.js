const input = document.getElementById("cityInput");
const button = document.getElementById("searchButton");
const loading = document.getElementById("loading");
const result = document.getElementById("weatherResult");

button.addEventListener("click", fetchWeather);

async function fetchWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        result.innerText = "Please enter a city";
        return;
    };

localStorage.setItem('lastCity', city);

loading.style.display = "block";
result.innerHTML = "";

const apiKey = "3b8469061c54453faebe693629dd386c";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
} catch (err) {
   result.innerText = err.message;
} finally {
    loading.style.display = "none";
}
};

function displayWeather(data) {
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.body.style.backgroundImage = "none";
    if (description.includes('rain')) {
        document.body.style.backgroundColor = 'lightblue';
    } else if (description.includes ('clear')) {
        document.body.style.backgroundColor = 'lightyellow';
    } else if (description.includes('cloud')) {
        document.body.style.backgroundColor = 'grey';
    } else {
        document.body.style.backgroundColor = 'lightpink';
    }

    const cityName = data.name;
    const country = data.sys.country;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = hours + ":" + (minutes < 10 ? "0" : "") + minutes;

    result.innerHTML = 
    '<h2>' + cityName + ', ' + country + '</h2>' + 
    '<p>Time: ' + timeString + '</p>' + 
    '<p>Temperature: ' + temperature + '°C</p>' + 
    '<p>Humidity: ' + humidity + '%</p>' + 
    '<p>Condition: ' + description + '</p>' + 
    '<img src="' + iconUrl + '" alt="Weather icon">';
}

window.addEventListener('load', function() {
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
        const lastCityName = document.getElementById("lastCityName");
        lastCityName.textContent = savedCity;
    }
});