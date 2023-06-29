const express = require("express");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(PORT, () => console.log(`Server started on post ${PORT}`));
