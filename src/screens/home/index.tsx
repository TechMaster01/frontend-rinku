import { Box, Typography, Container } from "@mui/material"

const HomeScreen = () => {
  return (
    <Container maxWidth="lg" sx={{ height: '100%' }}>
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Centra verticalmente
          alignItems: 'center',     // Centra horizontalmente
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: '80%', md: '700px' },
            textAlign: 'center',
            width: '100%'
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
              fontWeight: 700,
              mb: { xs: 2, sm: 3 }
            }}
          >
            Nominas Rinku
          </Typography>
          
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' },
              fontWeight: 500,
              mb: { xs: 3, sm: 4 }
            }}
          >
            Página Principal
          </Typography>
          
          <Typography
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Bienvenido al sistema de Nóminas Rinku
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default HomeScreen;