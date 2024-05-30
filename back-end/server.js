const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");

app.use(cors()); // cors 설정
app.use(express.static(__dirname + "/public"));
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 본문 파싱
app.set("view engine", "ejs");

let db;
const url =
  "mongodb+srv://admin:as123123@kpkpkp.cau2nx4.mongodb.net/?retryWrites=true&w=majority&appName=kpkpkp";
new MongoClient(url)
  .connect()
  .then((client) => {
    console.log("DB연결성공");
    db = client.db("forum");
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/list", async (req, res) => {
  try {
    let result = await db.collection("bookmark").find().toArray();
    // 응답.render("list.ejs", { 글목록: result });
    res.send(result);
  } catch (error) {
    console.error(error);
    응답.status(500).send("데이터를 불러오는 중 오류가 발생했습니다.");
  }
});

app.post("/bookmark", async (req, res) => {
  const { bookmark_name, bookmark_address } = req.body;
  if (!bookmark_name || !bookmark_address) {
    return res.status(400).send("Bookmark name and address are required.");
  }
  try {
    const response = await db.collection("bookmark").insertOne({
      bookmark_name,
      bookmark_address,
    });
    res
      .status(201)
      .send({
        message: "Bookmark added successfully",
        _id: response.insertedId,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding the bookmark");
  }
});

app.get("/", (req, res) => {
  const data = [
    { name: "집", description: "신월5동 13-9" },
    { name: "직장", description: "서울 강남구 테헤란로14길 6" },
    { name: "부모님 집", description: "신월5동 13-9" },
    { name: "헬스장", description: "서울 강남구 테헤란로8길 7" },
  ];
  console.log("Server restarted at", new Date());
  res.send(data);
});

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
