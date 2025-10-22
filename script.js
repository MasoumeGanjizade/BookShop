let isLoggedIn = false;
let pendingCheckout = false;

document.addEventListener("DOMContentLoaded", function () {
  // Login Elements
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  // Checkout Button
  const checkoutBtn = document.getElementById("checkout-btn");

  // Cart Elements
  const bookList = document.getElementById("book-list");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const books = [
    {
      id: 1,
      title: "Atomic Habits",
      price: 12.99,
      img: "https://centurionpt.com/wp-content/uploads/2024/04/featured-book-atomic-habits.jpg",
    },
    {
      id: 2,
      title: "The Alchemist",
      price: 9.99,
      img: "https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg",
    },
    {
      id: 3,
      title: "Deep Work",
      price: 14.5,
      img: "https://m.media-amazon.com/images/I/81N7FmJhbhL.jpg",
    },
    {
      id: 4,
      title: "Animal Farm",
      price: 8.99,
      img: "https://m.media-amazon.com/images/I/81NLG4DQhEL._SY425_.jpg",
    },
    {
      id: 5,
      title: "The Power of Now",
      price: 11.5,
      img: "https://jangal.com/_next/image?url=https%3A%2F%2Fjangal.com%2Fimages%2Fproduct-parent%2F5239%2FmuZrjOmDc35NugQ.jpg&w=640&q=75",
    },
    {
      id: 6,
      title: "The Psychology of Money",
      price: 13.25,
      img: "https://m.media-amazon.com/images/I/81Lb75rUhLL.jpg",
    },
  ];

  let cart = [];

  // Render Book Cards
  if (bookList) {
    books.forEach((book) => {
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-4");
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${book.img}" class="card-img-top" alt="${
        book.title
      }" style="height: 300px; object-fit: cover;">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text text-muted">$${book.price.toFixed(2)}</p>
            <button class="btn btn-primary mt-auto add-to-cart" data-id="${
              book.id
            }">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
      bookList.appendChild(card);
    });

    // Add to Cart
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const book = books.find((b) => b.id === id);
        const item = cart.find((i) => i.id === id);

        if (item) {
          item.qty++;
        } else {
          cart.push({ ...book, qty: 1 });
        }
        renderCart();
      });
    });
  }

  // Render Cart
  function renderCart() {
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const totalItem = (item.price * item.qty).toFixed(2);
      total += parseFloat(totalItem);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.title}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${
            item.qty
          }" class="form-control form-control-sm qty-input" data-id="${
        item.id
      }">
        </td>
        <td>${totalItem}</td>
        <td><button class="btn btn-danger btn-sm remove-item" data-id="${
          item.id
        }"><i class="fa-solid fa-trash"></i></button></td>
      `;
      cartItems.appendChild(tr);
    });

    cartTotal.textContent = "Total: $" + total.toFixed(2);

    // Remove Item
    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        cart = cart.filter((i) => i.id !== id);
        renderCart();
      });
    });

    // Update Quantity
    document.querySelectorAll(".qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const item = cart.find((i) => i.id === id);
        item.qty = parseInt(e.target.value);
        renderCart();
      });
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (username === "user" && password === "1234") {
        isLoggedIn = true;
        loginMessage.classList.remove("text-danger");
        loginMessage.classList.add("text-success");
        loginMessage.textContent = "Login successful!";
        loginMessage.classList.remove("d-none");

        // Redirect after login (works for normal login and checkout)
        setTimeout(() => {
          if (pendingCheckout) {
            pendingCheckout = false;
            prompt("Thank you for your purchase!");
          }
          window.location.href = "./index.html#store";
        }, 800);
      } else {
        isLoggedIn = false;
        loginMessage.classList.remove("text-success");
        loginMessage.classList.add("text-danger");
        loginMessage.textContent = "Invalid username or password.";
        loginMessage.classList.remove("d-none");
      }
    });
  }

  // Checkout Button Click
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (!isLoggedIn) {
        alert("You must log in first to proceed with checkout.");
        pendingCheckout = true;
        window.location.href = "./Login.html";
      }
    });
  }

  // Blog Post Alert
  document.querySelectorAll("#blog .btn-outline-primary").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("This blog post will be available soon!");
    });
  });
});

// Navbar Login/Logout button update
const loginNavBtn = document.getElementById("login-nav-btn");

function updateNavbarLogin() {
  if (!loginNavBtn) return;
  if (isLoggedIn) {
    loginNavBtn.textContent = "Logout";
    loginNavBtn.classList.remove("btn-warning");
    loginNavBtn.classList.add("btn-danger");
    loginNavBtn.href = "#";
    loginNavBtn.addEventListener("click", (e) => {
      e.preventDefault();
      isLoggedIn = false;
      alert("You have been logged out.");
      updateNavbarLogin();
    });
  } else {
    loginNavBtn.textContent = "Login";
    loginNavBtn.classList.remove("btn-danger");
    loginNavBtn.classList.add("btn-warning");
    loginNavBtn.href = "./Login.html";
  }
}

// Call it once when the page loads
updateNavbarLogin();



// Dark Mode
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("darkModeToggle");

  toggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    // Optional: change button label/icon
    if (document.body.classList.contains("dark-mode")) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light Mode';
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark Mode';
    }
  });
});
