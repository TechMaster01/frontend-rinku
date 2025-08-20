import {
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    CircularProgress,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { IParametroNomina } from '../../services/servicioParametrosNomina';

interface ParametrosNominaListProps {
    parametros: IParametroNomina | null;
    cargando: boolean;
    onEditar: (parametros: IParametroNomina) => void;
}

const ParametrosNominaList = ({ parametros, cargando, onEditar }: ParametrosNominaListProps) => {
    if (cargando) {
        return (
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Cargando parámetros de nómina...
                </Typography>
            </Paper>
        );
    }

    if (!parametros) {
        return (
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    No se encontraron parámetros de nómina configurados
                </Typography>
            </Paper>
        );
    }

    const formatearMoneda = (valor: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(valor);
    };

    const formatearPorcentaje = (valor: number) => {
        return `${(valor * 100).toFixed(2)}%`;
    };

    return (
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2">
                    Parámetros de Nómina Actuales
                </Typography>
                <Tooltip title="Editar parámetros">
                    <IconButton 
                        color="primary" 
                        onClick={() => onEditar(parametros)}
                        sx={{ 
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' }
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={3}>
                <Card elevation={2}>
                    <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                            ⏰ Configuración de Turno
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body1">Horas por turno:</Typography>
                            <Chip label={`${parametros.turno_hora} horas`} color="info" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">Pago por hora:</Typography>
                            <Chip label={formatearMoneda(parametros.pago_hora)} color="success" />
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={2}>
                    <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                            💰 Bonos por Rol
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1">Bono Chofer:</Typography>
                            <Chip label={formatearMoneda(parametros.bono_chofer)} color="primary" size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body1">Bono Cargador:</Typography>
                            <Chip label={formatearMoneda(parametros.bono_cargador)} color="secondary" size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">Bono Auxiliar:</Typography>
                            <Chip label={formatearMoneda(parametros.bono_auxiliar)} color="info" size="small" />
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={2}>
                    <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                            🎁 Bonos Adicionales
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">Bono por entrega:</Typography>
                            <Chip label={formatearMoneda(parametros.bono_entrega)} color="warning" />
                        </Box>
                    </CardContent>
                </Card>

                <Card elevation={2}>
                    <CardContent>
                        <Typography variant="h6" color="primary" gutterBottom>
                            📊 Descuentos
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">Vales (% del salario):</Typography>
                            <Chip label={formatearPorcentaje(parametros.vales)} color="error" />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Box sx={{ mt: 3, p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Última actualización:</strong> {
                        parametros.updated_at 
                            ? new Date(parametros.updated_at).toLocaleString('es-MX')
                            : 'No disponible'
                    }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    💡 <em>Estos parámetros se aplican a todos los cálculos de nómina del sistema</em>
                </Typography>
            </Box>
        </Paper>
    );
};

export default ParametrosNominaList;