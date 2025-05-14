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
        const { model_name, price, year, power, battery, image_url } = req.body;
        const newModel = await pool.query(
            "INSERT INTO cars (model_name, price, year, power, battery, image_url) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [model_name, price, year, power, battery, image_url]
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
        const { model_name, price, year, power, battery, image_url } = req.body;
        const updateModel = await pool.query(
            "UPDATE cars SET model_name = $1, price = $2, year = $3, power = $4, battery = $5, image_url = $6 WHERE model_id = $7",
            [model_name, price, year, power, battery, image_url, id]
        );
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