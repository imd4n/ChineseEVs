const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// --- CONFIGURATION ---
const JWT_SECRET = "YOUR_VERY_SECRET_KEY_REPLACE_ME"; // !! REPLACE THIS with a strong secret, ideally from env vars !!
const COOKIE_NAME = "token";

// --- MIDDLEWARE ---
app.use(cors({ 
    origin: "http://localhost:3000", // Adjust if your frontend runs on a different port
    credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

// Authentication Middleware
const authorize = (req, res, next) => {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user payload to request object
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message);
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

// --- AUTH ROUTES ---
app.post("/auth/login", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ error: "Login and password are required" });
        }

        const userResult = await pool.query("SELECT * FROM auth_users WHERE login = $1", [login]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = userResult.rows[0];

        // Plain text password comparison (NOT RECOMMENDED FOR PRODUCTION)
        if (password !== user.password) { 
            return res.status(401).json({ error: "Invalid credentials (password mismatch)" });
        }

        // Create JWT payload (don't include sensitive info like password hash here)
        const tokenPayload = {
            userId: user.user_id,
            login: user.login
            // Add other non-sensitive user details if needed (e.g., role)
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true, // Prevents client-side JS access
            secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
            sameSite: "lax", // Or "strict" depending on your needs
            maxAge: 60 * 60 * 1000 // 1 hour in milliseconds
        });

        res.json({ message: "Login successful", user: tokenPayload });

    } catch (err) {
        console.error("Login error:", err.message);
        res.status(500).json({ error: "Server error during login" });
    }
});

app.post("/auth/logout", (req, res) => {
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    res.json({ message: "Logout successful" });
});

app.get("/auth/status", authorize, (req, res) => {
    // If authorize middleware passes, user is authenticated
    // req.user contains the decoded JWT payload (userId, login)
    res.json({ isAuthenticated: true, user: req.user });
});


// --- MODEL ROUTES (CRUD) ---

// Create a model - PROTECTED
app.post("/models", authorize, async(req, res) => {
    try {
        const { model_name, price, year, power, battery, image_url } = req.body;
        const newModel = await pool.query(
            "INSERT INTO cars (model_name, price, year, power, battery, image_url) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [model_name, price, year, power, battery, image_url]
        );
        res.json(newModel.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Get all models - REMAINS PUBLIC
app.get("/models", async(req, res) => {
    try {
        const allModels = await pool.query("SELECT * FROM cars");
        res.json(allModels.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message }); 
    }
});

// Get a model - REMAINS PUBLIC
app.get("/models/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const model = await pool.query("SELECT * FROM cars WHERE model_id = $1",
        [id]);
        if (model.rows.length === 0) {
            return res.status(404).json({ error: "Model not found" });
        }
        res.json(model.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Update a model - PROTECTED
app.put("/models/:id", authorize, async(req, res) => {
    try {
        const { id } = req.params;
        const { model_name, price, year, power, battery, image_url } = req.body;
        const updateModel = await pool.query(
            "UPDATE cars SET model_name = $1, price = $2, year = $3, power = $4, battery = $5, image_url = $6, last_edited_at = CURRENT_TIMESTAMP WHERE model_id = $7 RETURNING *",
            [model_name, price, year, power, battery, image_url, id]
        );
        if (updateModel.rows.length === 0) {
            return res.status(404).json({ error: "Model not found" });
        }
        res.json(updateModel.rows[0]); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete a model - PROTECTED
app.delete("/models/:id", authorize, async(req, res) => {
    try {
        const { id } = req.params;
        const deleteModel = await pool.query("DELETE FROM cars WHERE model_id = $1 RETURNING *",
        [id]);
        if (deleteModel.rows.length === 0) {
            return res.status(404).json({ error: "Model not found" });
        }
        res.json("Model was deleted"); 
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000 with updated auth.");
});