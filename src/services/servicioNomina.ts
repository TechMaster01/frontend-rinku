import { api } from "./api";

// Interfaces para la respuesta de nómina
export interface IPeriodoNomina {
    año: string;
    mes: string;
}

export interface IEmpleadoNomina {
    id: number;
    numero_empleado: number;
    nombres: string;
    apellido_paterno: string;
    apellido_materno?: string;
    rol: 'chofer' | 'cargador' | 'auxiliar';
    tipo_empleado: 'interno' | 'subcontratado';
    created_at: string;
    updated_at: string;
}

export interface INomina {
    "Sueldo Base": number;
    "Bono por cobertura": number;
    "Bono por cargo": number;
    "Bono por entregas": number;
    "Sueldo Bruto": number;
    "ISR": number;
    "Sueldo Neto": number;
    "Vales": number;
}

export interface IInformacionPeriodo {
    "Asistencias": number;
    "Horas Trabajadas": number;
    "Entregas": number;
}

export interface ICalcularNominaResponse {
    "Periodo Nomina": IPeriodoNomina;
    empleado: IEmpleadoNomina;
    Nomina: INomina;
    "Informacion Periodo": IInformacionPeriodo;
}

export interface IErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
    error?: string;
}

const servicioNomina = {
    /**
     * Calcular nómina para un empleado en un periodo específico
     */
    calcularNomina: async (numeroEmpleado: number, año: number, mes: number): Promise<ICalcularNominaResponse> => {
        try {
            const response = await api.get(`/nomina/empleado/${numeroEmpleado}/periodo/${año}/${mes}`);
            return response.data as ICalcularNominaResponse;
        } catch (error) {
            throw error;
        }
    }
};

export default servicioNomina;