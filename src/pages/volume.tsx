import { query } from "../utils/gql";
import { exchangeWallet } from "../utils/constants";
import moment from "moment";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Line } from "react-chartjs-2";

const grabVolume = async (token) => {
  const gensisTxs = (
    await query({
      query: `
    query($recipients: [String!]) {
      transactions(
        recipients: $recipients
        tags: [
          { name: "Exchange", values: "Verto" }
          { name: "Type", values: "Genesis" }
        ]
      ) {
        edges {
          node {
            owner {
              address
            }
          }
        }
      }
    }`,
      variables: {
        recipients: [exchangeWallet],
      },
    })
  ).data.transactions.edges;

  let posts: string[] = [];
  gensisTxs.map((tx) => {
    if (!posts.find((addr) => addr === tx.node.owner.address)) {
      posts.push(tx.node.owner.address);
    }
  });

  const maxInt = 2147483647;

  const orderTxs = (
    await query({
      query: `
    query($recipients: [String!]) {
      transactions(
        recipients: $recipients
        tags: [
          { name: "Exchange", values: "Verto" }
          { name: "Type", values: "Sell" }
          { name: "Contract", values: "${token}" }
        ]
        first: ${maxInt}
      ) {
        edges {
          node {
            block {
              timestamp
            }
            tags {
              name
              value
            }
          }
        }
      }
    }`,
      variables: {
        recipients: posts,
      },
    })
  ).data.transactions.edges;

  let orders: { amnt: number; timestamp: number }[] = [];
  orderTxs.map((order) => {
    orders.push({
      amnt: JSON.parse(
        order.node.tags.find((tag) => tag.name === "Input").value
      ).qty,
      timestamp: order.node.block.timestamp,
    });
  });

  let volume: number[] = [];
  let days: string[] = [];

  if (orders.length > 0) {
    let high = moment().add(1, "days").hours(0).minutes(0).seconds(0);
    while (high.unix() >= orders[orders.length - 1].timestamp) {
      let sum = 0;

      const low = high.clone().subtract(1, "days");
      orders.map((order) => {
        if (order.timestamp <= high.unix() && order.timestamp >= low.unix()) {
          sum += order.amnt;
        }
      });

      volume.push(sum);
      days.push(low.format("MMM DD"));

      high = low;
    }
  }

  return { volume: volume.reverse(), dates: days.reverse() };
};

const Volume = () => {
  const router = useRouter();
  const token = router.query.token;

  if (!token || token === "") return <p>no token.</p>;

  const { data, error } = useSWR([token], grabVolume);

  if (error) return <p>failed to load.</p>;
  // @ts-ignore
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
