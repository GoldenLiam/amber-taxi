import httpServer from "./config/app";

const port = process.env.PORT || 9000;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://localhost:${port}`);
});