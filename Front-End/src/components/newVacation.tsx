import { useParams } from "react-router-dom";
import { getUserSignInState, getUserRole } from "../data/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { getAllVacations, removeVacations } from "../data/slices/vacationSlice";
import { useRef, useState, ChangeEvent, useEffect } from "react";

export default function NewVacation() {
  const userSignedIn = useSelector(getUserSignInState);
  const userRole = useSelector(getUserRole);
  const vacations = useSelector(getAllVacations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [vacationData, setVacationData] = useState({
    description: "",
    destination: "",
    image: "",
    startDate: "",
    endDate: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  //   get the id from URL
  const params = useParams();
  const newVac = params.id === null || params.id === undefined;

  //   setting references to all the text inputs
  const descRef = useRef<HTMLInputElement | null>(null);
  const destRef = useRef<HTMLInputElement | null>(null);
  const startDateRef = useRef<HTMLInputElement | null>(null);
  const endDateRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const [imageData, setImageData] = useState("");

  const editVac = vacations.filter((val) => val._id === params.id)[0];

  useEffect(() => {
    if (fetching) {
      setFetching(false);
      let url = "";

      if (newVac) {
        url = "http://localhost:5000/vacations/new";
      } else {
        url = `http://localhost:5000/vacations/edit/` + params.id;
      }
      fetch(url, {
        method: "post",
        body: JSON.stringify(vacationData),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          setLoading(false);
          dispatch(removeVacations());
          navigate("/");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [fetching]);

  if (!newVac && (editVac === undefined || editVac == null))
    return <Navigate to="/" />;

  if (!userSignedIn) return <Navigate to="/signin" />;
  if (userRole !== "admin") return <Navigate to="/" />;

  //   if id exists in URL get the vacation data
  if (!newVac && imageData === "") {
    setImageData(editVac?.image as string);
  }

  const imageChangeBtn = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0) as File;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const updateBtn = () => {
    const description = descRef.current?.value as string;
    const destination = destRef.current?.value as string;
    const image = imageData as string;
    const startDate = startDateRef.current?.value as string;
    const endDate = endDateRef.current?.value as string;
    const price = priceRef.current?.value as string;

    setVacationData({
      description,
      destination,
      image,
      startDate,
      endDate,
      price,
    });
    setFetching(true);
    setLoading(true);
  };

  return (
    <>
      {newVac ? <h1>New Vacation</h1> : <h1>Edit Vacation</h1>}

      <div>
        <div>
          <label>destination: </label>
          <input
            ref={destRef}
            type="text"
            disabled={loading}
            defaultValue={newVac ? "" : editVac?.destination}
          />
        </div>
        <div>
          <label>description: </label>
          <input
            ref={descRef}
            type="text"
            disabled={loading}
            defaultValue={newVac ? "" : editVac?.description}
          />
        </div>
        <div>
          <label>image: </label>

          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={imageChangeBtn}
          />
        </div>
        <img width={200} height={200} src={imageData} alt="not selected" />
        <div>
          <label>startDate: </label>
          <input
            ref={startDateRef}
            disabled={loading}
            type="date"
            defaultValue={newVac ? "" : editVac?.startDate.split("T")[0]}
          />
        </div>
        <div>
          <label>endDate: </label>
          <input
            ref={endDateRef}
            disabled={loading}
            type="date"
            defaultValue={newVac ? "" : editVac?.endDate.split("T")[0]}
          />
        </div>
        <div>
          <label>price: </label>
          <input
            ref={priceRef}
            disabled={loading}
            type="number"
            defaultValue={newVac ? "" : editVac?.price}
          />
        </div>
      </div>

      {loading ? (
        <label>Loading...</label>
      ) : (
        <button onClick={updateBtn}>{newVac ? "Add" : "Update"}</button>
      )}
    </>
  );
}
