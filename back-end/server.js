const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // cors 설정

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
