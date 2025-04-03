"use strict"

let tabsDiv = document.querySelector(".tabs");
let buttons = document.querySelectorAll(".tab");
let currentHrs = document.querySelectorAll(".current-hrs");
let previousHrs = document.querySelectorAll(".previous-hrs");
let descriptionSpans = document.querySelectorAll(".text-tenses");
let url = "./data.json";

tabsDiv.addEventListener("click", handleClick);

function handleClick(event) {
  let target = event.target;
  if (target.tagName != "BUTTON") return;

  toggleButtonHighlighted(target, buttons);

  updateHrs(target, currentHrs, previousHrs, descriptionSpans);
}

async function updateHrs(target, currentHrs, previousHrs, spans) {
  try {
    let data = await fetchHrs(url);

    let title = target.dataset.value;
    data.forEach((element, i) => {
      currentHrs[i].textContent = element.timeframes[title].current;
      previousHrs[i].textContent = element.timeframes[title].previous;
      updateText(title, spans[i]);
    });
    return data;
  } catch(error) {
    console.log(error);
  }
}

async function fetchHrs(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    let data = await response.json();
    return data;
  } catch(error) {
    alert(error);
  }
}

function updateText(title, span) {
  if (title == "daily") {
    span.textContent = "Yesterday - "
  } else if (title == "weekly") {
    span.textContent = "Last Week - ";
  } else if (title == "monthly") {
    span.textContent = "Last Month - "
  }
}

function toggleButtonHighlighted(target, buttons) {
  for (let button of buttons) {
    if (target != button && button.hasAttribute("data-selected")) {
      button.removeAttribute("data-selected");
    } else if (target == button && !button.hasAttribute("data-selected")) {
      button.setAttribute("data-selected", true);
    }
  }
}