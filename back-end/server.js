const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const url =
  "mongodb+srv://admin:as123123@kpkpkp.cau2nx4.mongodb.net/?retryWrites=true&w=majority&appName=kpkpkp";
const client = new MongoClient(url);

let db;
let bookmarksCollection;
let userInfoCollection;

client
  .connect()
  .then(() => {
    console.log("DB연결성공");
    db = client.db("forum");
    bookmarksCollection = db.collection("bookmark");
    userInfoCollection = db.collection("userinfo");
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
    res.redirect(303, "/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding the bookmark");
  }
});

app.delete("/bookmarks/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await db.collection("bookmark").deleteOne({
      _id: new ObjectId(req.params.id),
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

app.get("/api/data/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://place.map.kakao.com/main/v/${id}`
    );
    res.send(response.data);
  } catch (error) {
    console.error("API 요청 실패:", error);
    res.status(500).send("API 요청에 실패했습니다");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register/submit", async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !password || !email || !confirmPassword) {
    return res.status(400).send("모든 필드를 입력해주세요.");
  }
  if (password !== confirmPassword) {
    return res.status(400).send("비밀번호가 일치하지 않습니다.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 이름이 같은 문서 찾기
    const existingUsers = await userInfoCollection.find({ name }).toArray();
    const existingUsersEmail = await userInfoCollection
      .find({ email })
      .toArray();
    console.log(
      "Number of existing users with the same name:",
      existingUsers.length
    );

    // 이미 같은 이름의 사용자가 있는 경우 처리
    if (existingUsers.length > 0) {
      return res.status(400).send("이미 존재하는 사용자 이름입니다.");
    } else if (existingUsersEmail.length > 0) {
      return res.status(400).send("이미 존재하는 사용자 이메일입니다.");
    }

    const response = await userInfoCollection.insertOne({
      name,
      email,
      password: hashedPassword,
    });
    res.redirect(303, "/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding the user");
  }
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).send("모든 필드를 입력해주세요.");
  }

  try {
    const user = await userInfoCollection.findOne({ name });
    if (!user) {
      return res.status(400).send("사용자를 찾을 수 없습니다.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("비밀번호가 일치하지 않습니다.");
    }

    res.send("로그인 성공");
  } catch (error) {
    console.error(error);
    res.status(500).send("로그인 처리 중 오류가 발생했습니다.");
  }
});
