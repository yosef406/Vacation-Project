// imports
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { addUser, getUserSignInState } from "../data/slices/userSlice";
import { removeVacations } from "../data/slices/vacationSlice";
import style from "../scss/signInForm.module.scss";

function SignInForm() {
  // setting state data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //   const [signInData, setSignInData] = useState({ userName: "", password: "" });

  //   setting usable functions
  const dispatch = useDispatch(); // to use redux functions
  const navigate = useNavigate(); // to navigate to different pages

  const signInBtn = () => {
    setLoading(true);
    // getting input values
    let userName = (document.getElementById("userNameIn") as HTMLInputElement)
      .value;
    let password = (document.getElementById("passwordIn") as HTMLInputElement)
      .value;
    let validUserName = userName != null && userName !== "",
      validPassword = password != null && password !== "";

    if (!validUserName || !validPassword) {
      setError("invalid userName or password");
      setLoading(false);
      return;
    } else {
      setError("");
    }

    fetch("https://localhost:5000/users/signin", {
      method: "POST",
      body: JSON.stringify({ userName, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setLoading(false);
        return response.json();
      })
      .then((data) => {
        if (data.success === true) {
          dispatch(addUser(data.user));
          navigate("/");
        } else {
          setError("invalid userName or password");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("something went wrong!!");
      });
  };
  dispatch(removeVacations());

  //    getting important data (user)
  const userSignedIn = useSelector(getUserSignInState);

  //   changing pages according to user state
  if (userSignedIn) return <Navigate to="/" />;

  return (
    <>
      <div className={style.main}>
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
            <button onClick={signInBtn}>Sign In</button>
            <label>or</label>
            <Link className={style.Link} to="/signup">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default SignInForm;
