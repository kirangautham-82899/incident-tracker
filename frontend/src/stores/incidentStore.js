import { create } from 'zustand';
import api from '../utils/api';

const useIncidentStore = create((set, get) => ({
    incidents: [],
    currentIncident: null,
    isLoading: false,
    error: null,
    filters: {
        type: '',
        status: '',
        severity: ''
    },

    // Fetch all incidents
    fetchIncidents: async (queryParams = {}) => {
        set({ isLoading: true, error: null });
        try {
            const params = { ...get().filters, ...queryParams };
            const response = await api.get('/incidents', { params });
            set({
                incidents: response.data.data,
                isLoading: false,
                error: null
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch incidents';
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    // Fetch single incident
    fetchIncident: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/incidents/${id}`);
            set({
                currentIncident: response.data.data,
                isLoading: false,
                error: null
            });
            return { success: true, data: response.data.data };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to fetch incident';
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    // Create new incident
    createIncident: async (incidentData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/incidents', incidentData);
            const newIncident = response.data.data;

            set((state) => ({
                incidents: [newIncident, ...state.incidents],
                isLoading: false,
                error: null
            }));

            return { success: true, data: newIncident };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to create incident';
            set({ isLoading: false, error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    // Update incident status (Admin)
    updateIncidentStatus: async (id, status) => {
        try {
            const response = await api.put(`/incidents/${id}`, { status });
            const updatedIncident = response.data.data;

            set((state) => ({
                incidents: state.incidents.map((inc) =>
                    inc._id === id ? updatedIncident : inc
                ),
                currentIncident: state.currentIncident?._id === id ? updatedIncident : state.currentIncident
            }));

            return { success: true, data: updatedIncident };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to update status';
            return { success: false, error: errorMessage };
        }
    },

    // Verify incident
    verifyIncident: async (id) => {
        try {
            const response = await api.post(`/incidents/${id}/verify`);
            const updatedIncident = response.data.data;

            set((state) => ({
                incidents: state.incidents.map((inc) =>
                    inc._id === id ? updatedIncident : inc
                ),
                currentIncident: state.currentIncident?._id === id ? updatedIncident : state.currentIncident
            }));

            return { success: true, data: updatedIncident };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to verify incident';
            return { success: false, error: errorMessage };
        }
    },

    // Add incident to list (for real-time updates)
    addIncident: (incident) => {
        set((state) => ({
            incidents: [incident, ...state.incidents]
        }));
    },

    // Update incident in list (for real-time updates)
    updateIncident: (updatedIncident) => {
        set((state) => ({
            incidents: state.incidents.map((inc) =>
                inc._id === updatedIncident._id ? updatedIncident : inc
            ),
            currentIncident: state.currentIncident?._id === updatedIncident._id
                ? updatedIncident
                : state.currentIncident
        }));
    },

    // Set filters
    setFilters: (filters) => {
        set({ filters });
    },

    // Clear error
    clearError: () => set({ error: null })
}));

export default useIncidentStore;
