import { useRouter } from "next/router";

const Prices = () => {
  const router = useRouter();
  const token = router.query.token;

  if (!token || token === "") return <p>no token.</p>;

  return <p>nothing yet ...</p>;
};

export default Prices;
