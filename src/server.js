import app from "./app.js";

app.listen(process.env.API_PORT, () => {
  console.log(`Server started at http://localhost:${process.env.API_PORT}`);
});
