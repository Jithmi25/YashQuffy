import { BASE_AUTH_URL } from "./URL.js";

window.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  const inputFields = document.querySelectorAll(".form-control");

  // Hide error message when the user starts typing
  inputFields.forEach((field) => {
    field.addEventListener("input", () => {
      document.getElementById("error-message").style.display = "none";
    });
  });

  // Add submit event listener
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get input values
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate password match
    if (password !== confirmPassword) {
      displayError("Passwords do not match.");
      return;
    }

    try {
      // Send data to the server for signup
      const response = await signupUser(firstName, lastName, email, password);

      // Handle successful signup
      if (!response.error) {
        // Redirect to the login page after successful signup
        window.location.href = `../client/login.html`;
      } else {
        // Display server error message
        displayError(response.message);
      }
    } catch (error) {
      displayError("An error occurred during signup. Please try again.");
      console.error(error);
    }
  });
});

// Function to sign up the user by sending data to the backend
async function signupUser(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${BASE_AUTH_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    });

    // Try parsing the response to JSON
    let data;
    try {
      data = await response.json();
    } catch (err) {
      // If the response is not valid JSON, return a default error
      return { error: true, message: "Invalid response from server." };
    }

    // Handle success and failure responses
    if (response.ok) {
      // Return the response data on success
      return { error: false, ...data };
    } else {
      // Return an error with a message from the response (if available)
      return { error: true, message: data.message || "Signup failed." };
    }
  } catch (error) {
    // Log the error and return it as part of the return object
    console.error("Error during signup:", error);
    return { error: true, message: error.message };
  }
}

// Helper function to display error messages
function displayError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.color = "red";
  errorMessage.style.display = "block";
  errorMessage.innerHTML = message;
}
