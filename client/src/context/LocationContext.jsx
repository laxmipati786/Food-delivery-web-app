import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(() => {
        return localStorage.getItem('userLocation') || 'Select location...';
    });

    useEffect(() => {
        localStorage.setItem('userLocation', location);
    }, [location]);

    return (
        <LocationContext.Provider value={{ location, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
