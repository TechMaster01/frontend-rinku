// filepath: c:\Users\lunam\Downloads\Coppel\frontend\src\screens\Asistencias_Entregas\index.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Switch,
  FormControlLabel,
  Stack
} from '@mui/material';
import { Assignment as AssignmentIcon, LocalShipping as LocalShippingIcon } from '@mui/icons-material';
import AsistenciasForm from '../../components/Asistencia/asistenciasForm';
import AsistenciasList from '../../components/Asistencia/asistenciasList';
import EntregasForm from '../../components/Asistencia/entregasForm';
import EntregasList from '../../components/Asistencia/entregasList';
import servicioAsistencias, { type IAsistencia, type IAsistenciaCreate, type IAsistenciaUpdate } from '../../services/servicioAsistencias';
import servicioEntregas, { type IEntrega, type IEntregaCreate, type IEntregaUpdate } from '../../services/servicioEntregas';
import Swal from 'sweetalert2';

type ModoVista = 'asistencias' | 'entregas';

type EstadoAsistencias = {
  asistencias: IAsistencia[];
  cargando: boolean;
  asistenciaParaEditar: IAsistencia | null;
};

type EstadoEntregas = {
  entregas: IEntrega[];
  cargando: boolean;
  entregaParaEditar: IEntrega | null;
};

const AsistenciaScreen = () => {
  const [modo, setModo] = useState<ModoVista>('asistencias');

  // Estados para asistencias
  const [estadoAsistencias, setEstadoAsistencias] = useState<EstadoAsistencias>({
    asistencias: [],
    cargando: false,
    asistenciaParaEditar: null
  });

  // Estados para entregas
  const [estadoEntregas, setEstadoEntregas] = useState<EstadoEntregas>({
    entregas: [],
    cargando: false,
    entregaParaEditar: null
  });

  // ====== FUNCIONES PARA ASISTENCIAS ======
  const crearAsistencia = async (data: IAsistenciaCreate) => {
    try {
      await servicioAsistencias.crearAsistencia(data);
      Swal.fire({
        title: 'Creada',
        text: 'La asistencia ha sido registrada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      obtenerAsistencias();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo registrar la asistencia',
        icon: 'error'
      });
    }
  };

  const obtenerAsistencias = async () => {
    try {
      setEstadoAsistencias(prev => ({ ...prev, cargando: true }));
      const asistencias = await servicioAsistencias.obtenerAsistencias();
      setEstadoAsistencias(prev => ({
        ...prev,
        asistencias,
        cargando: false
      }));
    } catch (error) {
      console.error(error);
      setEstadoAsistencias(prev => ({ ...prev, cargando: false }));
    }
  };

  const actualizarAsistencia = async (id: number, data: IAsistenciaUpdate) => {
    try {
      await servicioAsistencias.actualizarAsistencia(id, data);
      obtenerAsistencias();
      Swal.fire({
        title: 'Actualizada',
        text: 'La asistencia ha sido actualizada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setEstadoAsistencias(prev => ({ ...prev, asistenciaParaEditar: null }));
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar la asistencia',
        icon: 'error'
      });
    }
  };

  const eliminarAsistencia = async (id: number) => {
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

    if (resultado.isConfirmed) {
      try {
        setEstadoAsistencias(prev => ({ ...prev, cargando: true }));
        await servicioAsistencias.eliminarAsistencia(id);
        
        Swal.fire({
          title: 'Eliminada',
          text: 'La asistencia ha sido eliminada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        obtenerAsistencias();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo eliminar la asistencia',
          icon: 'error'
        });
        console.error(error);
        setEstadoAsistencias(prev => ({ ...prev, cargando: false }));
      }
    }
  };

  // ====== FUNCIONES PARA ENTREGAS ======
  const crearEntrega = async (data: IEntregaCreate) => {
    try {
      await servicioEntregas.crearEntrega(data);
      Swal.fire({
        title: 'Creada',
        text: 'La entrega ha sido registrada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      obtenerEntregas();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo registrar la entrega',
        icon: 'error'
      });
    }
  };

  const obtenerEntregas = async () => {
    try {
      setEstadoEntregas(prev => ({ ...prev, cargando: true }));
      const entregas = await servicioEntregas.obtenerEntregas();
      setEstadoEntregas(prev => ({
        ...prev,
        entregas,
        cargando: false
      }));
    } catch (error) {
      console.error(error);
      setEstadoEntregas(prev => ({ ...prev, cargando: false }));
    }
  };

  const actualizarEntrega = async (id: number, data: IEntregaUpdate) => {
    try {
      await servicioEntregas.actualizarEntrega(id, data);
      obtenerEntregas();
      Swal.fire({
        title: 'Actualizada',
        text: 'La entrega ha sido actualizada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setEstadoEntregas(prev => ({ ...prev, entregaParaEditar: null }));
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar la entrega',
        icon: 'error'
      });
    }
  };

  const eliminarEntrega = async (id: number) => {
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

    if (resultado.isConfirmed) {
      try {
        setEstadoEntregas(prev => ({ ...prev, cargando: true }));
        await servicioEntregas.eliminarEntrega(id);
        
        Swal.fire({
          title: 'Eliminada',
          text: 'La entrega ha sido eliminada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        obtenerEntregas();
      } catch (error: any) {
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo eliminar la entrega',
          icon: 'error'
        });
        console.error(error);
        setEstadoEntregas(prev => ({ ...prev, cargando: false }));
      }
    }
  };

  // Cargar datos al montar el componente y cambiar de modo
  useEffect(() => {
    if (modo === 'asistencias') {
      obtenerAsistencias();
    } else {
      obtenerEntregas();
    }
  }, [modo]);

  const handleModoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModo(event.target.checked ? 'entregas' : 'asistencias');
    // Limpiar estados de edición al cambiar de modo
    setEstadoAsistencias(prev => ({ ...prev, asistenciaParaEditar: null }));
    setEstadoEntregas(prev => ({ ...prev, entregaParaEditar: null }));
  };

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
        Asistencias y Entregas
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Gestión de asistencias y entregas - Registra y administra la información diaria del personal
      </Typography>
      
      <Divider sx={{ my: 2 }} />

      {/* Switch para cambiar entre modos */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <AssignmentIcon color={modo === 'asistencias' ? 'primary' : 'disabled'} />
          <FormControlLabel
            control={
              <Switch
                checked={modo === 'entregas'}
                onChange={handleModoChange}
                color="primary"
              />
            }
            label={
              <Typography variant="h6" color="primary">
                {modo === 'asistencias' ? 'Asistencias' : 'Entregas'}
              </Typography>
            }
            sx={{ m: 0 }}
          />
          <LocalShippingIcon color={modo === 'entregas' ? 'primary' : 'disabled'} />
        </Stack>
      </Paper>

      {/* Contenido según el modo seleccionado */}
      {modo === 'asistencias' ? (
        <>
          <AsistenciasForm 
            onSubmit={crearAsistencia}
            onUpdate={actualizarAsistencia}
            asistenciaParaEditar={estadoAsistencias.asistenciaParaEditar}
            cargando={estadoAsistencias.cargando}
            onCancelar={() => setEstadoAsistencias(prev => ({ ...prev, asistenciaParaEditar: null }))}
          />

          <Divider sx={{ my: 2 }} />

          <AsistenciasList 
            asistencias={estadoAsistencias.asistencias}
            cargando={estadoAsistencias.cargando}
            onEliminar={eliminarAsistencia}
            onEditar={(asistencia) => setEstadoAsistencias(prev => ({ ...prev, asistenciaParaEditar: asistencia }))}
          />
        </>
      ) : (
        <>
          <EntregasForm 
            onSubmit={crearEntrega}
            onUpdate={actualizarEntrega}
            entregaParaEditar={estadoEntregas.entregaParaEditar}
            cargando={estadoEntregas.cargando}
            onCancelar={() => setEstadoEntregas(prev => ({ ...prev, entregaParaEditar: null }))}
          />

          <Divider sx={{ my: 2 }} />

          <EntregasList 
            entregas={estadoEntregas.entregas}
            cargando={estadoEntregas.cargando}
            onEliminar={eliminarEntrega}
            onEditar={(entrega) => setEstadoEntregas(prev => ({ ...prev, entregaParaEditar: entrega }))}
          />
        </>
      )}
    </Box>
  );
};

export default AsistenciaScreen;