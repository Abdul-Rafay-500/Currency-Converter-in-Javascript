const API_KEY = "2dad3b8022c3d4c0f68b6ce8";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const valueDisplay = document.querySelector(".value");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOpt = document.createElement("option");
    newOpt.innerText = currCode;
    newOpt.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOpt.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOpt.selected = "selected";
    }
    select.append(newOpt);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  const amountInput = document.querySelector(".input input");
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  try {
    const URL = `${BASE_URL}/${fromCurr.value}/${toCurr.value}`;
    const response = await fetch(URL);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rate;
      const convertedAmount = (rate * amtVal).toFixed(2);
      valueDisplay.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } else {
      valueDisplay.innerText = "Failed to fetch exchange rate. Try again!";
    }
  } catch (error) {
    valueDisplay.innerText = "Error occurred. Please check your internet connection.";
    console.error("API Fetch Error:", error);
  }
});
