const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const url =
  "mongodb+srv://admin:as123123@kpkpkp.cau2nx4.mongodb.net/?retryWrites=true&w=majority&appName=kpkpkp";
const client = new MongoClient(url);

let db;
let bookmarksCollection; // 명확한 참조를 위한 변수

client
  .connect()
  .then(() => {
    console.log("DB연결성공");
    db = client.db("forum");
    bookmarksCollection = db.collection("bookmark"); // 컬렉션 참조 초기화
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/list", async (req, res) => {
  try {
    let result = await bookmarksCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("데이터를 불러오는 중 오류가 발생했습니다.");
  }
});

app.post("/bookmark", async (req, res) => {
  const { bookmark_name, bookmark_address } = req.body;
  if (!bookmark_name || !bookmark_address) {
    return res.status(400).send("Bookmark name and address are required.");
  }
  try {
    const response = await bookmarksCollection.insertOne({
      bookmark_name,
      bookmark_address,
    });
    // 성공적으로 추가된 후, 메인 페이지로 리다이렉트
    res.redirect(303, "http://localhost:3000//"); // HTTP 303 See Other를 사용하여 리다이렉트
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding the bookmark");
  }
});

app.delete("/bookmarks/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await db.collection("bookmark").deleteOne({
      _id: new ObjectId(req.params.id), // URL의 파라미터에서 _id를 추출하여 ObjectId로 변환
    });
    if (result.deletedCount === 0) {
      res.status(404).send({ message: "No bookmark found with that ID" });
    } else {
      res.send({ message: "Bookmark deleted successfully" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
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
