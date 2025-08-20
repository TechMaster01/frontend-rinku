import { api } from "./api";

export interface IParametroNomina {
    id: number;
    turno_hora: number;
    pago_hora: number;
    bono_entrega: number;
    bono_chofer: number;
    bono_cargador: number;
    bono_auxiliar: number;
    vales: number;
    created_at?: string;
    updated_at?: string;
}

export interface IActualizarParametrosNomina {
    turno_hora?: number;
    pago_hora?: number;
    bono_entrega?: number;
    bono_chofer?: number;
    bono_cargador?: number;
    bono_auxiliar?: number;
    vales?: number;
}

// Respuestas del API
export interface IParametroNominaResponse {
    message: string;
    data: IParametroNomina;
}

export interface IParametrosNominaResponse extends Array<IParametroNomina> {}

export interface IErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
    error?: string;
}

const servicioParametrosNomina = {
    /**
     * Obtener todos los parámetros de nómina
     */
    consultarParametrosNomina: async (): Promise<IParametrosNominaResponse> => {
        try {
            const response = await api.get('/parametros/nomina');
            return response.data as IParametrosNominaResponse;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Actualizar parámetros de nómina por ID
     */
    actualizarParametrosNomina: async (id: number, data: IActualizarParametrosNomina): Promise<IParametroNominaResponse> => {
        try {
            const response = await api.put(`/parametros/nomina/${id}`, data);
            return response.data as IParametroNominaResponse;
        } catch (error) {
            throw error;
        }
    }
};

export default servicioParametrosNomina;