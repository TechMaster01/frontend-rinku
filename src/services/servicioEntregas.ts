import { api } from "./api";

export interface IEntrega {
  id: number;
  empleado_id: number;
  fecha: string;
  cantidad_entregas: number;
  created_at?: string;
  updated_at?: string;
}

export interface IEntregaCreate {
  empleado_id: number;
  fecha: string;
  cantidad_entregas: number;
}

export interface IEntregaUpdate {
  empleado_id?: number;
  fecha?: string;
  cantidad_entregas?: number;
}

// Respuestas del API
export interface IEntregaResponse {
  message?: string;
  data: IEntrega;
}

export interface IEntregasResponse extends Array<IEntrega> {}

export interface IErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

const servicioEntregas = {
    /**
     * Crear un nuevo registro de entrega
     */
    crearEntrega: async (data: IEntregaCreate): Promise<IEntregaResponse> => {
        try {
            const response = await api.post('/entregas', data);
            return response.data as IEntregaResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener todas las entregas
     */
    obtenerEntregas: async (): Promise<IEntregasResponse> => {
        try {
            const response = await api.get('/entregas');
            return response.data as IEntregasResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener una entrega por su ID
     */
    obtenerEntregaPorId: async (id: number): Promise<IEntrega> => {
        try {
            const response = await api.get(`/entregas/${id}`);
            return response.data as IEntrega;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Actualizar un registro de entrega
     */
    actualizarEntrega: async (id: number, data: IEntregaUpdate): Promise<IEntregaResponse> => {
        try {
            const response = await api.put(`/entregas/${id}`, data);
            return response.data as IEntregaResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Eliminar un registro de entrega
     */
    eliminarEntrega: async (id: number): Promise<{ message: string }> => {
        try {
            const response = await api.delete(`/entregas/${id}`);
            return response.data as { message: string };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener entregas por empleado
     */
    obtenerEntregasPorEmpleado: async (empleadoId: number): Promise<IEntregasResponse> => {
        try {
            const response = await api.get(`/entregas/empleado/${empleadoId}`);
            return response.data as IEntregasResponse;
        } catch (error) {
            throw error;
        }
    }
};

export default servicioEntregas;