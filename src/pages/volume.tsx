import { useRouter } from "next/router";
import useSWR from "swr";
import Verto from "@verto/lib";
import { Line } from "react-chartjs-2";

const Volume = () => {
  const router = useRouter();
  const token = router.query.token;

  if (!token || token === "") return <p>no token.</p>;

  const { data, error } = useSWR([token], new Verto().volume);

  if (error) return <p>failed to load.</p>;
  // @ts-ignore
  if (!data) return <p>loading ...</p>;

  if (data.volume.length === 0 && data.dates.length === 0) {
    return <p>no trading volume.</p>;
  }

  return (
    <Line
      data={{
        labels: data.dates,
        datasets: [
          {
            data: data.volume,
            backgroundColor: function (context) {
              let gradient = context.chart.ctx.createLinearGradient(
                0,
                0,
                context.chart.width,
                context.chart.height
              );
              gradient.addColorStop(0, "rgba(230,152,323,0.5)");
              gradient.addColorStop(1, "rgba(141,95,188,0.5)");
              return gradient;
            },
            borderColor: function (context) {
              let gradient = context.chart.ctx.createLinearGradient(
                0,
                0,
                context.chart.width,
                context.chart.height
              );
              gradient.addColorStop(0, "#E698E8");
              gradient.addColorStop(1, "#8D5FBC");
              return gradient;
            },
            pointBackgroundColor: function (context) {
              let gradient = context.chart.ctx.createLinearGradient(
                0,
                0,
                context.chart.width,
                context.chart.height
              );
              gradient.addColorStop(0, "#E698E8");
              gradient.addColorStop(1, "#8D5FBC");
              return gradient;
            },
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ gridLines: { display: false } }],
        },
      }}
    />
  );
};

export default Volume;
