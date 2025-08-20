import { useRoutes } from 'react-router-dom'
import { Box } from '@mui/material'
import HomeScreen from './screens/home'
import EmpleadoScreen from './screens/Empleados'
//import './App.css'
import AsistenciaScreen from './screens/Asistencias'
import NominaScreen from './screens/Nomina'

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
      path: "*",
      element: <HomeScreen />,
    }
  ];

  const routeElements = useRoutes(routes)
  
  return (
    <Box>
      {routeElements}
    </Box>
  )
}

export default App
