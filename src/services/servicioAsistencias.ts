import { api } from "./api";

export interface IAsistencia {
  id: number;
  empleado_id: number;
  fecha: string;
  cubrio_turno: boolean;
  turno_cubierto?: 'chofer' | 'cargador' | null;
  created_at?: string;
  updated_at?: string;
}

export interface IAsistenciaCreate {
  empleado_id: number;
  fecha: string;
  cubrio_turno: boolean;
  turno_cubierto?: 'chofer' | 'cargador' | null;
}

export interface IAsistenciaUpdate {
  empleado_id?: number;
  fecha?: string;
  cubrio_turno?: boolean;
  turno_cubierto?: 'chofer' | 'cargador' | null;
}

// Respuestas del API
export interface IAsistenciaResponse {
  message?: string;
  data: IAsistencia;
}

export interface IAsistenciasResponse extends Array<IAsistencia> {}

export interface IErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

const servicioAsistencias = {
    /**
     * Crear una nueva asistencia
     */
    crearAsistencia: async (data: IAsistenciaCreate): Promise<IAsistenciaResponse> => {
        try {
            const response = await api.post('/asistencias', data);
            return response.data as IAsistenciaResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener todas las asistencias
     */
    obtenerAsistencias: async (): Promise<IAsistenciasResponse> => {
        try {
            const response = await api.get('/asistencias');
            return response.data as IAsistenciasResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener una asistencia por su ID
     */
    obtenerAsistenciaPorId: async (id: number): Promise<IAsistencia> => {
        try {
            const response = await api.get(`/asistencias/${id}`);
            return response.data as IAsistencia;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Actualizar una asistencia
     */
    actualizarAsistencia: async (id: number, data: IAsistenciaUpdate): Promise<IAsistenciaResponse> => {
        try {
            const response = await api.put(`/asistencias/${id}`, data);
            return response.data as IAsistenciaResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Eliminar una asistencia
     */
    eliminarAsistencia: async (id: number): Promise<{ message: string }> => {
        try {
            const response = await api.delete(`/asistencias/${id}`);
            return response.data as { message: string };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener asistencias por empleado
     */
    obtenerAsistenciasPorEmpleado: async (empleadoId: number): Promise<IAsistenciasResponse> => {
        try {
            const response = await api.get(`/asistencias/empleado/${empleadoId}`);
            return response.data as IAsistenciasResponse;
        } catch (error) {
            throw error;
        }
    }
};

export default servicioAsistencias;