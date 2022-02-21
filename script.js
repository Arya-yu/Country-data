"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const imgContainer = document.querySelector(".images");

const apiKey = config.apiKey;

function renderCountry(data, className = "") {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${Object.values(
        data.languages
      )}</p>
      <p class="country__row"><span>💰</span>${
        Object.values(data.currencies)[0].name
      }</p>
    </div>
  </article>`;
  countriesContainer.insertAdjacentHTML("beforeend", html);

  countriesContainer.style.opacity = 1;
}

function getPosition() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function whereAmI() {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse-Geocoding
    const resGeo = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`
    );
    if (!resGeo.ok) throw new Error("Problem getting location data");

    const dataGeo = await resGeo.json();

    // Country data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.features[0].properties.country}`
    );
    if (!resGeo.ok) throw new Error("Problem getting country");

    const [data] = await res.json();
    renderCountry(data);

    return `You are in ${dataGeo.features[0].properties.city}, ${dataGeo.features[0].properties.country}`;
  } catch (err) {
    renderError(`Something went wrong 🛠️ ${err.message}`);

    // Reject promise returned from async function
    throw err;
  }
}

btn.addEventListener("click", function() {
  whereAmI()
    .then(city => console.log(city))
    .catch(err => console.error(`${err.message} 🛠️`));
});
