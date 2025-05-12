import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

export interface Registration {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    registeredAt: string;
}

export interface EventConfig {
    totalSeats: number;
}

export interface RegistrationContextType {
    registrations: Registration[];
    totalPages: number;
    eventConfig: EventConfig | null;
    loading: boolean;
    error: string | null;
    fetchRegistrations: (search?: string, sortBy?: string, order?: string, page?: number, limit?: number) => Promise<void>;
    registerEvent: (data: { firstName: string; lastName: string; phoneNumber: string }) => Promise<void>;
    updateEventSeats: (totalSeats: number) => Promise<void>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

    const fetchRegistrations = async (search?: string, sortBy?: string, order?: string, page?: number, limit?: number) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (sortBy) params.append('sortBy', sortBy);
            if (order) params.append('order', order);
            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());

            const response = await axios.get<{ data: Registration[], pagination: { total: number, page: number, totalPages: number } }>(`${API_URL}/registrations?${params.toString()}`);
            setRegistrations(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setError(null);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Failed to fetch registrations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const registerEvent = async (data: { firstName: string; lastName: string; phoneNumber: string }) => {
        try {
            setLoading(true);
            await axios.post<Registration>(`${API_URL}/registrations`, data);
            await fetchRegistrations();
            setError(null);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Failed to register');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateEventSeats = async (totalSeats: number) => {
        try {
            setLoading(true);
            await axios.put<EventConfig>(`${API_URL}/registrations/seats`, { totalSeats });
            const response = await axios.get<EventConfig>(`${API_URL}/registrations/seats`);
            setEventConfig(response.data);
            setError(null);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Failed to update seats');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const fetchEventConfig = async () => {
        try {
            setLoading(true);
            const response = await axios.get<EventConfig>(`${API_URL}/registrations/seats`);
            setEventConfig(response.data);
            setError(null);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Failed to fetch event configuration');
            console.error('Failed to fetch event config:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
        fetchEventConfig();
    }, []);

    return (
        <RegistrationContext.Provider
            value={{
                registrations,
                totalPages,
                eventConfig,
                loading,
                error,
                fetchRegistrations,
                registerEvent,
                updateEventSeats,
            }}
        >
            {children}
        </RegistrationContext.Provider>
    );
};

export const useRegistration = () => {
    const context = useContext(RegistrationContext);
    if (context === undefined) {
        throw new Error('useRegistration must be used within a RegistrationProvider');
    }
    return context;
}; 