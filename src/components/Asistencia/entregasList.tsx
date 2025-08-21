import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { IEntrega } from '../../services/servicioEntregas';

interface EntregasListProps {
  entregas: IEntrega[];
  cargando: boolean;
  onEliminar: (id: number) => void;
  onEditar?: (entrega: IEntrega) => void;
}

const EntregasList = ({ entregas, cargando, onEliminar, onEditar }: EntregasListProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calcular página actual ajustada
  const totalPages = Math.max(0, Math.ceil(entregas.length / rowsPerPage));
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));

  // Efecto para ajustar la página cuando cambia el número de registros
  useEffect(() => {
    if (entregas.length > 0) {
      const maxPage = Math.ceil(entregas.length / rowsPerPage) - 1;
      if (page > maxPage) {
        setPage(maxPage);
      }
    } else {
      setPage(0);
    }
  }, [entregas.length, rowsPerPage, page]);

  const currentEntregas = entregas
    .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);

  // Función para formatear fecha correctamente
  const formatDate = (dateString: string) => {
    // Crear la fecha directamente desde el string sin conversión de zona horaria
    const dateParts = dateString.split('-');
    const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
    
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (cargando && entregas.length === 0) {
    return (
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Cargando entregas...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Listado de Entregas ({entregas.length})
        </Typography>
      </Box>

      <TableContainer>
        <Table aria-label="tabla de entregas">
          <TableHead>
            <TableRow>
              <TableCell>ID Empleado</TableCell>
              <TableCell>Fecha</TableCell>
              {!isMobile && <TableCell align="center">Cantidad</TableCell>}
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentEntregas.length > 0 ? (
              currentEntregas.map((entrega) => (
                <TableRow key={entrega.id} hover>
                  <TableCell>{entrega.empleado_id}</TableCell>
                  <TableCell>{formatDate(entrega.fecha)}</TableCell>
                  {!isMobile && (
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {entrega.cantidad_entregas}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {onEditar && (
                        <IconButton
                          size="small"
                          onClick={() => onEditar(entrega)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => onEliminar(entrega.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isMobile ? 3 : 4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay entregas registradas
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
        count={entregas.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
      />
    </Paper>
  );
};

export default EntregasList;