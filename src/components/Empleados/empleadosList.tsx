import { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import type { IEmpleado } from '../../services/servicioEmpleados';

// Props del componente
interface EmpleadosListProps {
  empleados: IEmpleado[];
  cargando: boolean;
  onEliminar: (id: number) => void;
  onEditar?: (empleado: IEmpleado) => void;
  onVer?: (empleado: IEmpleado) => void;
}

// Función para mapear rol a un chip con color
const getRolChip = (rol: string) => {
  const rolConfig: Record<string, { color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning", label: string }> = {
    chofer: { color: 'primary', label: 'Chofer' },
    cargador: { color: 'secondary', label: 'Cargador' },
    auxiliar: { color: 'info', label: 'Auxiliar' }
  };

  const config = rolConfig[rol] || { color: 'default', label: rol };
  return <Chip size="small" color={config.color} label={config.label} />;
};

// Función para mapear tipo de empleado a un chip con color
const getTipoEmpleadoChip = (tipo: string) => {
  const config = tipo === 'interno'
    ? { color: 'success' as const, label: 'Interno' }
    : { color: 'warning' as const, label: 'Subcontratado' };

  return <Chip size="small" color={config.color} label={config.label} />;
};

const EmpleadosList = ({ empleados, cargando, onEliminar, onEditar, onVer }: EmpleadosListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtrar empleados según la búsqueda
  const filteredEmpleados = empleados.filter(empleado => {
    const searchLower = search.toLowerCase();
    const nombreCompleto = `${empleado.nombres} ${empleado.apellido_paterno} ${empleado.apellido_materno || ''}`.toLowerCase();
    
    return nombreCompleto.includes(searchLower) || 
           empleado.numero_empleado.toString().includes(searchLower) ||
           empleado.rol.includes(searchLower) ||
           empleado.tipo_empleado.includes(searchLower);
  });

  // Página actual de datos
  const currentEmpleados = filteredEmpleados
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Mostrar loading mientras se cargan los datos
  if (cargando && empleados.length === 0) {
    return (
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando empleados...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Listado de Empleados ({empleados.length})
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar empleado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, maxWidth: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer>
        <Table aria-label="tabla de empleados">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombres</TableCell>
              {!isMobile && <TableCell>Apellidos</TableCell>}
              <TableCell align="center">Rol</TableCell>
              {!isMobile && <TableCell align="center">Tipo</TableCell>}
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEmpleados.length > 0 ? (
              currentEmpleados.map((empleado) => (
                <TableRow key={empleado.id} hover>
                  <TableCell>{empleado.numero_empleado}</TableCell>
                  <TableCell>{empleado.nombres}</TableCell>
                  {!isMobile && (
                    <TableCell>
                      {empleado.apellido_paterno} {empleado.apellido_materno || ''}
                    </TableCell>
                  )}
                  <TableCell align="center">
                    {getRolChip(empleado.rol)}
                  </TableCell>
                  {!isMobile && (
                    <TableCell align="center">
                      {getTipoEmpleadoChip(empleado.tipo_empleado)}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {onVer && (
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small" 
                            color="info"
                            onClick={() => onVer(empleado)}
                            disabled={cargando}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEditar && (
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => onEditar(empleado)}
                            disabled={cargando}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => onEliminar(empleado.id)}
                          disabled={cargando}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    {search ? 'No se encontraron empleados con ese término de búsqueda' : 'No hay empleados registrados'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredEmpleados.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
      />
    </Paper>
  );
};

export default EmpleadosList;