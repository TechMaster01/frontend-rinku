import { api } from "./api";

export interface IEmpleado {
  id: number;
  numero_empleado: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string; // opcional
  rol: 'chofer' | 'cargador' | 'auxiliar';
  tipo_empleado: 'interno' | 'subcontratado';
}

export interface IEmpleadoCreate {
  numero_empleado: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string;
  rol: 'chofer' | 'cargador' | 'auxiliar';
  tipo_empleado: 'interno' | 'subcontratado';
}

export interface IEmpleadoUpdate {
  numero_empleado?: number;
  nombres?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  rol?: 'chofer' | 'cargador' | 'auxiliar';
  tipo_empleado?: 'interno' | 'subcontratado';
}

// Respuestas del API
export interface IEmpleadoResponse {
  message: string;
  data: IEmpleado;
}

export interface IEmpleadosResponse extends Array<IEmpleado> {}

export interface IErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  error?: string;
}

const servicioEmpleados = {
    crearEmpleado: async (data: IEmpleadoCreate): Promise<IEmpleadoResponse> => {
        try {
            const response = await api.post('/empleados', data);
            return response.data as IEmpleadoResponse;
        } catch (error) {
            throw error;
        }
    },

    obtenerEmpleados: async (): Promise<IEmpleadosResponse> => {
        try {
            const response = await api.get('/empleados');
            return response.data as IEmpleadosResponse;
        } catch (error) {
            throw error;
        }
    },

    actualizarEmpleado: async (id: number, data: IEmpleadoUpdate): Promise<IEmpleadoResponse> => {
        try {
            const response = await api.put(`/empleados/${id}`, data);
            return response.data as IEmpleadoResponse;
        } catch (error) {
            throw error;
        }
    },

    eliminarEmpleado: async (id: number): Promise<IEmpleadoResponse> => {
        try {
            const response = await api.delete(`/empleados/${id}`);
            return response.data as IEmpleadoResponse;
        } catch (error) {
            throw error;
        }
    }
}

export default servicioEmpleados;