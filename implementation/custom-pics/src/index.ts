import express from "express";
import cors from "cors";
import card from "./routes/card";
import openbadge from "./routes/openbadge";

const app = express();

app.use(express.json());
app.use(express.text());

app.use(cors());

app.use("/card", card);
app.use("/openbadge", openbadge);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
