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
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import type { IAsistencia, IAsistenciaCreate, IAsistenciaUpdate } from '../../services/servicioAsistencias';
import type { IEmpleado } from '../../services/servicioEmpleados';
import servicioEmpleados from '../../services/servicioEmpleados';

interface AsistenciasFormProps {
  onSubmit: (data: IAsistenciaCreate) => Promise<void>;
  onUpdate?: (id: number, data: IAsistenciaUpdate) => Promise<void>;
  asistenciaParaEditar?: IAsistencia | null;
  cargando?: boolean;
  onCancelar?: () => void;
}

const AsistenciasForm = ({
  onSubmit,
  onUpdate,
  asistenciaParaEditar,
  cargando = false,
  onCancelar
}: AsistenciasFormProps) => {
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
    cubrio_turno: false,
    turno_cubierto: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const esEdicion = !!asistenciaParaEditar;

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
    if (asistenciaParaEditar) {
      setFormValues({
        empleado_id: asistenciaParaEditar.empleado_id.toString(),
        fecha: asistenciaParaEditar.fecha,
        cubrio_turno: asistenciaParaEditar.cubrio_turno,
        turno_cubierto: asistenciaParaEditar.turno_cubierto || ''
      });
    } else {
      setFormValues({
        empleado_id: '',
        fecha: obtenerFechaActual(),
        cubrio_turno: false,
        turno_cubierto: ''
      });
    }
    setErrores({});
  }, [asistenciaParaEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Si no cubrió turno, limpiar el campo de turno cubierto
    if (name === 'cubrio_turno' && !checked) {
      setFormValues(prev => ({
        ...prev,
        turno_cubierto: ''
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

    if (formValues.cubrio_turno && !formValues.turno_cubierto) {
      nuevosErrores.turno_cubierto = 'Selecciona el turno cubierto';
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
      const datosAsistencia = {
        empleado_id: parseInt(formValues.empleado_id),
        fecha: formValues.fecha,
        cubrio_turno: formValues.cubrio_turno,
        turno_cubierto: formValues.cubrio_turno && formValues.turno_cubierto 
          ? formValues.turno_cubierto as 'chofer' | 'cargador'
          : null
      };

      if (esEdicion && asistenciaParaEditar && onUpdate) {
        await onUpdate(asistenciaParaEditar.id, datosAsistencia);
      } else {
        await onSubmit(datosAsistencia);
      }

      // Limpiar formulario después de enviar (solo si es creación)
      if (!esEdicion) {
        setFormValues({
          empleado_id: '',
          fecha: obtenerFechaActual(),
          cubrio_turno: false,
          turno_cubierto: ''
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
      cubrio_turno: false,
      turno_cubierto: ''
    });
    setErrores({});
    if (onCancelar) {
      onCancelar();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, mx: 'auto', mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        {esEdicion ? 'Editar Asistencia' : 'Registro de Asistencia'}
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

            <FormControlLabel
              control={
                <Switch
                  checked={formValues.cubrio_turno}
                  onChange={handleChange}
                  name="cubrio_turno"
                />
              }
              label="¿Cubrió turno de otro empleado?"
            />

            {formValues.cubrio_turno && (
                <FormControl fullWidth error={!!errores.turno_cubierto}>
                    <InputLabel>Turno Cubierto</InputLabel>
                    <Select
                    name="turno_cubierto"
                    value={formValues.turno_cubierto}
                    label="Turno Cubierto"
                    onChange={(e) => handleChange(e as any)}
                    >
                    <MenuItem value="chofer">Chofer</MenuItem>
                    <MenuItem value="cargador">Cargador</MenuItem>
                    </Select>
                    {errores.turno_cubierto && (
                    <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                        {errores.turno_cubierto}
                    </Typography>
                    )}
                </FormControl>
            )}

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
                    ? 'Actualizar Asistencia' 
                    : 'Registrar Asistencia'
                }
              </Button>
            </Box>
        </Grid>
      </Box>
    </Paper>
  );
};

export default AsistenciasForm;