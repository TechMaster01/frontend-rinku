import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Card,
    CardContent,
    Divider,
    CircularProgress,
    Alert,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow
} from '@mui/material';
import { 
    Download as DownloadIcon,
    Calculate as CalculateIcon,
    Person as PersonIcon,
    DateRange as DateRangeIcon,
    AttachMoney as MoneyIcon
} from '@mui/icons-material';
import servicioEmpleados, { type IEmpleado } from '../../services/servicioEmpleados';
import servicioNomina, { type ICalcularNominaResponse } from '../../services/servicioNomina';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

interface GenerarNominaProps {
    onCalcular?: (nomina: ICalcularNominaResponse) => void;
}

const GenerarNomina = ({ onCalcular }: GenerarNominaProps) => {
    const [empleados, setEmpleados] = useState<IEmpleado[]>([]);
    const [cargandoEmpleados, setCargandoEmpleados] = useState(false);
    const [cargandoNomina, setCargandoNomina] = useState(false);
    const [generandoPDF, setGenerandoPDF] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nomina, setNomina] = useState<ICalcularNominaResponse | null>(null);

    // Obtener fecha actual
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1; // getMonth() devuelve 0-11

    const [formulario, setFormulario] = useState({
        empleado_id: '',
        año: añoActual.toString(),
        mes: mesActual.toString().padStart(2, '0')
    });

    // Opciones para los meses (limitadas según el año seleccionado)
    const todosMeses = [
        { value: '01', label: 'Enero' },
        { value: '02', label: 'Febrero' },
        { value: '03', label: 'Marzo' },
        { value: '04', label: 'Abril' },
        { value: '05', label: 'Mayo' },
        { value: '06', label: 'Junio' },
        { value: '07', label: 'Julio' },
        { value: '08', label: 'Agosto' },
        { value: '09', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' }
    ];

    // Filtrar meses según el año seleccionado
    const getMesesDisponibles = () => {
        const añoSeleccionado = parseInt(formulario.año);
        
        if (añoSeleccionado < añoActual) {
            // Para años anteriores, todos los meses están disponibles
            return todosMeses;
        } else if (añoSeleccionado === añoActual) {
            // Para el año actual, solo hasta el mes actual
            return todosMeses.filter((mes) => parseInt(mes.value) <= mesActual);
        } else {
            // Para años futuros, no hay meses disponibles
            return [];
        }
    };

    // Generar años (desde hace 5 años hasta el año actual)
    const generarAños = () => {
        const años = [];
        for (let i = añoActual - 5; i <= añoActual; i++) {
            años.push(i.toString());
        }
        return años;
    };

    const años = generarAños();
    const meses = getMesesDisponibles();

    // Cargar empleados al montar el componente
    useEffect(() => {
        cargarEmpleados();
    }, []);

    // Efecto para ajustar el mes cuando cambia el año
    useEffect(() => {
        const mesesDisponibles = getMesesDisponibles();
        const mesSeleccionado = parseInt(formulario.mes);
        
        // Si el mes seleccionado no está disponible para el año, seleccionar el último mes disponible
        if (mesesDisponibles.length > 0) {
            const mesValido = mesesDisponibles.find(m => parseInt(m.value) === mesSeleccionado);
            if (!mesValido) {
                const ultimoMesDisponible = mesesDisponibles[mesesDisponibles.length - 1];
                setFormulario(prev => ({
                    ...prev,
                    mes: ultimoMesDisponible.value
                }));
            }
        }
    }, [formulario.año]);

    const cargarEmpleados = async () => {
        try {
            setCargandoEmpleados(true);
            const empleadosData = await servicioEmpleados.obtenerEmpleados();
            setEmpleados(empleadosData);
            setError(null);
        } catch (error) {
            console.error('Error cargando empleados:', error);
            setError('Error al cargar la lista de empleados');
        } finally {
            setCargandoEmpleados(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormulario(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpiar nomina anterior cuando se cambie algún campo
        if (nomina) {
            setNomina(null);
        }
    };

    const calcularNomina = async () => {
        if (!formulario.empleado_id || !formulario.año || !formulario.mes) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor selecciona empleado, mes y año',
                icon: 'warning'
            });
            return;
        }

        // Validación adicional de fecha
        const añoSeleccionado = parseInt(formulario.año);
        const mesSeleccionado = parseInt(formulario.mes);
        
        if (añoSeleccionado > añoActual || (añoSeleccionado === añoActual && mesSeleccionado > mesActual)) {
            Swal.fire({
                title: 'Fecha inválida',
                text: 'No se pueden generar nóminas para fechas futuras',
                icon: 'error'
            });
            return;
        }

        try {
            setCargandoNomina(true);
            setError(null);

            const nominaResponse = await servicioNomina.calcularNomina(
                parseInt(formulario.empleado_id),
                parseInt(formulario.año),
                parseInt(formulario.mes)
            );

            setNomina(nominaResponse);
            
            if (onCalcular) {
                onCalcular(nominaResponse);
            }

            Swal.fire({
                title: 'Nómina calculada',
                text: 'La nómina se ha calculado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error: any) {
            console.error('Error calculando nómina:', error);
            const mensajeError = error.response?.data?.message || error.message || 'Error al calcular la nómina';
            setError(mensajeError);
            
            Swal.fire({
                title: 'Error',
                text: mensajeError,
                icon: 'error'
            });
        } finally {
            setCargandoNomina(false);
        }
    };

    const descargarPDF = async () => {
        if (!nomina) return;

        try {
            setGenerandoPDF(true);

            // Crear el PDF con texto puro
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const mesSeleccionado = meses.find(m => m.value === formulario.mes);
            let yPosition = 20;

            // Header del documento
            pdf.setFontSize(20);
            pdf.text('RECIBO DE NÓMINA', 105, yPosition, { align: 'center' });
            yPosition += 15;

            pdf.setFontSize(14);
            pdf.text(`Periodo: ${mesSeleccionado?.label} ${nomina["Periodo Nomina"].año}`, 105, yPosition, { align: 'center' });
            yPosition += 20;

            // Información del empleado
            pdf.setFontSize(12);
            pdf.text('INFORMACIÓN DEL EMPLEADO', 20, yPosition);
            yPosition += 8;

            pdf.setFontSize(10);
            pdf.text(`Número de Empleado: ${nomina.empleado.numero_empleado}`, 20, yPosition);
            yPosition += 6;
            
            pdf.text(`Nombre: ${nomina.empleado.nombres} ${nomina.empleado.apellido_paterno} ${nomina.empleado.apellido_materno || ''}`, 20, yPosition);
            yPosition += 6;
            
            pdf.text(`Rol: ${nomina.empleado.rol.charAt(0).toUpperCase() + nomina.empleado.rol.slice(1)}`, 20, yPosition);
            yPosition += 6;
            
            pdf.text(`Tipo: ${nomina.empleado.tipo_empleado.charAt(0).toUpperCase() + nomina.empleado.tipo_empleado.slice(1)}`, 20, yPosition);
            yPosition += 15;

            // Información del período
            pdf.setFontSize(12);
            pdf.text('INFORMACIÓN DEL PERÍODO', 20, yPosition);
            yPosition += 8;

            pdf.setFontSize(10);
            pdf.text(`Asistencias: ${nomina["Informacion Periodo"].Asistencias}`, 20, yPosition);
            yPosition += 6;
            
            pdf.text(`Horas Trabajadas: ${nomina["Informacion Periodo"]["Horas Trabajadas"]}`, 20, yPosition);
            yPosition += 6;
            
            pdf.text(`Entregas: ${nomina["Informacion Periodo"].Entregas}`, 20, yPosition);
            yPosition += 15;

            // Desglose de nómina
            pdf.setFontSize(12);
            pdf.text('DESGLOSE DE NÓMINA', 20, yPosition);
            yPosition += 8;

            // Función para formatear moneda
            const formatCurrency = (amount: number) => {
                return new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                }).format(amount);
            };

            pdf.setFontSize(10);
            
            // Conceptos de ingreso
            pdf.text('INGRESOS:', 20, yPosition);
            yPosition += 6;
            
            pdf.text(`Sueldo Base:`, 25, yPosition);
            pdf.text(`${formatCurrency(nomina.Nomina["Sueldo Base"])}`, 170, yPosition, { align: 'right' });
            yPosition += 6;
            
            pdf.text(`Bono por Cargo:`, 25, yPosition);
            pdf.text(`${formatCurrency(nomina.Nomina["Bono por cargo"])}`, 170, yPosition, { align: 'right' });
            yPosition += 6;
            
            if (nomina.Nomina["Bono por cobertura"] > 0) {
                pdf.text(`Bono por Cobertura:`, 25, yPosition);
                pdf.text(`${formatCurrency(nomina.Nomina["Bono por cobertura"])}`, 170, yPosition, { align: 'right' });
                yPosition += 6;
            }
            
            pdf.text(`Bono por Entregas:`, 25, yPosition);
            pdf.text(`${formatCurrency(nomina.Nomina["Bono por entregas"])}`, 170, yPosition, { align: 'right' });
            yPosition += 10;

            // Subtotal
            pdf.text('SUELDO BRUTO:', 20, yPosition);
            pdf.text(`${formatCurrency(nomina.Nomina["Sueldo Bruto"])}`, 170, yPosition, { align: 'right' });
            yPosition += 10;

            // Deducciones
            pdf.text('DEDUCCIONES:', 20, yPosition);
            yPosition += 6;
            
            pdf.text(`ISR:`, 25, yPosition);
            pdf.text(`${formatCurrency(nomina.Nomina["ISR"])}`, 170, yPosition, { align: 'right' });
            yPosition += 10;

            // Total neto
            pdf.setFontSize(12);
            pdf.text('SUELDO NETO:', 20, yPosition);
            pdf.text(`${formatCurrency(nomina.Nomina["Sueldo Neto"])}`, 170, yPosition, { align: 'right' });
            yPosition += 10;

            // Vales (si aplica)
            if (nomina.Nomina.Vales > 0) {
                pdf.setFontSize(10);
                pdf.text(`Vales de Despensa:`, 25, yPosition);
                pdf.text(`${formatCurrency(nomina.Nomina.Vales)}`, 170, yPosition, { align: 'right' });
                yPosition += 10;
            }

            // Footer
            yPosition += 20;
            pdf.setFontSize(8);
            pdf.text(`Generado el ${new Date().toLocaleDateString('es-MX')} a las ${new Date().toLocaleTimeString('es-MX')}`, 105, yPosition, { align: 'center' });

            // Generar nombre del archivo
            const nombreArchivo = `Nomina_${nomina.empleado.numero_empleado}_${formulario.año}${formulario.mes}.pdf`;
            
            // Descargar el PDF
            pdf.save(nombreArchivo);

            Swal.fire({
                title: 'PDF generado',
                text: 'El PDF se ha descargado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error generando PDF:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al generar el PDF. Inténtalo de nuevo.',
                icon: 'error'
            });
        } finally {
            setGenerandoPDF(false);
        }
    };

    const getRolChip = (rol: string) => {
        const rolConfig: Record<string, { color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning", label: string }> = {
            chofer: { color: 'primary', label: 'Chofer' },
            cargador: { color: 'secondary', label: 'Cargador' },
            auxiliar: { color: 'info', label: 'Auxiliar' }
        };

        const config = rolConfig[rol] || { color: 'default', label: rol };
        return <Chip size="small" color={config.color} label={config.label} />;
    };

    const getTipoEmpleadoChip = (tipo: string) => {
        const config = tipo === 'interno'
            ? { color: 'success' as const, label: 'Interno' }
            : { color: 'warning' as const, label: 'Subcontratado' };

        return <Chip size="small" color={config.color} label={config.label} />;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    const mesSeleccionado = meses.find(m => m.value === formulario.mes);

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, sm: 2, md: 3 } }}>
            {/* Formulario de selección */}
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                    <CalculateIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Calcular Nómina
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Selector de empleado */}
                <FormControl fullWidth required sx={{ mb: 3 }}>
                    <InputLabel id="empleado-label">Empleado</InputLabel>
                    <Select
                        labelId="empleado-label"
                        value={formulario.empleado_id}
                        label="Empleado"
                        onChange={(e) => handleInputChange('empleado_id', e.target.value)}
                        disabled={cargandoEmpleados || cargandoNomina}
                    >
                        {cargandoEmpleados ? (
                            <MenuItem disabled>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Cargando...
                            </MenuItem>
                        ) : (
                            empleados.map((empleado) => (
                                <MenuItem key={empleado.id} value={empleado.id.toString()}>
                                    #{empleado.numero_empleado} - {empleado.nombres} {empleado.apellido_paterno}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                {/* Selector de año */}
                <FormControl fullWidth required sx={{ mb: 3 }}>
                    <InputLabel id="año-label">Año</InputLabel>
                    <Select
                        labelId="año-label"
                        value={formulario.año}
                        label="Año"
                        onChange={(e) => handleInputChange('año', e.target.value)}
                        disabled={cargandoNomina}
                    >
                        {años.map((año) => (
                            <MenuItem key={año} value={año}>
                                {año}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Selector de mes */}
                <FormControl fullWidth required sx={{ mb: 3 }}>
                    <InputLabel id="mes-label">Mes</InputLabel>
                    <Select
                        labelId="mes-label"
                        value={formulario.mes}
                        label="Mes"
                        onChange={(e) => handleInputChange('mes', e.target.value)}
                        disabled={cargandoNomina || meses.length === 0}
                    >
                        {meses.length === 0 ? (
                            <MenuItem disabled>
                                No hay meses disponibles para este año
                            </MenuItem>
                        ) : (
                            meses.map((mes) => (
                                <MenuItem key={mes.value} value={mes.value}>
                                    {mes.label}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>

                {/* Botón de calcular */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={calcularNomina}
                        disabled={cargandoNomina || !formulario.empleado_id || !formulario.mes || !formulario.año || meses.length === 0}
                        startIcon={cargandoNomina ? <CircularProgress size={20} /> : <CalculateIcon />}
                        sx={{ minWidth: 200 }}
                    >
                        {cargandoNomina ? 'Calculando...' : 'Calcular Nómina'}
                    </Button>
                </Box>
            </Paper>

            {/* Resultados de la nómina */}
            {nomina && (
                <Box>
                    {/* Información del empleado y periodo */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon color="primary" />
                                    Información del Empleado
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <strong>#{nomina.empleado.numero_empleado}</strong> - {nomina.empleado.nombres} {nomina.empleado.apellido_paterno} {nomina.empleado.apellido_materno || ''}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    {getRolChip(nomina.empleado.rol)}
                                    {getTipoEmpleadoChip(nomina.empleado.tipo_empleado)}
                                </Stack>
                            </Box>
                            
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                                    <DateRangeIcon color="primary" />
                                    Periodo
                                </Typography>
                                <Typography variant="body1">
                                    {mesSeleccionado?.label} {nomina["Periodo Nomina"].año}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Información del periodo */}
                    <Card elevation={2} sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary">
                                Información del Periodo
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>Asistencias:</Typography>
                                    <Typography fontWeight="bold">{nomina["Informacion Periodo"].Asistencias}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>Horas Trabajadas:</Typography>
                                    <Typography fontWeight="bold">{nomina["Informacion Periodo"]["Horas Trabajadas"]}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>Entregas:</Typography>
                                    <Typography fontWeight="bold">{nomina["Informacion Periodo"].Entregas}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Desglose de la nómina */}
                    <Card elevation={2} sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MoneyIcon />
                                Desglose de Nómina
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                                
                            <TableContainer>
                                <Table size="small">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><Typography fontWeight="medium">Sueldo Base</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" color="success.main">
                                                    {formatCurrency(nomina.Nomina["Sueldo Base"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Typography fontWeight="medium">Bono por Cargo</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" color="info.main">
                                                    {formatCurrency(nomina.Nomina["Bono por cargo"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Typography fontWeight="medium">Bono por Cobertura</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" color="info.main">
                                                    {formatCurrency(nomina.Nomina["Bono por cobertura"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Typography fontWeight="medium">Bono por Entregas</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" color="info.main">
                                                    {formatCurrency(nomina.Nomina["Bono por entregas"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {nomina.Nomina.Vales > 0 && (
                                            <TableRow>
                                                <TableCell><Typography fontWeight="medium">Vales</Typography></TableCell>
                                                <TableCell align="right">
                                                    <Typography fontWeight="bold" color="warning.main">
                                                        {formatCurrency(nomina.Nomina.Vales)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell colSpan={2}><Divider /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Typography fontWeight="bold">Sueldo Bruto</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" variant="h6" color="primary">
                                                    {formatCurrency(nomina.Nomina["Sueldo Bruto"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell><Typography fontWeight="medium" color="error">ISR</Typography></TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" color="error.main">
                                                    -{formatCurrency(nomina.Nomina["ISR"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: 'success.light' }}>
                                            <TableCell>
                                                <Typography fontWeight="bold" variant="h6">Sueldo Neto</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography fontWeight="bold" variant="h6" color="success.dark">
                                                    {formatCurrency(nomina.Nomina["Sueldo Neto"])}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>

                    {/* Botón de descarga */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            startIcon={generandoPDF ? <CircularProgress size={20} /> : <DownloadIcon />}
                            onClick={descargarPDF}
                            disabled={generandoPDF}
                            sx={{ minWidth: 200 }}
                        >
                            {generandoPDF ? 'Generando PDF...' : 'Descargar PDF'}
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default GenerarNomina;