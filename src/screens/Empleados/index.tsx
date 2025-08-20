import { Box, Typography, Divider } from "@mui/material"
import EmpleadosForm from "../../components/Empleados/empleadosForm";
import EmpleadosList from "../../components/Empleados/empleadosList";
import { useEffect, useState } from "react";
import servicioEmpleados, { type IEmpleado, type IEmpleadoCreate, type IEmpleadoUpdate } from "../../services/servicioEmpleados";
import Swal from 'sweetalert2';

type Estado = {
    empleados: IEmpleado[];
    cargando: boolean;
    empleadoParaEditar: IEmpleado | null;
}

const EmpleadoScreen = () => {
    const [estado, setEstado] = useState<Estado>({
        empleados: [],
        cargando: false,
        empleadoParaEditar: null
    });

    const crearEmpleado = async (data: IEmpleadoCreate) => {
        try {
            const response = await servicioEmpleados.crearEmpleado(data);
            Swal.fire({
                title: 'Creado',
                text: `El empleado ${response.data.numero_empleado} ha sido creado correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            obtenerEmpleados(); // Actualizar la lista después de crear
        } catch (error) {
            console.error(error);
        }
    }

    const obtenerEmpleados = async () => {
        try {
            setEstado(prev => ({ ...prev, cargando: true }));
            const empleados = await servicioEmpleados.obtenerEmpleados();
            setEstado(prev => ({
                ...prev,
                empleados,
                cargando: false
            }));
        } catch (error) {
            console.error(error);
            setEstado(prev => ({ ...prev, cargando: false }));
        }
    };

    const actualizarEmpleado = async (id: number, data: IEmpleadoUpdate) => {
        try {
            const response = await servicioEmpleados.actualizarEmpleado(id, data);
            obtenerEmpleados(); // Actualizar la lista después de editar
            Swal.fire({
                title: 'Actualizado',
                text: `El empleado ${response.data.numero_empleado} ha sido actualizado correctamente`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            setEstado(prev => ({ ...prev, empleadoParaEditar: null }));
        } catch (error) {
            console.error(error);
        }
    }

    const eliminarEmpleado = async (id: number) => {
        // Diálogo de confirmación con SweetAlert2
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        // Si el usuario confirma la eliminación
        if (resultado.isConfirmed) {
            try {
                setEstado(prev => ({ ...prev, cargando: true }));
                await servicioEmpleados.eliminarEmpleado(id);
                
                // Mostrar notificación de éxito
                Swal.fire({
                    title: 'Eliminado',
                    text: 'El empleado ha sido eliminado correctamente',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                obtenerEmpleados(); // Actualizar la lista después de eliminar
            } catch (error: any) {
                // Mostrar notificación de error
                Swal.fire({
                    title: 'Error',
                    text: error.message || 'No se pudo eliminar el empleado',
                    icon: 'error'
                });
                console.error(error);
                setEstado(prev => ({ ...prev, cargando: false }));
            }
        }
    }

    useEffect(() => {
        obtenerEmpleados();
    }, []);

    return(
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
                Empleados
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Gestión de empleados - Registra y administra la información del personal
            </Typography>
            <Divider sx={{ my: 2 }} />

            <EmpleadosForm 
              onSubmit={crearEmpleado}
              onUpdate={actualizarEmpleado}
              empleadoParaEditar={estado.empleadoParaEditar}
              cargando={estado.cargando}
              onCancelar={() => setEstado(prev => ({ ...prev, empleadoParaEditar: null }))}
            />

            <Divider sx={{ my: 2 }} />

            <EmpleadosList 
                empleados={estado.empleados}
                cargando={estado.cargando}
                onEliminar={eliminarEmpleado}
                onEditar={(empleado) => setEstado(prev => ({ ...prev, empleadoParaEditar: empleado }))}
            />
        </Box>
    )
}

export default EmpleadoScreen;