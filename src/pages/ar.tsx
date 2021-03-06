import { useState, useEffect } from "react";
import Verto from "@verto/lib";
import { Line } from "react-chartjs-2";

const AR = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    new Verto().arVolume().then((res) => setData(res));
  }, []);

  if (!data) return <p>loading ...</p>;

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
        elements: { point: { radius: 0 } },
        tooltips: { mode: "index", intersect: false },
        hover: { mode: "nearest", intersect: true },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ gridLines: { display: false } }],
        },
      }}
    />
  );
};

export default AR;
