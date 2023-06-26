window.onload = function () {
  const slogan1 = document.querySelector(".slogan1");
  const slogan2 = document.querySelector(".slogan2");
  const slogan3 = document.querySelector(".slogan3");
  slogan1.style.animationDelay = "1.5s";
  slogan2.style.animationDelay = "1.5s";
  slogan3.style.animationDelay = "1.5s";
};

const menuBtn = document.querySelector(".menu-btn");
const menuLine1 = document.querySelector(".btn-line1");
const menuLine2 = document.querySelector(".btn-line2");
const menuLine3 = document.querySelector(".btn-line3");
const menu = document.querySelector(".menu");

//Set initial State of Menu

let showMenu = false;

menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add("close");
    menuLine1.classList.add("close");
    menuLine2.classList.add("close");
    menuLine3.classList.add("close");
    menu.classList.add("show");

    //Set Menu State
    showMenu = true;
  } else {
    menuBtn.classList.remove("close");
    menuLine1.classList.remove("close");
    menuLine2.classList.remove("close");
    menuLine3.classList.remove("close");
    menu.classList.remove("show");

    //Set Menu State
    showMenu = false;
  }
}
