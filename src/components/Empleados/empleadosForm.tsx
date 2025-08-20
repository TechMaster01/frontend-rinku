import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Stack,
  CircularProgress
} from '@mui/material';
import { PersonAdd as PersonAddIcon, Cancel as CancelIcon, Edit as EditIcon } from '@mui/icons-material';
import type { IEmpleado, IEmpleadoCreate, IEmpleadoUpdate } from '../../services/servicioEmpleados';

interface EmpleadosFormProps {
  onSubmit: (data: IEmpleadoCreate) => Promise<void>;
  onUpdate?: (id: number, data: IEmpleadoUpdate) => Promise<void>;
  empleadoParaEditar?: IEmpleado | null;
  cargando?: boolean;
  onCancelar?: () => void;
}

const EmpleadosForm = ({ 
  onSubmit, 
  onUpdate, 
  empleadoParaEditar, 
  cargando = false, 
  onCancelar 
}: EmpleadosFormProps) => {
  const [formValues, setFormValues] = useState({
    numero_empleado: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    rol: 'auxiliar' as 'chofer' | 'cargador' | 'auxiliar',
    tipo_empleado: 'interno' as 'interno' | 'subcontratado'
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const esEdicion = !!empleadoParaEditar;

  // Efecto para cargar datos cuando se va a editar
  useEffect(() => {
    if (empleadoParaEditar) {
      setFormValues({
        numero_empleado: empleadoParaEditar.numero_empleado.toString(),
        nombres: empleadoParaEditar.nombres,
        apellido_paterno: empleadoParaEditar.apellido_paterno,
        apellido_materno: empleadoParaEditar.apellido_materno || '',
        rol: empleadoParaEditar.rol,
        tipo_empleado: empleadoParaEditar.tipo_empleado
      });
    } else {
      // Limpiar formulario si no hay empleado para editar
      setFormValues({
        numero_empleado: '',
        nombres: '',
        apellido_paterno: '',
        apellido_materno: '',
        rol: 'auxiliar',
        tipo_empleado: 'interno'
      });
    }
    setErrores({});
  }, [empleadoParaEditar]);

  // Handler para cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validación del formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formValues.numero_empleado.trim()) {
      nuevosErrores.numero_empleado = 'El número de empleado es requerido';
    } else if (parseInt(formValues.numero_empleado) < 1) {
      nuevosErrores.numero_empleado = 'El número de empleado debe ser mayor a 0';
    }

    if (!formValues.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son requeridos';
    }

    if (!formValues.apellido_paterno.trim()) {
      nuevosErrores.apellido_paterno = 'El apellido paterno es requerido';
    }

    if (!formValues.rol) {
      nuevosErrores.rol = 'El rol es requerido';
    }

    if (!formValues.tipo_empleado) {
      nuevosErrores.tipo_empleado = 'El tipo de empleado es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Handler para el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      const datosEmpleado = {
        numero_empleado: parseInt(formValues.numero_empleado),
        nombres: formValues.nombres.trim(),
        apellido_paterno: formValues.apellido_paterno.trim(),
        apellido_materno: formValues.apellido_materno.trim() || undefined,
        rol: formValues.rol,
        tipo_empleado: formValues.tipo_empleado
      };

      if (esEdicion && empleadoParaEditar && onUpdate) {
        await onUpdate(empleadoParaEditar.id, datosEmpleado);
      } else {
        await onSubmit(datosEmpleado as IEmpleadoCreate);
      }

      // Limpiar formulario después de enviar (solo si es creación)
      if (!esEdicion) {
        setFormValues({
          numero_empleado: '',
          nombres: '',
          apellido_paterno: '',
          apellido_materno: '',
          rol: 'auxiliar',
          tipo_empleado: 'interno'
        });
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
    }
  };

  const handleCancelar = () => {
    setFormValues({
      numero_empleado: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      rol: 'auxiliar',
      tipo_empleado: 'interno'
    });
    setErrores({});
    if (onCancelar) {
      onCancelar();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, mx: 'auto', mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        {esEdicion ? 'Editar Empleado' : 'Registro de Empleado'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
            {/* Número de empleado */}
            <TextField
              fullWidth
              required
              id="numero_empleado"
              name="numero_empleado"
              label="Número de Empleado"
              type="number"
              value={formValues.numero_empleado}
              onChange={handleChange}
              variant="outlined"
              inputProps={{ min: 1 }}
              helperText={errores.numero_empleado || "Número único de identificación"}
              error={!!errores.numero_empleado}
              autoComplete='off'
              disabled={cargando}
            />

            {/* Nombres */}
            <TextField
              fullWidth
              required
              id="nombres"
              name="nombres"
              label="Nombres"
              value={formValues.nombres}
              onChange={handleChange}
              variant="outlined"
              helperText={errores.nombres}
              error={!!errores.nombres}
              autoComplete='off'
              disabled={cargando}
            />

            {/* Apellido Paterno */}
            <TextField
              fullWidth
              required
              id="apellido_paterno"
              name="apellido_paterno"
              label="Apellido Paterno"
              value={formValues.apellido_paterno}
              onChange={handleChange}
              variant="outlined"
              helperText={errores.apellido_paterno}
              error={!!errores.apellido_paterno}
              autoComplete='off'
              disabled={cargando}
            />

            {/* Apellido Materno */}
            <TextField
              fullWidth
              id="apellido_materno"
              name="apellido_materno"
              label="Apellido Materno"
              value={formValues.apellido_materno}
              onChange={handleChange}
              variant="outlined"
              helperText="Opcional"
              autoComplete='off'
              disabled={cargando}
            />

            {/* Rol */}
            <FormControl fullWidth error={!!errores.rol}>
                <TextField
                    select
                    required
                    id="rol"
                    name="rol"
                    label="Rol"
                    value={formValues.rol}
                    onChange={handleChange}
                    variant="outlined"
                    helperText={errores.rol}
                    error={!!errores.rol}
                    autoComplete='off'
                    disabled={cargando}
                >
                    <MenuItem value="chofer">Chofer</MenuItem>
                    <MenuItem value="cargador">Cargador</MenuItem>
                    <MenuItem value="auxiliar">Auxiliar</MenuItem>
                </TextField>
            </FormControl>

            {/* Tipo de Empleado */}
            <FormControl component="fieldset" fullWidth error={!!errores.tipo_empleado}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                    Tipo de Empleado *
                </FormLabel>
                <RadioGroup 
                    row 
                    name="tipo_empleado" 
                    value={formValues.tipo_empleado}
                    onChange={handleChange}
                >
                    <FormControlLabel 
                    value="interno" 
                    control={<Radio />} 
                    label="Interno"
                    disabled={cargando}
                    />
                    <FormControlLabel 
                    value="subcontratado" 
                    control={<Radio />} 
                    label="Subcontratado"
                    disabled={cargando}
                    />
                </RadioGroup>
                {errores.tipo_empleado && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errores.tipo_empleado}
                    </Typography>
                )}
            </FormControl>

            {/* Botones */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                startIcon={<CancelIcon />}
                sx={{ minWidth: 120 }}
                onClick={handleCancelar}
                disabled={cargando}
              >
                {esEdicion ? 'Cancelar edición' : 'Cancelar'}
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                startIcon={cargando ? <CircularProgress size={20} /> : (esEdicion ? <EditIcon /> : <PersonAddIcon />)}
                sx={{ minWidth: 120 }}
                disabled={cargando}
              >
                {cargando ? 'Guardando...' : (esEdicion ? 'Actualizar' : 'Guardar')}
              </Button>
            </Stack>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EmpleadosForm;