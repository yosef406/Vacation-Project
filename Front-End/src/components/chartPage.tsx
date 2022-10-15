import { getUser } from "../data/slices/userSlice";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { AxisOptions, Chart } from "react-charts";
import style from "../scss/chartPage.scss";
type VacationData = {
  id: number;
  destination: string;
  followers: number;
};
type Series = {
  label: string;
  data: VacationData[];
};
export default function ChartPage() {
  const user = useSelector(getUser);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<
    { destination: string; numOfFollowers: number }[]
  >([]);

  useEffect(() => {
    if (loading === true) {
      fetch("http://localhost:5000/vacations/followers")
        .then((res) => res.json())
        .then(
          (jData: {
            success: boolean;
            data: { destination: string; numOfFollowers: number }[];
          }) => {
            if (jData.success) {
              setChartData(jData.data);
            }
            setLoading(false);
            setTimeout(() => {
              setLoading(true);
            }, 5000);
          }
        )
        .catch((err) => console.log(err));
    }
  }, [loading]);

  const data: Series[] = [
    {
      label: "Followers",
      data: chartData.map<VacationData>((val, i) => {
        return {
          destination: val.destination,
          followers: val.numOfFollowers,
          id: i + 1,
        };
      }),
    },
  ];

  const primaryAxis = useMemo(
    (): AxisOptions<VacationData> => ({
      getValue: (datum) => `${datum.id}. ${datum.destination}`,
    }),
    []
  );
  const secondaryAxes = useMemo(
    (): AxisOptions<VacationData>[] => [
      {
        getValue: (datum) => datum.followers,
        elementType: "bar",
        min: 0,
      },
    ],
    []
  );
  if (!user.signedIn) return <Navigate to={"/signin"} />;

  if (user.role !== "admin") return <Navigate to={"/"} />;

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div
          // className={style.chartContainer}
          style={{
            width: "80%",
            height: "700px",
            backgroundColor: "whitesmoke",
            marginTop: "50px",
            borderRadius: 10,
          }}
        >
          <Chart
            options={{
              data,
              primaryAxis,
              secondaryAxes,
            }}
          />
        </div>
      )}
    </>
  );
}
