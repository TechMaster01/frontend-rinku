import { useRoutes } from 'react-router-dom'
import { Box, CssBaseline, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import HomeScreen from './screens/home'
import EmpleadoScreen from './screens/Empleados'
import AsistenciaScreen from './screens/Asistencias'
import NominaScreen from './screens/Nomina'
import ParametrosNominaScreen from './screens/ParametrosNomina'
import Sidebar from './components/Sidebar/sidebar'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const routes = [
    {
      path: "/",
      element: <HomeScreen />,
    },
    {
      path: "/empleados",
      element: <EmpleadoScreen />,
    },
    {
      path: "/asistencias",
      element: <AsistenciaScreen />,
    },
    {
      path: "/nomina",
      element: <NominaScreen />,
    },
    {
      path: "/parametros-nomina",
      element: <ParametrosNominaScreen />,
    },
    {
      path: "*",
      element: <HomeScreen />,
    }
  ];

  const routeElements = useRoutes(routes);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar />
        
        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },
            width: { sm: `calc(100% - ${isMobile ? 0 : 240}px)` },
            overflow: 'auto',
          }}
        >
          {routeElements}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
