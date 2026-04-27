// Function when the "Place Order" button is clicked.
document.getElementById("orderBtn").addEventListener("click", function (event) {
  event.preventDefault(); // prevents page reload

  const form_ = document.getElementById("cartOrder");
  const info = Object.fromEntries(new FormData(form_).entries());
  const inputs = document.querySelectorAll("#cartOrder input");

  var tagName = "response";
  //Check all the form entries not blank.
  var value = checkForm(inputs, tagName);
  if (!value) {
    return;
  }

  //Get the item quantities to send to flask.
  var itemQuan = [
    "#cardsCart",
    "#puckCart",
    "#stickCart",
    "#maskCart",
    "#mysPack",
    "#tShirt",
  ];
  var quant = {};

  for (var item of itemQuan) {
    var itemQ = $(item).text();
    quant[item] = itemQ;
  }

  var totlPrice = $("#totalCost").text();

  //Check if items are added by looking at the price.
  var isNotZero = parseInt(totlPrice);

  if (isNotZero < 1) {
    var message =
      "Your cart is empty. Please add items before placing an order.";
    document.getElementById("response").innerText = message;
    return;
  }
  var shipVal = $("#shipCost").text();

  //Create the total price.
  const payload = {
    form: info,
    quantities: quant,
    totPrice: totlPrice,
    shipping: shipVal,
  };

  // Send data to flask application
  fetch("/submit_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("response").innerText = data.message;
      resetCart();
    });
});

//Function to check if the form entries are all filled.
//Takes the form input, and the tag name to update for any errors.
function checkForm(formInput, tagName) {
  // Check form has valid entries in the form.
  var isValid = true;
  formInput.forEach((input) => {
    //If anything is empty we can't place the order.
    if (input.value.trim() === " " || !input.value) {
      isValid = false;
      return;
    }
  });

  // Display a message to fill out the form.
  if (!isValid) {
    var message = "Please fill out all required fields.";
    document.getElementById(tagName).innerText = message;
    return false;
  }
  return true;
}

//Zero value
const zero_ = 0;

// Remove items in shopping cart and set totals to zero.
function resetCart() {
  // Hide/Reset shopping cart quantities.
  document.getElementById("hockeyCards").style.display = "none";
  document.getElementById("hockeyPuck").style.display = "none";
  document.getElementById("mystPackage").style.display = "none";
  document.getElementById("goalieMask").style.display = "none";
  document.getElementById("miniStick").style.display = "none";
  document.getElementById("shirt").style.display = "none";

  //Reset quantity totals.
  var itemQuan = [
    "#cardsCart",
    "#puckCart",
    "#stickCart",
    "#maskCart",
    "#mysPack",
    "#tShirt",
  ];

  // Set all the cart item quantities to zero.
  for (var item of itemQuan) {
    $(item).text(zero_);
  }

  //Update the cart on the
  document.getElementById("cartCount").textContent = zero_;

  // Update Total and subtotal to zero.
  // var zero = 0.0;
  $("#itemValue").text(zero_.toFixed(2));
  $("#totalCost").text(zero_.toFixed(2));
}

//Check if an item was added to the cart.
document.querySelectorAll(".cardBtn").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const price = parseInt(this.dataset.price);
    const product = this.dataset.item;
    const itemAdd = this.dataset.cart;
    updatePrice(price, product, itemAdd);
    updateNavCart(1);
  });
});

let count = 0;
//Update the naviation Cart
function updateNavCart(value) {
  count += value;
  document.getElementById("cartCount").textContent = count;
}

//Update the price on the page
function updatePrice(price, product, itemAdd) {
  // Get all the items in the cart
  document.getElementById("#itemValue");
  var stringValue = $("#itemValue").text();
  var intValue = parseFloat(stringValue, 10);

  if (Number.isFinite(price)) {
    intValue += price;
  }

  var shipPrice = parseFloat($("#shipCost").text(), 10);
  var totValue = zero_;
  //Ensures the cart is not empty.
  if (intValue > zero_) {
    totValue = intValue + shipPrice;
  }

  $("#itemValue").text(intValue.toFixed(2));
  $("#totalCost").text(totValue.toFixed(2));

  //Only update if a product is added to the cart.
  if (product !== "") {
    updateCart(product, itemAdd);
  }
}

//Timed notification for adding items to the cart
function showToast(message) {
  const toast = document.getElementById("toastNotify");

  toast.textContent = message;
  toast.classList.add("show");

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

//Function to update the quantities of the cart
//and show the items in the cart.
function updateCart(product, itemAdd) {
  var item = "";
  if (product === "hockeyCards") {
    var stringValue = $("#cardsCart").text();

    var intValue = parseInt(stringValue, 10);
    intValue += 1;
    item = "Women's Hockey Cards";
    const element = document.getElementById(product);

    if (element.style.display === "none") {
      // Display the item in shopping cart and enable the buttons
      element.style.display = "flex";
      const buttons = document.querySelectorAll(".cardsButton");
      buttons.forEach((button) => {
        button.disabled = false;
      });
      const removeButt = document.querySelectorAll(".removeItem");
      removeButt.forEach((reButton) => {
        reButton.disabled = false;
      });
    }
    $("#cardsCart").text(intValue);
  }

  if (product === "hockeyPuck") {
    var stringValue = $("#puckCart").text();
    var intValue = parseInt(stringValue, 10);
    intValue += 1;
    item = "Signed Hockey Puck";

    const element = document.getElementById("hockeyPuck");
    if (element.style.display === "none") {
      element.style.display = "flex";
      const buttons = document.querySelectorAll(".cardsButton");
      buttons.forEach((button) => {
        button.disabled = false;
      });
      const removeButt = document.querySelectorAll(".removeItem");
      removeButt.forEach((reButton) => {
        reButton.disabled = false;
      });
    }
    $("#puckCart").text(intValue);
  }

  //Updating mystery in the cart
  if (product === "mystPackage") {
    var stringValue = $("#mysPack").text();
    var intValue = parseInt(stringValue, 10);
    intValue += 1;
    item = "Mystery Package";

    const element = document.getElementById("mystPackage");
    if (element.style.display === "none") {
      element.style.display = "flex";
      const buttons = document.querySelectorAll(".cardsButton");
      buttons.forEach((button) => {
        button.disabled = false;
      });
      const removeButt = document.querySelectorAll(".removeItem");
      removeButt.forEach((reButton) => {
        reButton.disabled = false;
      });
    }
    $("#mysPack").text(intValue);
  }

  //Updating deluxe in the cart
  if (product === "goalieMask") {
    var stringValue = $("#maskCart").text();
    var intValue = parseInt(stringValue, 10);
    intValue += 1;
    item = "Signed Goalie Mask";

    const element = document.getElementById("goalieMask");
    if (element.style.display === "none") {
      element.style.display = "flex";
      const buttons = document.querySelectorAll(".cardsButton");
      buttons.forEach((button) => {
        button.disabled = false;
      });
      const removeButt = document.querySelectorAll(".removeItem");
      removeButt.forEach((reButton) => {
        reButton.disabled = false;
      });
    }
    $("#maskCart").text(intValue);
  }

  //Updating deluxe in the cart
  if (product === "miniStick") {
    var stringValue = $("#stickCart").text();
    var intValue = parseInt(stringValue, 10);
    intValue += 1;
    item = "Mini Stick";

    const element = document.getElementById("miniStick");
    if (element.style.display === "none") {
      element.style.display = "flex";
      const buttons = document.querySelectorAll(".cardsButton");
      buttons.forEach((button) => {
        button.disabled = false;
      });
      const removeButt = document.querySelectorAll(".removeItem");
      removeButt.forEach((reButton) => {
        reButton.disabled = false;
      });
    }
    $("#stickCart").text(intValue);
  }

  //Updating deluxe in the cart
  if (product === "t_shirt") {
    var stringValue = $("#tShirt").text();
    var intValue = parseInt(stringValue, 10);
    intValue += 1;
    item = "Women's Hockey T-shirts";

    const element = document.getElementById("shirt");
    if (element.style.display === "none") {
      element.style.display = "flex";
      const buttons = document.querySelectorAll(".cardsButton");
      buttons.forEach((button) => {
        button.disabled = false;
      });
      const removeButt = document.querySelectorAll(".removeItem");
      removeButt.forEach((reButton) => {
        reButton.disabled = false;
      });
    }
    $("#tShirt").text(intValue);
  }

  //Pop up when item is added to the cart.
  if (itemAdd) {
    var message = `${item} was added to the cart`;
    showToast(message);
  }
}

// Change in the shipping dropdown.
$("#shipDrop").change(function () {
  var selectedValue = $(this).val();
  var ship = zero_;

  if (selectedValue === "europe") {
    ship = 10.0;
  } else if (selectedValue === "asia") {
    ship = 7.0;
  } else if (selectedValue === "northAmerica") {
    ship = 5.0;
  }
  //Sets shipping cost to two decimal places.
  $("#shipCost").text(ship.toFixed(2));

  //Get the subtotal.
  var intValue = parseFloat($("#itemValue").text(), 10);

  //Only update the total when items are in the cart.
  if (intValue > zero_) {
    updatePrice();
  }
});

//Send contact info to middleware to save to MongoDB.
document.getElementById("sendMessage").addEventListener("click", function (e) {
  e.preventDefault();

  const form_ = document.getElementById("contForm");
  const pay = Object.fromEntries(new FormData(form_).entries());
  const formFields = document.querySelectorAll(
    "#contForm input, #contForm textarea",
  );

  var tagName = "messResponse";
  var allEntries = checkForm(formFields, tagName);

  if (!allEntries) {
    return;
  }

  //Create the total price.
  const payload = {
    form: pay,
  };

  // Send form info to the flask application
  fetch("/send_message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("messResponse").innerText = data.message;
    });
});

//Navigation search button
document.getElementById("searchBar").addEventListener("submit", function (e) {
  e.preventDefault(); // 🚨 stops page refresh

  //Creating keywords to navigate to different sections.
  let sections = [
    { keywords: ["home", "top", "intro"], id: "intro" },
    {
      keywords: ["memorabilia", "prod", "products", "package", "item"],
      id: "products",
    },
    { keywords: ["pay", "shop", "checkout", "check", "cart"], id: "billing" },
    { keywords: ["info", "customer", "service", "phone"], id: "storeInfo" },
    { keywords: ["story", "about", "info", "us"], id: "ourStory" },
    { keywords: ["contact", "cont", "us"], id: "contact" },
    {
      keywords: ["track", "order", "search", "track order", "search order"],
      id: "trackOrderSection",
    },
  ];

  let input = document.getElementById("searchInput").value.toLowerCase();

  //Check if the word exists in each section.
  for (let section of sections) {
    if (section.keywords.some((word) => input.includes(word))) {
      let match = document.getElementById(section.id);
      if (match) {
        match.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  }
  //When nothing matches.
  showToast("No match found");
});

//Enable buttons to add/remove items from the cart.
document.querySelectorAll(".cardsButton").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const price = parseInt(this.dataset.price);
    const nameBox = this.dataset.item;
    const product = this.dataset.id;
    const sign = parseInt(this.dataset.sign);
    adjustCart(sign, product, nameBox, price);
  });
});

//Function that updates the cart with item and prices.
function adjustCart(quant, product, displayBox, price) {
  var itemQuant = $(product).text();
  var intValue = parseInt(itemQuant);

  // When the quantity is now empty the item is removed from display.
  if ((quant == zero_) & (intValue == 1)) {
    intValue -= 1;
    updatePrice(price * -1, product);
    updateNavCart(-1);
    document.getElementById(displayBox).style.display = "none";
  }
  //Subtract from the cart
  else if (quant == zero_) {
    intValue -= 1;
    price = price * -1;
    updatePrice(price, product);
    updateNavCart(-1);
  }
  //Add to the cart.
  else {
    intValue += 1;
    updatePrice(price, product);
    updateNavCart(1);
  }
  $(product).text(intValue);
}

//Create the order retrieval table.
//Takes the order object from database and the HTML parent.
function createOrderTable(orderResults, order) {
  var boldText = document.createElement("strong");

  const title = document.createElement("h2");
  title.textContent = `Order Summary`;
  orderResults.appendChild(title);

  const cust = document.createElement("p");
  boldText.textContent = "Customer Name: ";
  cust.appendChild(boldText);

  //Assign the span to name in order to delete later
  const nameSpan = document.createElement("span");
  nameSpan.textContent = order.name;
  nameSpan.id = "CustomerName";

  cust.append(nameSpan);
  orderResults.appendChild(cust);

  const date = document.createElement("p");
  var dateText = document.createElement("strong");
  dateText.textContent = `Date Ordered: `;
  date.append(dateText);

  //Assign the element ID in order to delete later.
  const dateSpan = document.createElement("span");
  dateSpan.textContent = order.orderDate;
  dateSpan.id = "DateOrdered";

  date.append(dateSpan);
  orderResults.appendChild(date);

  const city = document.createElement("p");
  var cityText = document.createElement("strong");
  cityText.textContent = `Location: `;
  city.append(cityText);
  city.append(order.city);
  orderResults.appendChild(city);

  //Create a table for the products, quantity and price.
  var table = document.createElement("table");
  table.id = "itemTable";
  const descRow = document.createElement("tr");
  const description = ["Item", "Quantity", "Unit Price"];

  //Loop through the headers.
  description.forEach((head) => {
    const sec = document.createElement("th");
    sec.textContent = head;
    descRow.appendChild(sec);
  });
  table.appendChild(descRow);

  //Add each product to the table.
  for (var item of order.items) {
    const row = document.createElement("tr");

    const prod = document.createElement("td");
    prod.textContent = item.productName;
    prod.className = "prod-name";

    const quant = document.createElement("td");
    quant.className = "qty-cell";
    quant.textContent = item.quantity;

    const priceSec = document.createElement("td");
    const spanPrice = document.createElement("span");

    spanPrice.textContent = `${item.pricePer.toFixed(2)}`;
    priceSec.textContent = "$";
    spanPrice.className = "price-per";

    priceSec.append(spanPrice);
    row.append(prod);
    row.appendChild(quant);

    row.appendChild(priceSec);
    table.appendChild(row);
  }
  orderResults.appendChild(table);

  //Add a break
  const space_ = document.createElement("br");
  orderResults.appendChild(space_);

  const shipPrice = document.createElement("p");
  var strongText = document.createElement("strong"); //Bold
  strongText.textContent = `Shipping Price: $${order.shipPrice.toFixed(2)}`;
  shipPrice.append(strongText);
  orderResults.appendChild(shipPrice);

  const totalPrice = document.createElement("p");
  var totalText = document.createElement("strong"); //Bold
  totalText.textContent = `Total Price: $${order.totalPrice.toFixed(2)}`;
  totalPrice.append(totalText);
  orderResults.appendChild(totalPrice);

  //Create a div to format buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-group";


  //Create the edit order button
  var editOrd = document.createElement("button");
  editOrd.textContent = "Edit";
  editOrd.id = "editButton";
  // orderResults.appendChild(editOrd);

  //Create the update order button
  var upOrd = document.createElement("button");
  upOrd.textContent = "Update";
  upOrd.id = "updateButton";
  // orderResults.appendChild(upOrd);

  //Create the delete order button
  var deleteOrd = document.createElement("button");
  deleteOrd.textContent = "Cancel";
  deleteOrd.id = "deleteButton";

  // orderResults.appendChild(deleteOrd);

  buttonContainer.appendChild(editOrd);
  buttonContainer.appendChild(upOrd);
  buttonContainer.appendChild(deleteOrd);

  orderResults.appendChild(buttonContainer);
}

// Track the order history of an email/name.
document
  .getElementById("ordSearchBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const form_ = document.getElementById("historyForm");
    const pay = Object.fromEntries(new FormData(form_).entries());
    console.log(pay);

    const isName = document.getElementById("histName").value.trim();
    const isEmail = document.getElementById("histEmail").value.trim();

    const orderResults = document.getElementById("orderResults");
    orderResults.innerHTML = "";

    //Check for invalid input (name and email not entered)
    if (!isName && !isEmail) {
      var notFound = document.createElement("h2");
      notFound.textContent = "Please enter an Email or Name";
      orderResults.appendChild(notFound);
      //Show content
      orderResults.style.display = "block";
      return;
    }
    //Create the payload
    const payload = {
      form: pay,
    };

    // Send form info to the flask application
    fetch("/get_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        const order = data.success;
        //Creating HTMl elements to show the order info.

        if (order) {
          createOrderTable(orderResults, order);
        } else {
          var notFound = document.createElement("h2");
          notFound.textContent = "No order found for this search";
          orderResults.appendChild(notFound);
        }
        //Show content
        orderResults.style.display = "block";
      });
  });

//Remove an Item from the cart
document.querySelectorAll(".removeItem").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const price = parseInt(this.dataset.price);
    const item = this.dataset.item;
    const product = this.dataset.id;

    //Get the quantity.
    var itemQuant = $(product).text();
    var intValue = parseInt(itemQuant);

    //Get the total price of item to update
    var updatedTotal = price * -1 * intValue;

    //Update the price and cart display
    updatePrice(updatedTotal, product);
    updateNavCart(intValue * -1);
    $(product).text(zero_);
    document.getElementById(item).style.display = "none";
  });
});

//Check the body action listener for dynamic buttons.
document.body.addEventListener("click", function (event) {
  //Check that the delete
  if (event.target.id === "deleteButton") {
    event.preventDefault(); // prevents page reload
    //Confirm deletion
    var result = confirm("Are you sure you want to cancel this order?");
    if (result) {
      deleteOrder();
    }
    return;
  }

  if (event.target.id === "editButton") {
    event.preventDefault(); // prevents page reload
    editOrder();
    return;
  }
  if (event.target.id === "updateButton") {
    event.preventDefault(); // prevents page reload
    updateOrder();
    return;
  }
});

//Function to delete orders from the middleware.
function deleteOrder() {
  var name = document.getElementById("CustomerName").innerText;
  var orderDate = document.getElementById("DateOrdered").innerText;

  //In case there are blanks.
  if (!name & !orderDate) {
    alert("Something went wrong");
    return;
  }

  //Create the payload.
  const payload = {
    name: name,
    ordDate: orderDate,
  };

  // Send delete info to the flask application
  fetch("/delete_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      //Update the message to the user
      const orderResults = document.getElementById("orderResults");

      //Clear the contents.
      orderResults.innerHTML = "";

      var deleteHead = document.createElement("h2");
      deleteHead.textContent = data.success;
      orderResults.appendChild(deleteHead);

      //Display the changes
      orderResults.style.display = "block";
    });
}

//Make the quantity of each item in the table editable
function editOrder() {
  const qtyCells = document.querySelectorAll(".qty-cell");

  qtyCells.forEach((cell) => {
    const currentValue = cell.textContent.trim();
    cell.innerHTML = `<input type="number" class="qty-cell" 
          style="width:70px;" value="${currentValue}" min="1">`;
  });
}

//Update the order by sending the data to flask.
function updateOrder() {
  // Get the customer and date
  var customer = document.getElementById("CustomerName").innerText;
  var orderDate = document.getElementById("DateOrdered").innerText;

  //Get the item list.
  var rows = document.querySelectorAll("#itemTable tr"); //tbody tr");

  const updateCart = [];
  var count = 0;
  var quantity = 0;

  rows.forEach((row) => {
    //Skip the table header row.
    if (count < 1) {
      count = count + 1;
      return;
    }

    //Get the product name, quant and price.
    const name = row.querySelector(".prod-name").textContent.trim();
    quantity = row.querySelector(".qty-cell input").value;
    const price = row.querySelector(".price-per").textContent;

    //Add items to a list
    updateCart.push({
      productName: name,
      quantity: Number(quantity),
      pricePer: Number(price),
    });
  });
  const qty = Number(quantity);

  //Check if the cart will be empty
  if (updateCart.length == 1 && qty === 0) {
    var checkDelete = confirm("Are you sure you wish to delete your order?");
    if (!checkDelete) {
      return;
    }
  }

  //Create the total price.
  const payload = {
    products: updateCart,
    customer: customer,
    dateOrder: orderDate,
  };

  // Send data to flask application
  fetch("/update_order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      const orderResults = document.getElementById("orderResults");
      orderResults.innerHTML = "";

      // When the order updated successfull.
      if (data.order) {
        const updateCart = document.createElement("h1");
        updateCart.innerText = data.success;
        orderResults.appendChild(updateCart);

        //Show the time of order update
        const changesSave = document.createElement("p");
        const now = new Date();
        const currTime = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        changesSave.innerText = `Changes saved at ${currTime}`;
        orderResults.appendChild(changesSave);

        createOrderTable(orderResults, data.order);
      } else {
        const updateCart = document.createElement("h1");
        updateCart.innerText = data.success;
        orderResults.appendChild(updateCart);
        orderResults.style.display = "block";
      }
    });
}
