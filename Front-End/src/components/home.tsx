import { getUserSignInState, getUser } from "../data/slices/userSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { fillVacations, getAllVacations } from "../data/slices/vacationSlice";
import VacationCard from "./vacationCard";
import style from "../scss/home.module.scss";

function Home(params: { filterFollowing: boolean }) {
  //   setting usable functions
  const dispatch = useDispatch(); // to use redux functions (follow, unfollow)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const vacations = useSelector(getAllVacations);
  //    getting important data (user)
  const userSignedIn = useSelector(getUserSignInState);
  const user = useSelector(getUser);
  const routeParams = useParams();
  let pageNumber = 0;
  //   changing pages according to user state
  if (!userSignedIn) return <Navigate to="/signin" />;

  if (
    routeParams.page == null ||
    routeParams.page === undefined ||
    Number.parseInt(routeParams.page) < 1 ||
    (vacations.length > 0 &&
      vacations.length < 10 * (Number.parseInt(routeParams.page) - 1))
  )
    return <Navigate to="/1" />;
  else pageNumber = Number.parseInt(routeParams.page);

  const getVacations = async () => {
    if (vacations == null || vacations.length === 0) {
      if (fetching) {
        await fetch(
          params.filterFollowing
            ? `http://localhost:5000/users/filterFollowing/${user._id}`
            : `http://localhost:5000/vacations/`
          // : `http://localhost:5000/vacations/?skip=${10 * (pageNumber - 1)}`
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (data.success) {
              dispatch(fillVacations(data.vacations));
            }
            setFetching(false);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else if (loading) {
      setLoading(false);
    }
  };

  getVacations();

  return (
    <>
      <div className={style.expanded}>
        <h1>Home Page</h1>
        <div className={style.cardsCollection}>
          {loading ? (
            <h2>Loading...</h2>
          ) : vacations == null || vacations.length === 0 ? (
            ""
          ) : (
            vacations
              .slice(10 * (pageNumber - 1), 10 * pageNumber)
              .map((val) => {
                return <VacationCard key={val._id} vacation={val} />;
              })
          )}
        </div>
        <div className={style.expander}></div>
        <div className={style.buttons}>
          <button
            disabled={pageNumber <= 1}
            onClick={() => navigate(`/${pageNumber - 1}`)}
          >
            {"<"}
          </button>
          <label>{pageNumber}</label>
          <button
            disabled={vacations.length <= 10 * pageNumber}
            onClick={() => navigate(`/${pageNumber + 1}`)}
          >
            {">"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
