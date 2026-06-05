import { auth } from "../firebase.js";

import {
    createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

async function signup(){

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){

        alert("Passwords do not match");
        return;
    }

    try{

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Account Created Successfully");

    }
    catch(error){

        alert(error.message);

    }
}

window.signup = signup;