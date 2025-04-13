"use strict"

let panel1Cards = document.querySelectorAll("[aria-labelledby=tab1] .card");
let panel2Cards = document.querySelectorAll("[aria-labelledby=tab2] .card");
let panel3Cards = document.querySelectorAll("[aria-labelledby=tab3] .card");
let tabButtons = document.querySelectorAll(".tab");
let tablist = document.querySelector(".tablist");
let cards = document.querySelectorAll(".card");
let url = "./data.json";

for (let card of cards) { // style cursor: pointer explicitly by JS
  card.style.cursor = "pointer";
}

populateData(url);

tablist.addEventListener("click", handleClickOnTab);
setHandlerOnAllTabs(tabButtons);

function setHandlerOnAllTabs(tabs) {
  tabs.forEach((element, i) => {
    element.addEventListener("keydown", event => {
      let isDesktopSize = findViewportSize();
      if (isDesktopSize) {
        // tablist is vertical.
        event.preventDefault();
          if (event.code == "Tab") {
          let panel = document.querySelector(`[aria-labelledby=${event.target.id}]`);
          panel.querySelector(".card-link").focus();
        }
        if (i == 0) {
          if (event.code == "ArrowUp") {
            moveToLastTab(event.target);
          } else if (event.code == "ArrowDown") {
            moveToNextTab(event.target)
          }
        } else if (i >= tabs.length - 1) {
          if (event.code == "ArrowUp") {
            moveToPreviousTab(event.target);
          } else if (event.code == "ArrowDown") {
            moveToFirstTab(event.target);
          } 
        } else {
          if (event.code == "ArrowUp") {
            moveToPreviousTab(event.target);
          } else if (event.code == "ArrowDown") {
            moveToNextTab(event.target);
          }
        }
      } else {
        // tablist is horizontal.
        if (i == 0) {
          if (event.code == "ArrowLeft") {
            moveToLastTab(event.target);
          } else if (event.code == "ArrowRight") {
            moveToNextTab(event.target);
          }
        } else if (i >= tabs.length - 1) {
          if (event.code == "ArrowLeft") {
            moveToPreviousTab(event.target);
          } else if (event.code == "ArrowRight") {
            moveToFirstTab(event.target);
          }
        } else {
          if (event.code == "ArrowLeft") {
            moveToPreviousTab(event.target);
          } else if (event.code == "ArrowRight") {
            moveToNextTab(event.target);
          }
        }
      }
    })
  })
}

function moveToFirstTab(target) {
  updateAttributesToLeaveTarget(target);
  updateAttributesToSelectTarget(target.parentElement.firstElementChild);
  showNewPanel(target, target.parentElement.firstElementChild);
  target.parentElement.firstElementChild.focus();
}

function moveToLastTab(target) {
  updateAttributesToLeaveTarget(target);
  updateAttributesToSelectTarget(target.parentElement.lastElementChild);
  showNewPanel(target, target.parentElement.lastElementChild);
  target.parentElement.lastElementChild.focus();
}

function moveToNextTab(target) {
  updateAttributesToLeaveTarget(target);
  updateAttributesToSelectTarget(target.nextElementSibling);
  showNewPanel(target, target.nextElementSibling);
  target.nextElementSibling.focus();
}

function moveToPreviousTab(target) {
  updateAttributesToLeaveTarget(target);
  updateAttributesToSelectTarget(target.previousElementSibling);
  showNewPanel(target, target.previousElementSibling);
  target.previousElementSibling.focus();
}

function showNewPanel(target, newTarget) {
  document.querySelector(`[aria-labelledby=${target.id}]`).setAttribute("hidden", "");
  document.querySelector(`[aria-labelledby=${newTarget.id}]`).removeAttribute("hidden");
}

function updateAttributesToLeaveTarget(target) {
  target.setAttribute("aria-selected", "false");
  target.setAttribute("tabindex", "-1");
}

function updateAttributesToSelectTarget(newTarget) {
  newTarget.setAttribute("aria-selected", "true");
  newTarget.removeAttribute("tabindex");
}

function findViewportSize() {
  let mediaQueryList = window.matchMedia("(min-width: 32rem)");
  if (mediaQueryList.matches) {
    return true;
  } else {
    return false;
  }
}

function handleClickOnTab(event) {
  if (!event.target.classList.contains("tab")) return;
  if (event.target.getAttribute("aria-selected") == "true") return;

  for (let tab of tabButtons) {
    let panelId = tab.id;

    if (tab != event.target && tab.getAttribute("aria-selected") == "true") {
      updateAttributesToLeaveTarget(tab);
      document.querySelector(`[aria-labelledby=${panelId}]`).setAttribute("hidden", "");
    } else if (tab == event.target && tab.getAttribute("aria-selected") == "false") {
      updateAttributesToSelectTarget(tab);
      document.querySelector(`[aria-labelledby=${panelId}]`).removeAttribute("hidden");
    }
  }
}

async function populateData(url) {
  try {
    let data = await fetchData(url);

    data.forEach((element, i) => {
      updateEachPanel(panel1Cards, element, i, "daily");
      updateEachPanel(panel2Cards, element, i, "weekly");
      updateEachPanel(panel3Cards, element, i, "monthly");
    });
  } catch(error) {
    console.log(error)
  }
}

function updateEachPanel(panel, element, i, tabName) {
  panel[i].querySelector(".card-link").textContent = element.title;
  panel[i].querySelector(".hrs--current").textContent = element.timeframes[tabName].current;
  panel[i].querySelector(".hrs--previous").textContent = element.timeframes[tabName].previous;
}

async function fetchData(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    let data = await response.json();
    return data;
  } catch(error) {
    alert(error);
  }
}

