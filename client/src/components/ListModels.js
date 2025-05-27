import React, { Fragment, useEffect, useState, useMemo } from "react";
import EditModel from "./EditModel";
import InputModel from "./InputModel";

// Helper function to format price (optional, but good for UI)
const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
};

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
        return new Date(timestamp).toLocaleString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit' 
        });
    } catch (e) {
        console.error("Error formatting timestamp:", e);
        return 'Invalid Date';
    }
};

const ListModels = () => {
    const [models, setModels] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const deleteModel = async (id) => {
        try {
            await fetch(`http://localhost:5000/models/${id}`, {
                method: "DELETE"
            });
            setModels(models.filter(cars => cars.model_id !== id));
        } catch (err) {
            console.error(err.message);
        }
    };

    const getModels = async () => {
        try {
            const response = await fetch("http://localhost:5000/models");
            const jsonData = await response.json();
            setModels(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getModels();
    }, []);

    const sortedModels = useMemo(() => {
        let sortableModels = [...models];
        if (sortConfig.key !== null) {
            sortableModels.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableModels;
    }, [models, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            // Optional: third click resets sort for this key
            // setSortConfig({ key: null, direction: 'ascending' });
            // return;
            direction = 'ascending'; // Or cycle back to ascending
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'; // Up and Down arrows
        }
        return '';
    };

    // Basic card styling (can be moved to a CSS file)
    const cardStyle = {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px', // Inner padding for the card content
        margin: '10px', // Spacing around each card (within the column)
        width: '100%',   // Make the card fill its column's width
        maxWidth: '600px', // Max width for the card itself (user-adjusted)
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    };

    const imgStyle = {
        width: '100%',
        aspectRatio: '16 / 9', // Enforce 16:9 aspect ratio
        objectFit: 'cover', 
        borderRadius: '4px',
        marginBottom: '10px'
    };

    const cardBodyStyle = {
        flexGrow: 1 // Ensures body takes available space
    };

    const cardFooterStyle = {
        marginTop: '15px',
        display: 'flex',
        justifyContent: 'space-between'
    };

    const modelNameStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '10px'
    };

    const detailRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
        fontSize: '0.9rem'
    };
    
    const sortButtonStyle = {
        marginRight: '10px',
        marginBottom: '10px'
    };

    const timestampStyle = {
        fontSize: '0.75rem',
        color: '#6c757d', // Bootstrap's text-muted color
        textAlign: 'right',
        marginTop: '5px'
    };

    return (
        <Fragment>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Available EV Models</h2>
                    <InputModel />
                </div>
                
                <div className="text-center mb-4">
                    <button 
                        type="button" 
                        onClick={() => requestSort('price')} 
                        className={`btn btn-outline-info ${sortConfig.key === 'price' ? 'active' : ''}`}
                        style={sortButtonStyle}
                    >
                        Sort by Price {getSortIndicator('price')}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => requestSort('year')} 
                        className={`btn btn-outline-info ${sortConfig.key === 'year' ? 'active' : ''}`}
                        style={sortButtonStyle}
                    >
                        Sort by Year {getSortIndicator('year')}
                    </button>
                    {sortConfig.key && (
                         <button 
                            type="button" 
                            onClick={() => setSortConfig({ key: null, direction: 'ascending' })} 
                            className="btn btn-outline-secondary"
                            style={sortButtonStyle}
                        >
                            Clear Sort
                        </button>
                    )}
                </div>

                {sortedModels.length === 0 && models.length > 0 && <p className="text-center">Sorting resulted in no models...</p>}
                {models.length === 0 && <p className="text-center">No models found. Add one!</p>}
                
                <div className="row">
                    {sortedModels.map(car => (
                        <div key={car.model_id} className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-stretch mb-4">
                            <div style={cardStyle}>
                                <img 
                                    src={car.image_url || 'https://via.placeholder.com/300x200.png?text=No+Image'} 
                                    alt={car.model_name || 'EV Model'}
                                    style={imgStyle} 
                                    onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/300x200.png?text=Image+Error'; }}
                                />
                                <div style={cardBodyStyle}>
                                    <h5 style={modelNameStyle}>{car.model_name || 'N/A'}</h5>
                                    <div style={detailRowStyle}>
                                        <span><strong>Price:</strong></span>
                                        <span>{formatPrice(car.price)}</span>
                                    </div>
                                    <div style={detailRowStyle}>
                                        <span><strong>Year:</strong></span>
                                        <span>{car.year || 'N/A'}</span>
                                    </div>
                                    <div style={detailRowStyle}>
                                        <span><strong>Power:</strong></span>
                                        <span>{car.power || 'N/A'} hp</span>
                                    </div>
                                    <div style={detailRowStyle}>
                                        <span><strong>Battery:</strong></span>
                                        <span>{car.battery || 'N/A'} kWh</span>
                                    </div>
                                </div>
                                <div style={cardFooterStyle}>
                                    <EditModel cars={car} /> 
                                    <button 
                                        className="btn btn-danger btn-sm" 
                                        onClick={() => deleteModel(car.model_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                                {car.last_edited_at && (
                                    <div style={timestampStyle}>
                                        Last edited: {formatTimestamp(car.last_edited_at)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>
    );
};

export default ListModels;