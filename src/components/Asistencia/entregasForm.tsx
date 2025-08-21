import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import type { IEntrega, IEntregaCreate, IEntregaUpdate } from '../../services/servicioEntregas';
import type { IEmpleado } from '../../services/servicioEmpleados';
import servicioEmpleados from '../../services/servicioEmpleados';

interface EntregasFormProps {
  onSubmit: (data: IEntregaCreate) => Promise<void>;
  onUpdate?: (id: number, data: IEntregaUpdate) => Promise<void>;
  entregaParaEditar?: IEntrega | null;
  cargando?: boolean;
  onCancelar?: () => void;
}

const EntregasForm = ({
  onSubmit,
  onUpdate,
  entregaParaEditar,
  cargando = false,
  onCancelar
}: EntregasFormProps) => {
  const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
  const [cargandoEmpleados, setCargandoEmpleados] = useState(false);

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const [formValues, setFormValues] = useState({
    empleado_id: '',
    fecha: obtenerFechaActual(),
    cantidad_entregas: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const esEdicion = !!entregaParaEditar;

  // Obtener la fecha máxima (hoy)
  const fechaMaxima = obtenerFechaActual();

  // Cargar empleados
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        setCargandoEmpleados(true);
        const empleadosData = await servicioEmpleados.obtenerEmpleados();
        setEmpleados(empleadosData);
      } catch (error) {
        console.error('Error cargando empleados:', error);
      } finally {
        setCargandoEmpleados(false);
      }
    };
    
    cargarEmpleados();
  }, []);

  // Efecto para cargar datos cuando se va a editar
  useEffect(() => {
    if (entregaParaEditar) {
      setFormValues({
        empleado_id: entregaParaEditar.empleado_id.toString(),
        fecha: entregaParaEditar.fecha,
        cantidad_entregas: entregaParaEditar.cantidad_entregas.toString()
      });
    } else {
      setFormValues({
        empleado_id: '',
        fecha: obtenerFechaActual(),
        cantidad_entregas: ''
      });
    }
    setErrores({});
  }, [entregaParaEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formValues.empleado_id) {
      nuevosErrores.empleado_id = 'Selecciona un empleado';
    }

    if (!formValues.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida';
    } else if (formValues.fecha > fechaMaxima) {
      nuevosErrores.fecha = 'No se pueden registrar fechas futuras';
    }

    if (!formValues.cantidad_entregas) {
      nuevosErrores.cantidad_entregas = 'La cantidad de entregas es requerida';
    } else if (parseInt(formValues.cantidad_entregas) < 0) {
      nuevosErrores.cantidad_entregas = 'La cantidad no puede ser negativa';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      const datosEntrega = {
        empleado_id: parseInt(formValues.empleado_id),
        fecha: formValues.fecha,
        cantidad_entregas: parseInt(formValues.cantidad_entregas)
      };

      if (esEdicion && entregaParaEditar && onUpdate) {
        await onUpdate(entregaParaEditar.id, datosEntrega);
      } else {
        await onSubmit(datosEntrega);
      }

      // Limpiar formulario después de enviar (solo si es creación)
      if (!esEdicion) {
        setFormValues({
          empleado_id: '',
          fecha: obtenerFechaActual(),
          cantidad_entregas: ''
        });
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  const handleCancelar = () => {
    setFormValues({
      empleado_id: '',
      fecha: obtenerFechaActual(),
      cantidad_entregas: ''
    });
    setErrores({});
    if (onCancelar) {
      onCancelar();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, mx: 'auto', mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        {esEdicion ? 'Editar Entrega' : 'Registro de Entrega'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
            <FormControl fullWidth error={!!errores.empleado_id}>
                <InputLabel>Empleado</InputLabel>
                <Select
                    name="empleado_id"
                    value={formValues.empleado_id}
                    label="Empleado"
                    onChange={(e) => handleChange(e as any)}
                    disabled={cargandoEmpleados}
                >
                    {empleados.map((empleado) => (
                    <MenuItem key={empleado.id} value={empleado.id}>
                        {empleado.numero_empleado} - {empleado.nombres} {empleado.apellido_paterno}
                    </MenuItem>
                    ))}
                </Select>
                {errores.empleado_id && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                    {errores.empleado_id}
                    </Typography>
                )}
            </FormControl>

            <TextField
              fullWidth
              type="date"
              name="fecha"
              label="Fecha"
              value={formValues.fecha}
              onChange={handleChange}
              error={!!errores.fecha}
              helperText={errores.fecha}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 
                max: fechaMaxima // Restricción para no permitir fechas futuras
              }}
            />

            <TextField
              fullWidth
              type="number"
              name="cantidad_entregas"
              label="Cantidad de Entregas"
              value={formValues.cantidad_entregas}
              onChange={handleChange}
              error={!!errores.cantidad_entregas}
              helperText={errores.cantidad_entregas}
              inputProps={{ min: 0 }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              {esEdicion && (
                <Button
                  variant="outlined"
                  onClick={handleCancelar}
                  disabled={cargando}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={cargando || cargandoEmpleados}
                startIcon={cargando ? <CircularProgress size={20} /> : undefined}
              >
                {cargando 
                  ? 'Guardando...' 
                  : esEdicion 
                    ? 'Actualizar Entrega' 
                    : 'Registrar Entrega'
                }
              </Button>
            </Box>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EntregasForm;