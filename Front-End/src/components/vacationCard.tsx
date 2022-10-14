import { useSelector, useDispatch } from "react-redux";
import { getUserRole, getUser, addUser } from "../data/slices/userSlice";
import vacationType from "../types/vacationType";
import { useNavigate } from "react-router-dom";
import { removeVacations } from "../data/slices/vacationSlice";
import style from "../scss/vacationCard.module.scss";
import { useState } from "react";

function VacationCard(params: { vacation: vacationType }) {
  const userRole = useSelector(getUserRole);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [following, setFollowing] = useState(
    user.following.includes(params.vacation._id)
  );

  const followBtn = () => {
    const fetching = async () => {
      await fetch(`https://localhost:5000/users/follow/${user._id}`, {
        method: "post",
        body: JSON.stringify({ vacationToFollow: params.vacation._id }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            dispatch(addUser(data.user));
            setFollowing(data.user.following.includes(params.vacation._id));
          }
        });
    };
    fetching();
  };
  const unFollowBtn = () => {
    const fetching = async () => {
      await fetch(`https://localhost:5000/users/unfollow/${user._id}`, {
        method: "post",
        body: JSON.stringify({ vacationToFollow: params.vacation._id }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            dispatch(addUser(data.user));
            setFollowing(data.user.following.includes(params.vacation._id));
          }
        });
    };
    fetching();
  };
  return (
    <>
      {/* card */}
      <div className={style.vacationCard}>
        <h3>{params.vacation.destination}</h3>
        <p>{params.vacation.description}</p>
        <label>Price: {params.vacation.price}</label>

        <img src={params.vacation.image} alt="missing img" />

        <label>Starts at: {params.vacation.startDate.split("T")[0]}</label>
        <label>Ends at: {params.vacation.endDate.split("T")[0]}</label>
        <div className={style.expander}></div>
        <div>
          {/* check user role if admin display edit button */}
          {userRole === "admin" ? (
            <>
              <button
                onClick={() => {
                  fetch(
                    `https://localhost:5000/vacations/${params.vacation._id}`,
                    { method: "delete" }
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      console.log(res);
                      dispatch(removeVacations);
                      navigate("/signin");
                    })
                    .catch((err) => console.log(err));
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  navigate(`/editVacation/${params.vacation._id}`);
                }}
              >
                Edit
              </button>
            </>
          ) : (
            <>
              {/* check if the user follows this vacation and display follow of unfollow */}
              <button onClick={following ? unFollowBtn : followBtn}>
                {following ? "Unfollow" : "Follow"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default VacationCard;
