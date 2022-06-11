const express = require("express");
const cors = require("cors");
const path = require("path");
const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");
const morgan = require("morgan");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000"
  })
);

//NOTE This order is important on when you "use" what middleware
// Format of combined is this
//combined
//   |-----> Standard Apache combined log output.
//   |--> :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
//EX |--> ::1 - - [06/Jun/2022:22:43:58 +0000] "GET /planets HTTP/1.1" 304 - "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
//

app.use(morgan("combined"));

app.use(express.json());

/*
 * Remember that in package.json for client we added this script command
 * "build": "BUILD_PATH=../server/public react-scripts build", which creates build files for client
 * Now after that is done, we no longer need to run the npm start on client
 * instead we use this static serve on express.
 */
//NOTE This command uses the public folder (the build script)
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(planetsRouter);
app.use(launchesRouter);

//NOTE Done so that once the app loads we are going directly to launch page.
//     Check out the video titled "Serving React.js Front End In Production" for details.
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
module.exports = app;
