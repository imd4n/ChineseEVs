import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // console.log("[AuthProvider] Rendering - Current User:", currentUser, "Loading:", loading);

    useEffect(() => {
        // console.log("[AuthProvider] useEffect for checkStatus - Mounting or currentUser changed");
        const checkStatus = async () => {
            // console.log("[AuthProvider] checkStatus: Fetching /auth/status");
            try {
                const response = await fetch('http://localhost:5000/auth/status', {
                    method: 'GET',
                    credentials: 'include',
                });
                // console.log("[AuthProvider] checkStatus: /auth/status response: ", response.status, response.statusText);
                if (response.ok) {
                    const data = await response.json();
                    // console.log("[AuthProvider] checkStatus: /auth/status data: ", data);
                    if (data.isAuthenticated && data.user) {
                        // console.log("[AuthProvider] checkStatus: Setting current user from /auth/status", data.user);
                        setCurrentUser(data.user);
                        setIsAuthenticated(true);
                    } else {
                        setCurrentUser(null);
                        setIsAuthenticated(false);
                    }
                } else {
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('[AuthProvider] checkStatus: Error fetching auth status', error);
                setCurrentUser(null);
                setIsAuthenticated(false);
            } finally {
                // console.log("[AuthProvider] checkStatus: Setting loading to false");
                setLoading(false);
            }
        };
        checkStatus();
    }, []); // Run only on mount

    const login = async (credentials) => {
        console.log("[AuthProvider] login: Attempting login with credentials:", credentials.login);
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',
            });
            console.log("[AuthProvider] login: /auth/login response: ", response.status, response.statusText);
            const data = await response.json();

            if (response.ok && data.user) {
                console.log("[AuthProvider] login: Login successful, user data:", data.user);
                
                setCurrentUser(data.user);
                setIsAuthenticated(true);
                setLoading(false); // Set loading to false after successful login and state update
                console.log("[AuthProvider] login: User state updated.");
                return true; // Indicate login success
            } else {
                console.error("[AuthProvider] login: Login failed - ", data.message || 'Invalid credentials or server error');
                setCurrentUser(null);
                setIsAuthenticated(false);
                setLoading(false); // Ensure loading is false on error
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('[AuthProvider] login: Error during login attempt', error);
            setCurrentUser(null);
            setIsAuthenticated(false);
            setLoading(false); // Ensure loading is false on error
            throw error; // Re-throw to be caught by Login component
        }
    };

    useEffect(() => {
        if (currentUser) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
        // This effect should also ensure loading is false once currentUser is determined
        // The checkStatus effect already handles setting loading to false initially.
        // If login/logout manually sets user, loading should also be managed.
        if (!loading && (currentUser !== undefined)) { // check if initial loading is done
             // No need to set loading here if checkStatus handles it.
        }
    }, [currentUser]);

    const logout = async () => {
        console.log("[AuthProvider] logout: Attempting logout.");
        try {
            await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            console.log("[AuthProvider] logout: /auth/logout call successful.");
        } catch (error) {
            console.error('[AuthProvider] logout: Error during logout API call', error);
        } finally {
            setCurrentUser(null);
            setIsAuthenticated(false);
            // No need to set loading here unless logout implies a loading state
            console.log("[AuthProvider] logout: User state cleared.");
        }
    };

    // Update loading state correctly after login sequence
    useEffect(() => {
        if (!loading && isAuthenticated && currentUser) {
            setLoading(false); // Should be false if authenticated and user is set
        }
        // If not authenticated, loading should also be false (handled by checkStatus finally)
    }, [isAuthenticated, currentUser, loading]);


    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        logout,
    };
    // console.log("[AuthProvider] Context value updated:", value);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 