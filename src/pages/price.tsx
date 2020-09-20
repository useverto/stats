import { useRouter } from "next/router";
import useSWR from "swr";
import Verto from "@verto/lib";
import { Line } from "react-chartjs-2";

const Price = () => {
  const router = useRouter();
  const token = router.query.token;

  if (!token || token === "") return <p>no token.</p>;

  const { data, error } = useSWR([token], new Verto().price);

  if (error) return <p>failed to load.</p>;
  // @ts-ignore
  if (!data) return <p>loading ...</p>;

  if (data.prices.every((price) => isNaN(price))) {
    return <p>no price data.</p>;
  }

  return (
    <Line
      data={{
        labels: data.dates,
        datasets: [
          {
            data: data.prices,
            fill: false,
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
          yAxes: [
            {
              gridLines: { display: false },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export default Price;
