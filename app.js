import express from "express";
import ejs from "ejs";

const app = express();
const port = 3000;
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
