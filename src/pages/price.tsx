import { getTradingPosts } from "../utils/get_trading_posts";
import { query } from "../utils/gql";
import moment from "moment";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Line } from "react-chartjs-2";

const grabPrices = async (token) => {
  const posts = await getTradingPosts();

  const maxInt = 2147483647;

  const orderTxs = (
    await query({
      query: `
    query($recipients: [String!]) {
      transactions(
        recipients: $recipients
        tags: [
          { name: "Exchange", values: "Verto" }
          { name: "Type", values: "Buy" }
          { name: "Token", values: "${token}" }
        ]
        first: ${maxInt}
      ) {
        edges {
          node {
            id
            block {
              timestamp
            }
            quantity {
              ar
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

  let orders: { id: string; amnt: number; timestamp: number }[] = [];
  orderTxs.map((order) => {
    orders.push({
      id: order.node.id,
      amnt: parseFloat(order.node.quantity.ar),
      timestamp: order.node.block.timestamp,
    });
  });

  let prices: number[] = [];
  let days: string[] = [];

  let high = moment().add(1, "days").hours(0).minutes(0).seconds(0);
  const limit =
    orders[orders.length - 1].timestamp >= 1599955200
      ? orders[orders.length - 1].timestamp
      : 1599955200;
  while (high.unix() >= limit) {
    let dayPrices: number[] = [];

    const low = high.clone().subtract(1, "days");
    for (const order of orders) {
      if (order.timestamp <= high.unix() && order.timestamp >= low.unix()) {
        const confirmationTx = (
          await query({
            query: `
          query($txID: [String!]!) {
            transactions(
              tags: [
                { name: "Exchange", values: "Verto" }
                { name: "Type", values: "Confirmation" }
                { name: "Match", values: $txID }
              ]
            ) {
              edges {
                node {
                  tags {
                    name
                    value
                  }
                }
              }
            }
          }`,
            variables: {
              txID: order.id,
            },
          })
        ).data.transactions.edges;

        if (confirmationTx.length === 1) {
          dayPrices.push(
            order.amnt /
              parseFloat(
                confirmationTx[0].node.tags
                  .find((tag) => tag.name === "Received")
                  .value.split(" ")[0]
              )
          );
        }
      }
    }

    prices.push(dayPrices.reduce((a, b) => a + b, 0) / dayPrices.length);
    days.push(low.format("MMM DD"));

    high = low;
  }

  return { prices: prices.reverse(), dates: days.reverse() };
};

const Price = () => {
  const router = useRouter();
  const token = router.query.token;

  if (!token || token === "") return <p>no token.</p>;

  const { data, error } = useSWR([token], grabPrices);

  if (error) return <p>failed to load.</p>;
  // @ts-ignore
  if (!data) return <p>loading ...</p>;

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
        legend: { display: false },
        scales: {
          xAxes: [{ gridLines: { display: false } }],
          yAxes: [{ gridLines: { display: false } }],
        },
      }}
    />
  );
};

export default Price;
