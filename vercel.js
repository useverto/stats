const fs = require("fs");

const TxID = process.argv[2];

const config = {
  rewrites: [
    {
      source: "/price/(.*)",
      destination: `https://arweave.net/${TxID}/price.html?token=$1`,
    },
    {
      source: "/volume/(.*)",
      destination: `https://arweave.net/${TxID}/volume.html?token=$1`,
    },
  ],
};

try {
  fs.writeFileSync("./vercel.json", JSON.stringify(config, null, 2));
} catch (err) {
  console.error(err);
}
