
// Mengambil elemen HTML
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");

const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");
const weatherIcon = document.getElementById("weatherIcon");

// Fungsi mencari cuaca
async function getWeather() {

    const city = cityInput.value.trim();

    // Memeriksa apakah input kosong
    if (city === "") {
        message.textContent = "Silakan masukkan nama kota!";
        weatherInfo.style.display = "none";
        return;
    }

    message.textContent = "Sedang mencari data cuaca...";
    weatherInfo.style.display = "none";
    searchBtn.disabled = true;

    try {

        // Mengambil koordinat kota
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=id&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Gagal mengambil data lokasi.");
        }

        const geoData = await geoResponse.json();

        // Memeriksa apakah kota ditemukan
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("Kota tidak ditemukan!");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Mengambil data cuaca berdasarkan koordinat
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Gagal mengambil data cuaca.");
        }

        const weatherData = await weatherResponse.json();

        // Mengambil suhu dan kode cuaca
        const temp = weatherData.current.temperature_2m;
        const code = weatherData.current.weather_code;

        // Menentukan kondisi cuaca
        let condition = "";
        let icon = "";

        if (code === 0) {
            condition = "Cerah";
            icon = "☀️";

        } else if (code === 1 || code === 2) {
            condition = "Cerah Berawan";
            icon = "🌤️";

        } else if (code === 3) {
            condition = "Mendung";
            icon = "☁️";

        } else if ([45, 48].includes(code)) {
            condition = "Berkabut";
            icon = "🌫️";

        } else if ([51, 53, 55, 56, 57].includes(code)) {
            condition = "Gerimis";
            icon = "🌦️";

        } else if ([61, 63, 65, 66, 67].includes(code)) {
            condition = "Hujan";
            icon = "🌧️";

        } else if ([71, 73, 75, 77].includes(code)) {
            condition = "Salju";
            icon = "❄️";

        } else if ([80, 81, 82].includes(code)) {
            condition = "Hujan Lebat";
            icon = "🌧️";

        } else if ([95, 96, 99].includes(code)) {
            condition = "Badai Petir";
            icon = "⛈️";

        } else {
            condition = "Tidak diketahui";
            icon = "🌡️";
        }

        // Menampilkan hasil cuaca
        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent = `${temp}°C`;
        weatherCondition.textContent = condition;
        weatherIcon.textContent = icon;

        weatherInfo.style.display = "block";

        message.textContent = "";

    } catch (error) {

        // Menampilkan pesan kesalahan
        message.textContent = error.message;
        weatherInfo.style.display = "none";

    } finally {

        searchBtn.disabled = false;

    }
}

// Event ketika tombol Cari Cuaca diklik
searchBtn.addEventListener("click", getWeather);

// Event ketika tombol Enter ditekan
cityInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});
