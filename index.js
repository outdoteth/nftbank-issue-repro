const fetch = require("node-fetch");
require("dotenv").config();

const fetchNftbankWeightings = async (address, totalSupply) => {
  console.log("\n\nFetching nftbank weightings...");
  const start = Date.now();

  let currentId = 0;
  let prices = [];
  while (true) {
    const params = Array.from({ length: 100 }, (_, i) =>
      Math.min(currentId + i, totalSupply)
    ).map((tokenId) => ({
      networkId: "ethereum",
      assetContract: address,
      tokenId,
    }));

    const url = `https://api.nftbank.run/v1/nft/estimate/bulk`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        accept: "*/*",
        "content-type": "application/json",
        "X-API-Key": process.env.NFTBANK_API_KEY,
      },
      body: JSON.stringify({ params }),
    }).then((r) => r.json());

    currentId += 100;
    prices = prices.concat(resp.data);

    if (prices.length >= totalSupply) break;

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Progress: ${prices.length} / ${totalSupply}...`);
  }

  console.log(`\n\nDone in ${(Date.now() - start) / 1000}ms`);

  return prices;
};

const address = "0xed5af388653567af2f388e6224dc7c4b3241c544";
const totalSupply = 10_000;
fetchNftbankWeightings(address, totalSupply);
