import {
    Paper,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    InputAdornment,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useEffect } from 'react';
import type { IParametroNomina, IActualizarParametrosNomina } from '../../services/servicioParametrosNomina';

interface ParametrosNominaFormProps {
    parametrosParaEditar: IParametroNomina | null;
    onUpdate: (id: number, data: IActualizarParametrosNomina) => Promise<void>;
    onCancelar: () => void;
    cargando?: boolean;
}

const ParametrosNominaForm = ({ 
    parametrosParaEditar, 
    onUpdate, 
    onCancelar, 
    cargando = false 
}: ParametrosNominaFormProps) => {
    
    const [formValues, setFormValues] = useState({
        turno_hora: '',
        pago_hora: '',
        bono_entrega: '',
        bono_chofer: '',
        bono_cargador: '',
        bono_auxiliar: '',
        vales: ''
    });

    const [errores, setErrores] = useState<Record<string, string>>({});
    
    useEffect(() => {
        if (parametrosParaEditar) {
            setFormValues({
                turno_hora: parametrosParaEditar.turno_hora.toString(),
                pago_hora: parametrosParaEditar.pago_hora.toString(),
                bono_entrega: parametrosParaEditar.bono_entrega.toString(),
                bono_chofer: parametrosParaEditar.bono_chofer.toString(),
                bono_cargador: parametrosParaEditar.bono_cargador.toString(),
                bono_auxiliar: parametrosParaEditar.bono_auxiliar.toString(),
                vales: parametrosParaEditar.vales.toString()
            });
        }
        setErrores({});
    }, [parametrosParaEditar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
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
        }
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: Record<string, string> = {};

        if (!formValues.turno_hora.trim()) {
            nuevosErrores.turno_hora = 'Las horas por turno son requeridas';
        } else if (parseFloat(formValues.turno_hora) <= 0) {
            nuevosErrores.turno_hora = 'Las horas por turno deben ser mayor a 0';
        } else if (parseFloat(formValues.turno_hora) > 24) {
            nuevosErrores.turno_hora = 'Las horas por turno no pueden ser más de 24';
        }

        if (!formValues.pago_hora.trim()) {
            nuevosErrores.pago_hora = 'El pago por hora es requerido';
        } else if (parseFloat(formValues.pago_hora) <= 0) {
            nuevosErrores.pago_hora = 'El pago por hora debe ser mayor a 0';
        }

        const validarBono = (campo: string, nombre: string) => {
            if (!formValues[campo as keyof typeof formValues].trim()) {
                nuevosErrores[campo] = `${nombre} es requerido`;
            } else if (parseFloat(formValues[campo as keyof typeof formValues]) < 0) {
                nuevosErrores[campo] = `${nombre} no puede ser negativo`;
            }
        };

        validarBono('bono_entrega', 'El bono por entrega');
        validarBono('bono_chofer', 'El bono de chofer');
        validarBono('bono_cargador', 'El bono de cargador');
        validarBono('bono_auxiliar', 'El bono de auxiliar');

        if (!formValues.vales.trim()) {
            nuevosErrores.vales = 'El porcentaje de vales es requerido';
        } else if (parseFloat(formValues.vales) < 0) {
            nuevosErrores.vales = 'El porcentaje de vales no puede ser negativo';
        } else if (parseFloat(formValues.vales) > 1) {
            nuevosErrores.vales = 'El porcentaje de vales no puede ser mayor a 1 (100%)';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validarFormulario() || !parametrosParaEditar) {
            return;
        }

        try {
            const datosParametros: IActualizarParametrosNomina = {
                turno_hora: parseFloat(formValues.turno_hora),
                pago_hora: parseFloat(formValues.pago_hora),
                bono_entrega: parseFloat(formValues.bono_entrega),
                bono_chofer: parseFloat(formValues.bono_chofer),
                bono_cargador: parseFloat(formValues.bono_cargador),
                bono_auxiliar: parseFloat(formValues.bono_auxiliar),
                vales: parseFloat(formValues.vales)
            };

            await onUpdate(parametrosParaEditar.id, datosParametros);
        } catch (error) {
            console.error('Error en el formulario:', error);
        }
    };

    const handleCancelar = () => {
        setErrores({});
        onCancelar();
    };

    if (!parametrosParaEditar) {
        return null;
    }

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, mx: 'auto', mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                ✏️ Editar Parámetros de Nómina
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                ⏰ Configuración de Turno
                            </Typography>
                            <Grid container spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Horas por turno"
                                        name="turno_hora"
                                        value={formValues.turno_hora}
                                        onChange={handleChange}
                                        error={!!errores.turno_hora}
                                        helperText={errores.turno_hora}
                                        type="number"
                                        inputProps={{ step: "0.5", min: "0", max: "24" }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">horas</InputAdornment>,
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Pago por hora"
                                        name="pago_hora"
                                        value={formValues.pago_hora}
                                        onChange={handleChange}
                                        error={!!errores.pago_hora}
                                        helperText={errores.pago_hora}
                                        type="number"
                                        inputProps={{ step: "0.01", min: "0" }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                💰 Bonos por Rol
                            </Typography>
                            <Grid container spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Bono Chofer"
                                    name="bono_chofer"
                                    value={formValues.bono_chofer}
                                    onChange={handleChange}
                                    error={!!errores.bono_chofer}
                                    helperText={errores.bono_chofer}
                                    type="number"
                                    inputProps={{ step: "0.01", min: "0" }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Bono Cargador"
                                    name="bono_cargador"
                                    value={formValues.bono_cargador}
                                    onChange={handleChange}
                                    error={!!errores.bono_cargador}
                                    helperText={errores.bono_cargador}
                                    type="number"
                                    inputProps={{ step: "0.01", min: "0" }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    label="Bono Auxiliar"
                                    name="bono_auxiliar"
                                    value={formValues.bono_auxiliar}
                                    onChange={handleChange}
                                    error={!!errores.bono_auxiliar}
                                    helperText={errores.bono_auxiliar}
                                    type="number"
                                    inputProps={{ step: "0.01", min: "0" }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                🎁 Bonos y Descuentos
                            </Typography>
                            <Grid container spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Bono por entrega"
                                    name="bono_entrega"
                                    value={formValues.bono_entrega}
                                    onChange={handleChange}
                                    error={!!errores.bono_entrega}
                                    helperText={errores.bono_entrega}
                                    type="number"
                                    inputProps={{ step: "0.01", min: "0" }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Vales (% del salario)"
                                    name="vales"
                                    value={formValues.vales}
                                    onChange={handleChange}
                                    error={!!errores.vales}
                                    helperText={errores.vales || "Ingresa como decimal (ej: 0.04 para 4%)"}
                                    type="number"
                                    inputProps={{ step: "0.01", min: "0", max: "1" }}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={cargando}
                        sx={{ minWidth: 150 }}
                    >
                        {cargando ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelar}
                        disabled={cargando}
                        sx={{ minWidth: 150 }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default ParametrosNominaForm;