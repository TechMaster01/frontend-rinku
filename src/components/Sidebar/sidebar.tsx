import { useState } from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Home as HomeIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Ancho del sidebar
const drawerWidth = 240;

// Estructura para los items del menú
const menuItems = [
  { name: 'Inicio', icon: <HomeIcon />, path: '/' },
  { name: 'Empleados', icon: <PersonIcon />, path: '/empleados' },
  { name: 'Asistencias y entregas', icon: <CalendarIcon />, path: '/asistencias' },
  { name: 'Nómina', icon: <ReceiptIcon />, path: '/nomina' },
  { name: 'Parámetros de Nómina', icon: <MoneyIcon />, path: '/parametros-nomina' }
];

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Maneja la apertura/cierre del menú en móvil
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Contenido del sidebar
  const drawer = (
    <>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Nóminas Rinku
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? 'white' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Icono de hamburguesa para móvil */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="abrir menú"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1100 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar versión móvil (drawer temporal) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejora el rendimiento en móvil
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff'
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Sidebar versión desktop (drawer permanente) */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              borderRight: `1px solid ${theme.palette.divider}`
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;