/////////////////////////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////////////////////////

var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var db = require("./models");

/////////////////////////////////////////////////////////////////
// Sets up the Express App
/////////////////////////////////////////////////////////////////

var app = express();
var PORT = process.env.PORT || 3000;

// Serve static content (css, js, img, etc.) for the app from
// the "public" directory in the app's directory
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
require("./controllers/rosteritup_controller.js")(app);

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/////////////////////////////////////////////////////////////////
// Initliazes the db connection & sets the Express App listening
/////////////////////////////////////////////////////////////////

db.sequelize.sync().then( function () {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});