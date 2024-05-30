const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // cors 설정

app.get("/", (req, res) => {
  const data = [
    { name: "집", description: "신월5동 13-9" },
    { name: "직장", description: "서울 강남구 테헤란로14길 6" },
    { name: "부모님 집", description: "신월5동 13-9" },
    { name: "헬스장", description: "서울 강남구 테헤란로8길 7" },
  ];

  res.send(data);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
