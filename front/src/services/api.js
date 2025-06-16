import axios from "axios";
import { useAuth } from "../store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Interceptor para agregar token automáticamente
        this.client.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para manejar errores de respuesta
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // Si el token es inválido, limpiar localStorage
                if (error.response?.status === 401) {
                this.clearToken();
                }
                
                // Retornar el error con mensaje mejorado
                const message = error.response?.data?.message || error.message || 'Error desconocido';
                return Promise.reject(new Error(message));
            }
        );
    }

    // Obtener token del localStorage
    getToken() {
        if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
        }
        return null;
    }

    // Limpiar token del localStorage
    clearToken() {
        if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        }
    }

    // Métodos de autenticación
    async register(userData) {
        const response = await this.client.post('/auth/register', userData);
        return response.data;
    }

    async login(credentials) {
        const response = await this.client.post('/auth/login', credentials);
        return response.data;
    }

    async getProfile() {
        const response = await this.client.get('/auth/profile');
        return response.data;
    }

    // Métodos de listas
    async getLists() {
        const response = await this.client.get('/lists');
        return response.data;
    }

    async createList(listData) {
        const response = await this.client.post('/lists', listData);
        return response.data;
    }

    async updateList(id, listData) {
        const response = await this.client.put(`/lists/${id}`, listData);
        return response.data;
    }

    async deleteList(id) {
        const response = await this.client.delete(`/lists/${id}`);
        return response.data;
    }

    async shareList(id, email) {
        const response = await this.client.post(`/lists/${id}/share`, { email });
        return response.data;
    }

    // Métodos de tareas
    async getTasks(listId) {
        const response = await this.client.get(`/tasks/list/${listId}`);
        return response.data;
    }

    async createTask(listId, taskData) {
        const response = await this.client.post(`/tasks/list/${listId}`, taskData);
        return response.data;
    }

    async updateTask(id, taskData) {
        const response = await this.client.put(`/tasks/${id}`, taskData);
        return response.data;
    }

    async deleteTask(id) {
        const response = await this.client.delete(`/tasks/${id}`);
        return response.data;
    }

    // Métodos de comentarios
    async getComments(taskId) {
        const response = await this.client.get(`/comments/task/${taskId}`);
        return response.data;
    }

    async createComment(taskId, content) {
        const response = await this.client.post(`/comments/task/${taskId}`, { content });
        return response.data;
    }

    async deleteComment(id) {
        const response = await this.client.delete(`/comments/${id}`);
        return response.data;
    }
}

export default new ApiClient();