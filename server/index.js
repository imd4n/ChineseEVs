const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json());


// ROUTES

// create a model

app.post("/models", async(req, res) => {
    try {
        const { description } = req.body;
        const newModel = await pool.query("INSERT INTO cars (description) VALUES($1) RETURNING *",
        [description]
    );

    res.json(newModel.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// get all models

app.get("/models", async(req, res) => {
    try {
        const allModels = await pool.query("SELECT * FROM cars");
        res.json(allModels.rows);
    } catch (err) {
        console.error(err.message);
    }
});

// get a model

app.get("/models/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const model = await pool.query("SELECT * FROM cars WHERE model_id = $1",
        [id]);
        res.json(model.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

// update a model

app.put("/models/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateModel = await pool.query("UPDATE cars SET description = $1 WHERE model_id = $2",
        [description, id]);
        res.json("Models were updated");
    } catch (err) {
        console.error(err.message);
    }
});

// delete a model

app.delete("/models/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteModel = await pool.query("DELETE FROM cars WHERE model_id = $1",
        [id]);
        res.json("Model was deleted");
    } catch (err) {
        console.error(err.message);
    }
});



app.listen(5000, () => {
    console.log("server started at 3000");
});