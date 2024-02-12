// access elements in html
const addToCartBtn = document.querySelector("#add-to-cart-btn");
const emptyCartBtn = document.querySelector("#empty-cart-btn");
const cartSummary = document.querySelector("#cart-summary");

// reservation timeout 20 min (in millisec)
const reservationTimeout = 20 * 60 * 1000;

// for logging when item was last added to cart
let lastItemWasAdded = null;

// if anything in session storage, get it
// if nothing, initialise empty array
let cartContents = JSON.parse(sessionStorage.getItem("cartContents")) || [];

function checkIfSessionExpired() {
  //if (cartContents.length > 0) {

  // if cart is not empty
  if (lastItemWasAdded) {
    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - lastItemWasAdded;
    if (timeElapsed >= reservationTimeout) {
      emptyCart();
      alert("Your reservation has expired");
    }
  }
  //}
}

// for checking if there are already ticket/s for a given club in the cart
function findItemByTitle(title) {
  return cartContents.find(item => item.title === title)
}

// DUMMY
class ClubTicket {
  constructor(title, price) {
    this.title = title;
    this.price = price;
    this.amount = 0;
  }
}

// will need values from events database
// this is a drill
let bookClubTicket = new ClubTicket("Book Club Ticket", 100.00);

addToCartBtn.addEventListener("click", () => {
  let alreadyInCart = findItemByTitle(bookClubTicket.title);

  // if ticket/s for chosen club already in cart: update object amount only
  if (alreadyInCart) {
    alreadyInCart.amount++;
  }
  // if ticket/s for chosen club not in cart: add object to array
  else {
    cartContents.push({
      title: bookClubTicket.title,
      amount: 1
    });
  }

  // sets time for last addition to cart
  lastItemWasAdded = new Date().getTime();

  // update cart here
  checkEmptyCartBtnState();

  setTimeout(checkIfSessionExpired, reservationTimeout);
});

function emptyCart() {
  // empty array of cart content
  cartContents.forEach(item => {
    item.amount = 0;
  });
  cartContents = [];
  // update session storage
  sessionStorage.setItem("cartContents", JSON.stringify(cartContents));
  // update cart here
  checkEmptyCartBtnState();
}

function checkEmptyCartBtnState() {
  // if nothing in cart: empty cart button disabled
  emptyCartBtn.disabled = cartContents.length === 0;
}

// check initial state of btn
checkEmptyCartBtnState();

emptyCartBtn.addEventListener("click", () => {
  emptyCart();
});

