import Verto from "@verto/lib";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    new Verto().getTokens().then((res) => setData(res.reverse()));
  }, []);

  return (
    <div
      style={{
        padding: "1em 15vw 3em",
      }}
    >
      <h1
        style={{
          textDecoration: "underline",
        }}
      >
        stats.verto.exchange
      </h1>
      <p>
        AR: <a href="/ar">volume</a>
      </p>
      {!data && <p>loading ...</p>}
      {data &&
        data.map((pst) => (
          <p>
            {pst.ticker}: <a href={`/price?token=${pst.id}`}>price</a>,{" "}
            <a href={`/volume?token=${pst.id}`}>volume</a>
          </p>
        ))}
    </div>
  );
};

export default Home;
