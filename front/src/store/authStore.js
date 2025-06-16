import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import api from '../services/api'

export const useAuthStore = create()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                loading: false,
                isAuthenticated: false,

                // Cargar perfil de usuario
                loadUser: async () => {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    if (!token) {
                        set({ loading: false });
                        return;
                    }

                    set({ loading: true });
                    try {
                        const userData = await api.getProfile();
                        set({ 
                        user: userData, 
                        isAuthenticated: true, 
                        loading: false 
                        });
                    } catch (error) {
                        console.error('Error loading user:', error);
                        api.clearToken();
                        set({ 
                        user: null, 
                        isAuthenticated: false, 
                        loading: false 
                        });
                    }
                },

                // Login
                login: async (credentials) => {
                    try {
                        const response = await api.login(credentials);
                        localStorage.setItem('token', response.token);
                        set({ 
                            user: response.user, 
                            isAuthenticated: true 
                        });
                        return response;
                    } catch (error) {
                        throw error;
                    }
                },

                // Registro
                register: async (userData) => {
                    try {
                        const response = await api.register(userData);
                        localStorage.setItem('token', response.token);
                        set({ 
                        user: response.user, 
                        isAuthenticated: true 
                        });
                        return response;
                    } catch (error) {
                        throw error;
                    }
                },

                // Logout
                logout: () => {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                    }
                    set({ 
                        user: null, 
                        isAuthenticated: false 
                    });
                },

                // Inicializar store
                initialize: async () => {
                    await get().loadUser();
                }
            }),
            {
                name: 'auth-storage',
                partialize: (state) => ({ 
                user: state.user,
                isAuthenticated: state.isAuthenticated 
                }),
            }
        ),
        {
            name: 'auth-store',
        }
    )
)