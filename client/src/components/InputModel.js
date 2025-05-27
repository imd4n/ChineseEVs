import React, { Fragment, useState } from "react";

const InputModel = () => {
    const [model_name, setModelName] = useState("");
    const [price, setPrice] = useState("");
    const [year, setYear] = useState("");
    const [power, setPower] = useState("");
    const [battery, setBattery] = useState("");
    const [image_url, setImageUrl] = useState("");

    // State to control modal visibility (Bootstrap doesn't strictly need this for data-toggle, 
    // but good for React-centric control or if we want to programmatically close/open)
    // For simplicity with Bootstrap's jQuery, we'll rely on data-toggle and data-target.
    // However, resetting the form on close is a good practice.

    const resetFormFields = () => {
        setModelName("");
        setPrice("");
        setYear("");
        setPower("");
        setBattery("");
        setImageUrl("");
    };

    const onSubmitForm = async e => {
        e.preventDefault();

        const parsedPrice = parseInt(price);
        const parsedYear = parseInt(year);
        const parsedPower = parseInt(power);
        const parsedBattery = parseInt(battery);

        if (parsedPrice < 0 || parsedYear < 0 || parsedPower < 0 || parsedBattery < 0) {
            alert("Price, Year, Power, and Battery cannot be negative.");
            return;
        }

        try {
            const body = { 
                model_name, 
                price: parsedPrice, 
                year: parsedYear,
                power: parsedPower,
                battery: parsedBattery,
                image_url 
            };

            const response = await fetch("http://localhost:5000/models", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body),
                credentials: "include"
            });

            if (response.ok) {
                resetFormFields(); // Reset form on successful submission
                
                const modalElement = document.getElementById('addModelModal');
                if (modalElement && window.bootstrap && window.bootstrap.Modal) {
                    const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
                    
                    const onModalHidden = () => {
                        console.log("[InputModel] Modal 'addModelModal' 'hidden.bs.modal' event fired. Reloading page.");
                        window.location = "/";
                        modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
                    };

                    console.log("[InputModel] Attaching 'hidden.bs.modal' listener to modal 'addModelModal'.");
                    modalElement.addEventListener('hidden.bs.modal', onModalHidden, { once: true });

                    console.log("[InputModel] Calling modalInstance.hide() for modal 'addModelModal'.");
                    modalInstance.hide();

                } else {
                   console.warn("[InputModel] Bootstrap modal API not available or modal element not found. Falling back to page reload.");
                   window.location = "/"; // Fallback if modal instance can't be handled
                }
            } else {
                let errorMessage = `Error ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
                } catch (jsonError) {
                    const textError = await response.text();
                    if (textError) {
                        errorMessage = textError;
                    } 
                }
                console.error("Failed to add model:", errorMessage);
                alert(`Failed to add model: ${errorMessage}`);
            }
        } catch (err) {
            console.error("Error in onSubmitForm:", err.message);
            alert(`An error occurred while adding the model: ${err.message}`);
        }
    };

    return (
        <Fragment>
            {/* Button to trigger the modal - positioning classes removed */}
            <div> 
                <button 
                    type="button" 
                    className="btn btn-primary btn-lg" 
                    data-bs-toggle="modal" 
                    data-bs-target="#addModelModal"
                >
                    Add New EV Model
                </button>
            </div>

            {/* Modal Definition */}
            <div className="modal fade" id="addModelModal" tabIndex="-1" role="dialog" aria-labelledby="addModelModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document"> {/* modal-lg for a wider modal */}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addModelModalLabel">Add New EV Model</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={resetFormFields}></button>
                        </div>
                        <div className="modal-body">
                            {/* The form from your original InputModel */}
                            <form onSubmit={onSubmitForm}>
                                <div className="form-group mb-2">
                                    <label htmlFor="modal_model_name">Model Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modal_model_name" // Unique ID for modal form field
                                        value={model_name}
                                        onChange={e => setModelName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-2">
                                    <label htmlFor="modal_image_url">Image URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="modal_image_url"
                                        value={image_url}
                                        onChange={e => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-2">
                                            <label htmlFor="modal_price">Price (€)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="modal_price"
                                                value={price}
                                                onChange={e => setPrice(e.target.value)}
                                                required
                                                min="0"
                                                step="any"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-2">
                                            <label htmlFor="modal_year">Year</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="modal_year"
                                                value={year}
                                                onChange={e => setYear(e.target.value)}
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-2">
                                            <label htmlFor="modal_power">Power (hp)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="modal_power"
                                                value={power}
                                                onChange={e => setPower(e.target.value)}
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-2">
                                            <label htmlFor="modal_battery">Battery (kWh)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="modal_battery"
                                                value={battery}
                                                onChange={e => setBattery(e.target.value)}
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer mt-3">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetFormFields}>Close</button>
                                    <button type="submit" className="btn btn-primary">Add Model</button> 
                                    {/* On successful submit, window.location reload will close modal context */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default InputModel;