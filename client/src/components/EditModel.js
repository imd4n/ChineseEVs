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
        e.stopPropagation(); // Stop event propagation

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
            const response = await fetch(`http://localhost:5000/models/${cars.model_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
                credentials: "include"
            });

            if (!response.ok) {
                let errorData = `Server error: ${response.status} ${response.statusText}`;
                try {
                    const resJson = await response.json();
                    errorData = resJson.message || resJson.error || JSON.stringify(resJson);
                } catch (jsonError) {
                    try {
                        const textError = await response.text();
                        if (textError) errorData = textError;
                    } catch (textErr) {
                        // Keep the original status text
                    }
                }
                console.error("Update failed:", errorData);
                alert(`Failed to update model: ${errorData}`);
                return;
            }

            const modalElement = document.getElementById(`id${cars.model_id}`);
            
            if (modalElement && window.bootstrap && window.bootstrap.Modal) {
                const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
                
                const onModalHidden = () => {
                    window.location = "/";
                    modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
                };

                modalElement.addEventListener('hidden.bs.modal', onModalHidden, { once: true });
                modalInstance.hide();
            } else {
                console.warn(`Bootstrap modal API not available or modal element id${cars.model_id} not found. Falling back to page reload for update.`);
                window.location = "/";
            }
        } catch (err) {
            console.error("Error in updateModel:", err.message, err.stack);
            alert(`An unexpected error occurred while updating the model: ${err.message}`);
        }
    };

    // Effect to update state if the `cars` prop changes
    useEffect(() => {
        resetForm();
    }, [cars.model_id]); // Depend on cars.model_id

    return (
        <Fragment>
            <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target={`#id${cars.model_id}`}>
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
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={resetForm}></button>
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
                                            min="0"
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
                                            min="0"
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
                                            min="0"
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
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-warning" 
                                onClick={e => updateModel(e)}
                            >
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-danger" 
                                data-bs-dismiss="modal" 
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

const propsAreEqual = (prevProps, nextProps) => {
    const prevCar = prevProps.cars;
    const nextCar = nextProps.cars;

    if (prevCar.model_id !== nextCar.model_id) return false;
    if (prevCar.model_name !== nextCar.model_name) return false;
    if (prevCar.price !== nextCar.price) return false;
    if (prevCar.year !== nextCar.year) return false;
    if (prevCar.power !== nextCar.power) return false;
    if (prevCar.battery !== nextCar.battery) return false;
    if (prevCar.image_url !== nextCar.image_url) return false;
    // last_edited_at can change frequently, so comparing it might cause too many re-renders
    // if it's only displayed. If it affects form logic, include it.
    // For now, let's assume it doesn't need to trigger a re-render of the edit form itself.
    // if (prevCar.last_edited_at !== nextCar.last_edited_at) return false;

    // Add comparisons for any other props EditModel might receive directly
    // if they are relevant for re-rendering.

    return true; // If all relevant fields are equal, props are equal.
};

export default React.memo(EditModel, propsAreEqual);