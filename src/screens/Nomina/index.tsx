import { Box, Typography, Divider } from "@mui/material";
import GenerarNomina from "../../components/Nomina/generarNomina";
import { type ICalcularNominaResponse } from "../../services/servicioNomina";

const NominaScreen = () => {
    const handleNominaCalculada = (nomina: ICalcularNominaResponse) => {
        console.log('Nómina calculada:', nomina);
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
                Nómina
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Gestión de nóminas - Calcula y genera los recibos de pago del personal
            </Typography>
            <Divider sx={{ my: 2 }} />

            <GenerarNomina onCalcular={handleNominaCalculada} />
        </Box>
    );
};

export default NominaScreen;