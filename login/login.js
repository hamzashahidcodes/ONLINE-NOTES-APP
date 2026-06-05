/*import { auth }
from "../firebase.js";*/
import { auth } from "../frontend/firebase.js";

import {
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

async function login(){

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try{

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login Successful");

        window.location.href = "../frontend/index.html";

    }

    catch(error){

    if(error.code === "auth/user-not-found"){

        alert("Email not found!");

    }

    else if(error.code === "auth/wrong-password"){

        alert("Incorrect Password!");

    }

    else if(error.code === "auth/invalid-email"){

        alert("Invalid Email Format!");

    }

    else if(error.code === "auth/invalid-credential"){

        alert("Email or Password is Incorrect!");

    }

    else{

        alert(error.message);

    }

}

}

function togglePassword(){

    const password =
    document.getElementById("password");

    if(password.type === "password"){

        password.type = "text";

    }

    else{

        password.type = "password";

    }

}

window.login = login;
window.togglePassword = togglePassword;