require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const app = express();

const DB_URL = process.env.DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

const region = "ap-northeast-2";

const s3 = new S3Client({
  region: region,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

app.use(
  cors({
    origin: "http://localhost:3000", // React 애플리케이션의 출처
    credentials: true, // 쿠키를 허용하도록 설정
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());

const client = new MongoClient(DB_URL);

let db;
let bookmarksCollection;
let userInfoCollection;
let currentUserCollection;
let reviewCollection;

client
  .connect()
  .then(() => {
    console.log("DB연결성공");
    db = client.db("forum");
    bookmarksCollection = db.collection("bookmark");
    userInfoCollection = db.collection("userinfo");
    currentUserCollection = db.collection("currnetuser");
    reviewCollection = db.collection("review");
    app.listen(8080, () => {
      console.log("http://localhost:8080 에서 서버 실행중");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = Date.now().toString() + path.extname(req.file.originalname);
  const params = {
    Bucket: "kimyoungjoforum1557",
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const fileUrl = `https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`;
    res.json({
      message: "File uploaded successfully!",
      fileUrl: fileUrl,
    });
  } catch (error) {
    console.error("File upload failed:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

app.get("/api/directions", async (req, res) => {
  const { origin, destination } = req.query; // 출발지와 도착지를 쿼리 파라미터로 받습니다.

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "origin and destination are required" });
  }

  try {
    const response = await axios.get(
      "https://apis-navi.kakaomobility.com/v1/waypoints/directions",
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
        params: {
          origin, // 출발지 좌표 (예: '127.1086228,37.4012191')
          destination, // 도착지 좌표 (예: '127.0358738,37.5117263')
          priority: "fast", // 경로 우선순위 (예: 'fast', 'short', 'free', 'safe')
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/reviews", async (req, res) => {
  try {
    const id = req.query.id; // 쿼리 파라미터에서 id를 가져옵니다.
    const query = { id: id }; // id를 사용하여 쿼리합니다.
    const result = await reviewCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("데이터를 불러오는 중 오류가 발생했습니다.");
  }
});

app.post("/review", async (req, res) => {
  const { id, name, comment } = req.body;
  console.log("Received review:", req.body); // 로그 추가
  if (!id || !name || !comment) {
    return res.status(400).send("ID, Name and comment are required.");
  }
  try {
    const response = await reviewCollection.insertOne({
      id,
      name,
      comment,
    });
    console.log("Review added:", response); // 로그 추가
    res.status(201).send("Review added successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding the review");
  }
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

app.post("/register/submit", upload.none(), async (req, res) => {
  const { name, email, password, confirmPassword, profileImageUrl } = req.body;

  // 요청 데이터 로그 출력
  console.log("Received data:", req.body);

  if (!name || !password || !email || !confirmPassword || !profileImageUrl) {
    console.error("필수 필드가 누락되었습니다.");
    return res.status(400).send("모든 필드를 입력해주세요.");
  }
  if (password !== confirmPassword) {
    console.error("비밀번호가 일치하지 않습니다.");
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
    console.log(
      "Number of existing users with the same email:",
      existingUsersEmail.length
    );

    // 이미 같은 이름의 사용자가 있는 경우 처리
    if (existingUsers.length > 0) {
      console.error("이미 존재하는 사용자 이름입니다.");
      return res.status(400).send("이미 존재하는 사용자 이름입니다.");
    } else if (existingUsersEmail.length > 0) {
      console.error("이미 존재하는 사용자 이메일입니다.");
      return res.status(400).send("이미 존재하는 사용자 이메일입니다.");
    }

    const response = await userInfoCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      profileImageUrl, // 프로필 이미지 URL 저장
    });
    console.log("User inserted:", response);
    res.redirect(303, "/login");
  } catch (error) {
    console.error("Error adding the user:", error);
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

    const email = user.email; // user 객체에서 이메일을 가져옵니다.

    // currentUserCollection에 사용자 정보를 업데이트 또는 삽입합니다.
    const response = await currentUserCollection.updateOne(
      { name: user.name }, // 조건: 이름이 일치하는 사용자
      { $set: { name: user.name, email: user.email } }, // 업데이트할 내용
      { upsert: true } // 조건에 맞는 문서가 없으면 새로 삽입
    );

    console.log("currentUserCollection response:", response); // 디버깅 로그

    const token = jwt.sign({ name: user.name, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    // 로그인 성공 시 리다이렉션
    res.redirect("http://localhost:3000/");
  } catch (error) {
    console.error(error);
    res.status(500).send("로그인 처리 중 오류가 발생했습니다.");
  }
});

app.get("/protected", authenticateJWT, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// JWT 인증 미들웨어
function authenticateJWT(req, res, next) {
  const token = req.cookies.token; // 쿠키에서 JWT 읽기
  console.log("JWT token from cookies: ", token); // 콘솔 로그로 확인

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

app.get("/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.json({ authenticated: false });
      }
      return res.json({ authenticated: true });
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.post("/logout", async (req, res) => {
  try {
    const result = await currentUserCollection.deleteMany({});
  } catch (error) {
    console.error(error);
  }
  res.clearCookie("token"); // 쿠키 삭제
  res.json({ message: "로그아웃 성공" });
});

app.get("/myinfo", async (req, res) => {
  try {
    const { name } = req.query; // 쿼리 파라미터에서 name을 가져옴
    let filter = {};
    if (name) {
      filter.name = name; // name이 제공된 경우 필터에 추가
    }

    // 필터를 사용하여 MongoDB 컬렉션에서 데이터 가져옴
    let existingUsers = await currentUserCollection.find(filter).toArray();

    res.send(existingUsers);
  } catch (error) {
    console.error(error);

    // 오류 발생 시 500 상태 코드와 함께 에러 메시지 전송
    res.status(500).send("데이터를 불러오는 중 오류가 발생했습니다.");
  }
});

app.post("/mybookmark", async (req, res) => {
  const { bookmark_name, bookmark_address } = req.body; // 클라이언트로부터 bookmark 데이터를 받습니다.
  const userName = "admin123"; // 업데이트할 사용자의 이름

  try {
    // 사용자 정보를 가져옵니다.
    const user = await bookmarksCollection.insertOne({
      name: userName,
      bookmark_name: bookmark_name,
      bookmark_address: bookmark_address,
    });
    if (!user) {
      return res.status(404).send("사용자를 찾을 수 없습니다.");
    }

    console.log("Update result:", user);

    res.send("success");
  } catch (error) {
    console.error(error);

    // 오류 발생 시 500 상태 코드와 함께 에러 메시지 전송
    res.status(500).send("데이터를 업데이트하는 중 오류가 발생했습니다.");
  }
});

app.delete("/mybookmark/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const result = await bookmarksCollection.deleteOne({
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

app.get("/mybookmarklist/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const query = { name: userId };
    const result = await bookmarksCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("데이터를 불러오는 중 오류가 발생했습니다.");
  }
});
