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
        console.log("[EditModel] updateModel called");

        const parsedPrice = parseInt(price);
        const parsedYear = parseInt(year);
        const parsedPower = parseInt(power);
        const parsedBattery = parseInt(battery);

        if (parsedPrice < 0 || parsedYear < 0 || parsedPower < 0 || parsedBattery < 0) {
            alert("Price, Year, Power, and Battery cannot be negative.");
            console.log("[EditModel] Validation failed: Negative values submitted.");
            return;
        }
        console.log("[EditModel] Validation passed.");

        try {
            const body = { 
                model_name,
                price: parsedPrice,
                year: parsedYear,
                power: parsedPower,
                battery: parsedBattery,
                image_url 
            };
            console.log("[EditModel] Attempting fetch to update model with body:", JSON.stringify(body));
            const response = await fetch(`http://localhost:5000/models/${cars.model_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
                credentials: "include"
            });
            console.log(`[EditModel] Fetch response status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                let errorData = `Server error: ${response.status} ${response.statusText}`;
                try {
                    const resJson = await response.json();
                    errorData = resJson.message || resJson.error || JSON.stringify(resJson);
                } catch (jsonError) {
                    // If response is not JSON, try to read as text
                    try {
                        const textError = await response.text();
                        if (textError) errorData = textError;
                    } catch (textErr) {
                        // Keep the original status text if reading text also fails
                        console.error("[EditModel] Error reading text from error response:", textErr);
                    }
                }
                console.error("[EditModel] Update failed server-side or network error:", errorData);
                alert(`Failed to update model: ${errorData}`);
                return; // Stop here if update failed
            }

            console.log("[EditModel] Update successful via fetch, preparing to hide modal.");
            const modalElement = document.getElementById(`id${cars.model_id}`);
            
            if (modalElement && window.bootstrap && window.bootstrap.Modal) {
                const modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalElement);
                
                // Define the handler function separately to be able to remove it
                const onModalHidden = () => {
                    console.log(`[EditModel] Modal id${cars.model_id} 'hidden.bs.modal' event fired. Reloading page.`);
                    window.location = "/";
                    // Clean up this specific listener after execution
                    modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
                };

                // Remove any pre-existing listeners for this event on this element to avoid duplicates
                // This is a bit broad if we don't have a reference to the exact previous onModalHidden, 
                // but for a single purpose listener like this, it's generally safe.
                // A more targeted removal would require storing the handler reference.
                // For now, let's assume we only add it once before hide.
                // However, if updateModel could be called multiple times while modal is open, this is important.
                // Let's refine this to ensure we clear *our* listener if it was somehow set before.
                // To do this robustly, we'd need to store 'onModalHidden' in a way that persists if the function is re-entered.
                // For simplicity in this step, we'll rely on {once: true} and assume it's effective.
                // The main change is attaching listener *before* hide.

                console.log(`[EditModel] Attaching 'hidden.bs.modal' listener to modal id${cars.model_id}.`);
                modalElement.addEventListener('hidden.bs.modal', onModalHidden, { once: true });

                console.log(`[EditModel] Calling modalInstance.hide() for modal id${cars.model_id}.`);
                modalInstance.hide();

            } else {
                console.warn(`[EditModel] Bootstrap modal API not available or modal element id${cars.model_id} not found. Falling back to page reload for update.`);
                window.location = "/"; // Fallback
            }
        } catch (err) {
            console.error("[EditModel] Error in updateModel's main try-catch block:", err.message, err.stack);
            alert(`An unexpected error occurred while updating the model: ${err.message}`);
        }
    };

    // Effect to update state if the `cars` prop changes
    useEffect(() => {
        console.log("[EditModel] useEffect triggered: cars.model_id changed. Resetting form.", cars);
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