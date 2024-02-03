import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./component/css/login.css";
import { firebase, usersCollection } from "./component/firebase";

const Login = () => {
  const [Uname, setUname] = useState("");
  const [Email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (Uname !== "") {
      try {
        // Sign in with Google
        const userCredential = await signInWithGoogle();

        // Get the authenticated user's UID
        const { uid, email } = userCredential.user;

        // Add user data to Firestore
        await usersCollection.doc(uid).set({
          username: Uname,
          email: email,
          addeddate: firebase.firestore.FieldValue.serverTimestamp(),
          status: "Active",
        });

        // Redirect to the App component after successful login
        navigate("/App");
      } catch (error) {
        console.error("Error adding user", error);
      }
    } else {
      if (Uname !== "") alert("Enter Username");
      else alert("Enter Email");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      return result;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  return (
    <div className="login-container">
      <h1>Weatherteller</h1>
      <h1>Login</h1>
      <form className="login-form">
        <label>UserName:</label>
        <input
          type="text"
          value={Uname}
          onChange={(e) => setUname(e.target.value)}
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
