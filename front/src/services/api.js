import axios from "axios";

const AUTH_API = "http://localhost:3001/api/auth"
const TASK_API = "http://localhost:3002/api/tasks"
const LIST_API = "http://localhost:3003/api/lists"

const createClient = (baseURL) => {
    const client = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json'
        }
    })

    // Interceptor para agregar token automáticamente
    client.interceptors.request.use(
        (config) => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
    client.interceptors.response.use(
        (response) => response,
        (error) => {
            // Si el token es inválido, limpiar localStorage
            if (error.response?.status === 401 && typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }
            
            // Retornar el error con mensaje mejorado
            const message = error.response?.data?.message || error.message || 'Error desconocido';
            return Promise.reject(new Error(message));
        }
    );

    return client;
}

const authClient = createClient(AUTH_API)
const taskClient = createClient(TASK_API)
const listClient = createClient(LIST_API)

class ApiClient {
    // Métodos de autenticación
    async register(userData) {
        const response = await authClient.post('/register', userData);
        return response.data;
    }

    async login(credentials) {
        const response = await authClient.post('/login', credentials);
        return response.data;
    }

    async getProfile() {
        const response = await authClient.get('/profile');
        return response.data;
    }

    // Métodos de listas
    async getLists() {
        const response = await listClient.get('/');
        return response.data;
    }

    async createList(listData) {
        const response = await listClient.post('/', listData);
        return response.data;
    }

    async updateList(id, listData) {
        const response = await listClient.put(`/${id}`, listData);
        return response.data;
    }

    async deleteList(id) {
        const response = await listClient.delete(`/${id}`);
        return response.data;
    }

    async shareList(id, email) {
        const response = await listClient.post(`/${id}/share`, { email });
        return response.data;
    }

    // Métodos de tareas
    async getTasks(listId) {
        const response = await taskClient.get(`/list/${listId}`);
        return response.data;
    }

    async createTask(listId, taskData) {
        const response = await taskClient.post(`/list/${listId}`, taskData);
        return response.data;
    }

    async updateTask(id, taskData) {
        const response = await taskClient.put(`/${id}`, taskData);
        return response.data;
    }

    async deleteTask(id) {
        console.log(id)
        const response = await taskClient.delete(`/${id}`);
        return response.data;
    }
}

export default new ApiClient();