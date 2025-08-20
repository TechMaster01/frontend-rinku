import { Box, Typography, Divider, Alert } from "@mui/material";
import ParametrosNominaForm from "../../components/ParametrosNomina/parametrosNominaForm";
import ParametrosNominaList from "../../components/ParametrosNomina/parametrosNominaList";
import { useEffect, useState } from "react";
import servicioParametrosNomina, { 
    type IParametroNomina, 
    type IActualizarParametrosNomina 
} from "../../services/servicioParametrosNomina";
import Swal from 'sweetalert2';

type Estado = {
    parametros: IParametroNomina | null;
    cargando: boolean;
    parametrosParaEditar: IParametroNomina | null;
    error: string | null;
}

const ParametrosNominaScreen = () => {
    const [estado, setEstado] = useState<Estado>({
        parametros: null,
        cargando: false,
        parametrosParaEditar: null,
        error: null
    });

    const consultarParametrosNomina = async () => {
        try {
            setEstado(prev => ({ ...prev, cargando: true, error: null }));
            const parametrosArray = await servicioParametrosNomina.consultarParametrosNomina();
            
            // Como solo hay un registro con ID 1, tomamos el primero
            const parametros = parametrosArray.length > 0 ? parametrosArray[0] : null;
            
            setEstado(prev => ({
                ...prev,
                parametros,
                cargando: false
            }));
        } catch (error: any) {
            console.error(error);
            setEstado(prev => ({ 
                ...prev, 
                cargando: false,
                error: 'Error al cargar los parámetros de nómina'
            }));
        }
    };

    const actualizarParametrosNomina = async (id: number, data: IActualizarParametrosNomina) => {
        try {
            setEstado(prev => ({ ...prev, cargando: true }));
            const response = await servicioParametrosNomina.actualizarParametrosNomina(id, data);
            
            // Actualizar el estado con los nuevos datos
            setEstado(prev => ({
                ...prev,
                parametros: response.data,
                parametrosParaEditar: null,
                cargando: false
            }));

            // Mostrar notificación de éxito
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Los parámetros de nómina han sido actualizados correctamente',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });

        } catch (error: any) {
            console.error(error);
            setEstado(prev => ({ ...prev, cargando: false }));
            
            // Mostrar notificación de error
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'No se pudieron actualizar los parámetros',
                icon: 'error'
            });
        }
    };

    const handleEditarParametros = (parametros: IParametroNomina) => {
        setEstado(prev => ({ ...prev, parametrosParaEditar: parametros }));
    };

    const handleCancelarEdicion = () => {
        setEstado(prev => ({ ...prev, parametrosParaEditar: null }));
    };

    useEffect(() => {
        consultarParametrosNomina();
    }, []);

    return (
        <Box sx={{ 
            mt: { xs: 6, sm: 2 },
            px: { xs: 1, sm: 2 }
        }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                    fontWeight: 'medium',
                    color: 'primary.main'
                }}
            >
                Parámetros de Nómina
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Configuración de parámetros para el cálculo de nóminas - Estos valores se aplicarán a todos los empleados
            </Typography>

            {estado.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {estado.error}
                </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Mostrar formulario solo si hay parámetros para editar */}
            {estado.parametrosParaEditar && (
                <>
                    <ParametrosNominaForm 
                        parametrosParaEditar={estado.parametrosParaEditar}
                        onUpdate={actualizarParametrosNomina}
                        onCancelar={handleCancelarEdicion}
                        cargando={estado.cargando}
                    />
                    <Divider sx={{ my: 2 }} />
                </>
            )}

            {/* Lista/Vista de parámetros actuales */}
            <ParametrosNominaList 
                parametros={estado.parametros}
                cargando={estado.cargando}
                onEditar={handleEditarParametros}
            />
        </Box>
    );
};

export default ParametrosNominaScreen;