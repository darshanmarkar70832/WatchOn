require("dotenv").config(); // Load environment variables as early as possible

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");

const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/index");

const db = require("./config/mongoose-connection");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(expressSession({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use("/owners", ownersRouter); 
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/", indexRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
        process.exit(1);
    }
    console.log(`Server is running on port ${port}`);
});
