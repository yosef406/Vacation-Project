import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getUserSignInState } from "../data/slices/userSlice";
function SignUpForm() {
  // setting state data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //   setting usable functions
  const navigate = useNavigate(); // to navigate to different pages

  const signUpBtn = () => {
    setLoading(true);
    // getting input values
    let first_name = (document.getElementById("fNameIn") as HTMLInputElement)
      .value;
    let last_name = (document.getElementById("lNameIn") as HTMLInputElement)
      .value;
    let userName = (document.getElementById("userNameIn") as HTMLInputElement)
      .value;
    let password = (document.getElementById("passwordIn") as HTMLInputElement)
      .value;
    //    checking if all values are valid
    let validUserName = userName != null && userName !== "",
      validPassword = password != null && password !== "",
      validFName = first_name != null && first_name !== "",
      validLName = last_name != null && last_name !== "";

    if (!validUserName || !validPassword || !validFName || !validLName) {
      // ! setup clear details Errors
      setError("invalid details");
      setLoading(false);
      return;
    } else {
      setError("");
    }

    fetch("https://localhost:5000/users/signup", {
      method: "POST",
      body: JSON.stringify({ userName, password, first_name, last_name }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setLoading(false);
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          navigate("/signin");
        } else {
          setError("invalid details");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("something went wrong!!");
      });
  };

  //    getting important data (user)
  const userSignedIn = useSelector(getUserSignInState);
  //   changing pages according to user state
  if (userSignedIn) return <Navigate to="/" />;
  return (
    <>
      <div>
        <label>First Name: </label>
        <input disabled={loading} type="text" id="fNameIn" />
      </div>
      <div>
        <label>Last Name: </label>
        <input disabled={loading} type="text" id="lNameIn" />
      </div>
      <div>
        <label>UserName: </label>
        <input disabled={loading} type="text" id="userNameIn" />
      </div>
      <div>
        <label>Password: </label>
        <input disabled={loading} type="password" id="passwordIn" />
      </div>
      <div>
        <label>{error}</label>
      </div>
      {loading ? (
        <label>Loading...</label>
      ) : (
        <div>
          <button onClick={signUpBtn}>Sign Up</button>
          <label>or</label>
          <Link to="/signin">Sign In</Link>
        </div>
      )}
    </>
  );
}
export default SignUpForm;
