"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

const renderCountry = function (country, className) {
  const html = `
    <article class="country ${className}">
    <img class="country__img" src="${country.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${country.name.common}</h3>
      <h4 class="country__region">${country.continents[0]}</h4>
      <p class="country__row"><span>👫</span>${country.population}</p>
      <p class="country__row"><span>🗣️</span>${
        Object.values(country.languages)[0]
      }</p>
      <p class="country__row"><span>💰</span>${
        Object.values(country.currencies)[0].name
      }</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML("beforebegin", html);
  countriesContainer.style.opacity = 1;
};
const renderError = function (errmsg) {
  const html = `<h1>${errmsg} 🧐</h1>`;
  countriesContainer.insertAdjacentHTML("beforebegin", html);
  countriesContainer.style.opacity = 1;
};
const whereAmI = function (lat, lng) {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
  )
    .then((response) => {
      // console.log(r esponse);
      if (!response.ok)
        throw new Error(`Enter Correct Coordinates ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const [city, country] = [data.city, data.countryName];
      if (!city || !country) throw new Error(`No City and Country Found!`);
      console.log(`You are in ${city}, ${country}`);
      return fetch(
        `https://restcountries.com/v3.1/name/${country}?fullText=true`
      );
    })
    .then((response) => {
      console.log(response);
      if (!response.ok) throw new Error(`No Country Found ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log(data[0]);
      renderCountry(data[0]);
      const neighbourCountries = data[0].borders?.[0];
      if (!neighbourCountries) throw new Error(`No neighbouring country Found`);
      return fetch(
        `https://restcountries.com/v3.1/alpha/${neighbourCountries}`
      );
    })
    .then((response) => {
      console.log(response);
      if (!response.ok) throw new Error(`No Country Found`);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      renderCountry(data[0], "neighbour");
    })
    .catch((err) => {
      renderError(`An error occure! ${err.message}`);
      console.error(`An error occure! ${err.message}`);
    });
};

let flag = false;
btn.addEventListener("click", () => {
  const latitude = +latitudeInput.value.trim();
  const longitude = +longitudeInput.value.trim();
  if (flag) location.reload();
  if (!flag) {
    whereAmI(latitude, longitude);
    flag = true;
  }
  btn.textContent = "Search Again";
});
