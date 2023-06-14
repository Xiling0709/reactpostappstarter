import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  findUserById,
  IDecodedUser,
  verifyUser,
  parseToken,
  addPost,
  posts,
  sleep,
  users,
 
} from "./fakedb";

const port = 8085;
const app = express();
app.use(cors());
app.use(express.json());

// TODO: Obviously use a more secure signing key than "secret"
app.post("/api/user/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const user = verifyUser(email, password);
    const token = jwt.sign({ id: user.id }, "secret", {
      expiresIn: "2 days",
    });
    res.json({ result: { user, token } });
  } catch (error) {
    res.status(401).json({ error });
  }
});


app.post("/api/user/validation", (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = parseToken(authHeader, res);
    const decodedUser = jwt.verify(token, "secret");
    const user = findUserById((decodedUser as IDecodedUser).id);
    res.json({ result: { user, token } });
  } catch (error) {
    res.status(401).json({ error });
  }
});

app.get("/api/posts", async (req, res) => {
  // Sleep delay goes here
  res.json(posts);
});

app.get("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find(post => post.id === id);
  
  if (post) {
    const user = users.find(user => user.id === post.userId);
    if (user) {
      post.userEmail = user.email;
      res.json(post);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});


app.put("/api/posts/:id", (req, res) => {
  const postId = Number(req.params.id);
  const updatedPost = req.body;

  // Check if the post exists
  const postIndex = posts.findIndex(post => post.id == postId);
  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found.' });
  }

  // Check if the user is the author of the post
  const authHeader = req.headers.authorization;
  const token = parseToken(authHeader, res);
  const decoded = jwt.verify(token, "secret");
  const user = findUserById((decoded as IDecodedUser).id);
  
  if (posts[postIndex].userId !== user.id) {
    return res.status(403).json({ error: 'User is not the author of this post.' });
  }

  
  posts[postIndex] = { ...posts[postIndex], ...updatedPost };
  res.status(200).json(posts[postIndex]);
});


/**
 * Problems with this:
 * (1) Authorization Issues:
 *     What if you make a request to this route WITHOUT a token?
 *     What if you make a request to this route WITH a token but
 *     it's invalid/expired?
 * (2) Server-Side Validation Issues:
 *     What if you make a request to this route with a valid token but
 *     with an empty/incorrect payload (post)
 */
app.post("/api/posts", (req, res) => {
  const incomingPost = req.body;
  const authHeader = req.headers.authorization;
  const token = parseToken(authHeader, res);
  
  if (!token) {
    return res.status(403).json({ error: 'No token provided.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, "secret");
  } catch (e) {
    return res.status(403).json({ error: 'Failed to authenticate token.' });
  }

  const user = findUserById((decoded as IDecodedUser).id);
  if (!user) {
    return res.status(403).json({ error: 'User not found.' });
  }

  addPost(incomingPost, user.id);
  res.status(200).json({ success: true });
});

app.listen(port, () => console.log("Server is running"));
