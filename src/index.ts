import app  from "./app";

const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`** Multi-Asset Wallet 💸 Server listening on PORT ${PORT} **`);
});