document.addEventListener("DOMContentLoaded", function () {
  createNavDropdown();
  document.getElementById("username").innerHTML = localStorage.getItem("username");
});

createNavDropdown = async () => {
  const profileIcon = document.getElementById("profileIcon");

  profileIcon.addEventListener("click", function (event) {
    event.preventDefault();
    const list = document.getElementById("navLinksList");
    const isAdmin = localStorage.getItem("isAdmin");

    if (isAdmin === '1') {
      list.innerHTML = `
            <li class="dropdown-item" id="logout">Logout</li>
            `;
    } else {
      list.innerHTML = `
            <li class="dropdown-item" id="logout">Logout</li>
            `;
    }
    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "../client/login.html";
    });
  });
};
