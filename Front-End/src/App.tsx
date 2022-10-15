import style from "./scss/App.module.scss";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import SignInForm from "./components/signinForm";
import Home from "./components/home";
import SignUpForm from "./components/signupForm";
import {
  removeUser,
  getUserSignInState,
  getUserRole,
  getUser,
} from "./data/slices/userSlice";
import { removeVacations } from "./data/slices/vacationSlice";
import { useDispatch, useSelector } from "react-redux";
import NewVacation from "./components/newVacation";
import { useState } from "react";
import ChartPage from "./components/chartPage";

function App() {
  const dispatch = useDispatch(); // to use redux functions
  const userSignedIn = useSelector(getUserSignInState);
  const userRole = useSelector(getUserRole);
  const user = useSelector(getUser);
  const [filter, setFilter] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={style.App}>
      <header className={style.App_header}>
        <div className={style.App_header_content}>
          <h2>Vacations</h2>
          <div>
            <Link className={style.link} to="/">
              Home
            </Link>
            {userSignedIn && userRole === "admin" ? (
              <>
                <Link className={style.link} to="/newVacation">
                  New Vacation
                </Link>

                <Link className={style.link} to="/chart">
                  Followers Chart
                </Link>
              </>
            ) : (
              ""
            )}
          </div>
          <div>
            {userSignedIn ? (
              <>
                <h3>Welcome {user.userName}</h3>
                {userRole !== "admin" ? (
                  <button
                    onClick={() => {
                      dispatch(removeVacations());
                      navigate("/signin");
                      setFilter(!filter);
                    }}
                  >
                    Filter Following
                  </button>
                ) : (
                  ""
                )}

                <button onClick={() => dispatch(removeUser())}>Log Out</button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home filterFollowing={filter} />} />
        <Route path="/:page" element={<Home filterFollowing={filter} />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/newVacation" element={<NewVacation />} />
        <Route path="/editVacation/:id" element={<NewVacation />} />
        <Route path="/chart" element={<ChartPage />} />

        {/* <Route path="/rerender/:path" element={<></>} /> */}
        <Route path="*" element={<h1>Error Page not found 404 </h1>} />
      </Routes>
    </div>
  );
}

export default App;
