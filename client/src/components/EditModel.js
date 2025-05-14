import React, { Fragment, useState, useEffect } from "react";

const EditModel = ({ cars }) => {
    // State for each field
    const [model_name, setModelName] = useState(cars.model_name);
    const [price, setPrice] = useState(cars.price);
    const [year, setYear] = useState(cars.year);
    const [power, setPower] = useState(cars.power);
    const [battery, setBattery] = useState(cars.battery);
    const [image_url, setImageUrl] = useState(cars.image_url);

    // Function to reset state to original car data
    const resetForm = () => {
        setModelName(cars.model_name);
        setPrice(cars.price);
        setYear(cars.year);
        setPower(cars.power);
        setBattery(cars.battery);
        setImageUrl(cars.image_url);
    };

    // Update model function
    const updateModel = async e => {
        e.preventDefault();
        try {
            const body = { 
                model_name,
                price: parseInt(price),
                year: parseInt(year),
                power: parseInt(power),
                battery: parseInt(battery),
                image_url 
            };
            await fetch(`http://localhost:5000/models/${cars.model_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            window.location = "/"; // Refresh to see changes
        } catch (err) {
            console.error(err.message);
        }
    };

    // Effect to update state if the `cars` prop changes (e.g., when a different model is selected for editing)
    // Also useful if the parent component re-fetches data
    useEffect(() => {
        resetForm();
    }, [cars]);

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-toggle="modal" data-target={`#id${cars.model_id}`}>
                Edit
            </button>

            {/* Modal */}
            <div className="modal" id={`id${cars.model_id}`} onClick={(e) => {
                 // Reset form if clicking outside the modal content to close
                 if (e.target.classList.contains('modal')) {
                    resetForm();
                 }
            }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit Model: {cars.model_name}</h4>
                            <button type="button" className="close" data-dismiss="modal" onClick={resetForm}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group mb-2">
                                <label htmlFor={`model_name-${cars.model_id}`}>Model Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id={`model_name-${cars.model_id}`}
                                    value={model_name || ''} 
                                    onChange={e => setModelName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor={`image_url-${cars.model_id}`}>Image URL</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id={`image_url-${cars.model_id}`}
                                    value={image_url || ''} 
                                    onChange={e => setImageUrl(e.target.value)} 
                                    placeholder="https://example.com/image.png"
                                />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group mb-2">
                                        <label htmlFor={`price-${cars.model_id}`}>Price (€)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id={`price-${cars.model_id}`}
                                            value={price || ''} 
                                            onChange={e => setPrice(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group mb-2">
                                        <label htmlFor={`year-${cars.model_id}`}>Year</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id={`year-${cars.model_id}`}
                                            value={year || ''} 
                                            onChange={e => setYear(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group mb-2">
                                        <label htmlFor={`power-${cars.model_id}`}>Power (hp)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id={`power-${cars.model_id}`}
                                            value={power || ''} 
                                            onChange={e => setPower(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group mb-2">
                                        <label htmlFor={`battery-${cars.model_id}`}>Battery (kWh)</label>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            id={`battery-${cars.model_id}`}
                                            value={battery || ''} 
                                            onChange={e => setBattery(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-warning" 
                                data-dismiss="modal" 
                                onClick={e => updateModel(e)}
                            >
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                data-dismiss="modal" 
                                onClick={resetForm}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditModel;