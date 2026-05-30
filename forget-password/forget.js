import { auth } from "../frontend/firebase.js";

import {
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

async function resetPassword() {

    const email = document.getElementById("email").value;

    try {

        await sendPasswordResetEmail(auth, email);

        alert("Password reset email sent successfully!");
        window.location.href =
    "../login/login.html";

    } catch (error) {

        alert(error.message);

    }
}

window.resetPassword = resetPassword;