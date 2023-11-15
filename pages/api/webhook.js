import { mongooseConnect } from "@/lib/mongoose";
import got from "got";

export default async function handler(req, res) {
  await mongooseConnect();
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    res.status(401).end();
  }
  const payload = req.body;
  // It's a good idea to log all received events.
  console.log(payload);
  // Do something (that doesn't take too long) with the payload
  const tx_Id = payload.data.id;
  const response = await got
    .get(`https://api.flutterwave.com/v3/transactions/${tx_Id}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
      },
    })
    .json();
  console.log(response);
  res.status(200).end();
}
