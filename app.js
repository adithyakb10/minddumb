import express from "express";
import ejs from "ejs";

const app = express();
const port = 3000;
app.use(express.static("routes"));

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
