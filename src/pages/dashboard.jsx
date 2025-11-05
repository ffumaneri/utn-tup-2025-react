import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function DashboardPage() {
  const { user, logout, fetchProtectedData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cargar datos protegidos al montar el componente
  useEffect(() => {
    const loadProtectedData = async () => {
      setLoading(true);
      setError(null);
      
      const result = await fetchProtectedData();
      
      if (result.success) {
        setProtectedData(result.data);
      } else {
        setError(result.error);
      }
      
      setLoading(false);
    };

    if (isAuthenticated) {
      loadProtectedData();
    }
  }, [isAuthenticated, fetchProtectedData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReloadData = async () => {
    setLoading(true);
    setError(null);
    
    const result = await fetchProtectedData();
    
    if (result.success) {
      setProtectedData(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (loading && !protectedData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos protegidos...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header con información del usuario */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={protectedData?.userProfile?.avatar}
              sx={{ width: 64, height: 64 }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Bienvenido, {protectedData?.userProfile?.fullName || user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                {user?.roles?.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    color={role === 'admin' ? 'error' : 'primary'}
                    sx={{ mr: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Paper>

      {/* Alerta de error si existe */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Información de token */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: 'success.light' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <SecurityIcon sx={{ fontSize: 40, color: 'success.dark' }} />
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" color="success.dark">
              🔒 Endpoint Protegido Accedido Exitosamente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Los siguientes datos fueron obtenidos usando el Bearer Token
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleReloadData}
            disabled={loading}
          >
            Recargar Datos
          </Button>
        </Box>
      </Paper>

      {protectedData && (
        <>
          {/* Estadísticas */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6">Usuarios</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {protectedData.stats?.totalUsers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total en el sistema
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <DataUsageIcon color="info" />
                    <Typography variant="h6">Proyectos</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {protectedData.stats?.activeProjects}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Proyectos activos
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6">Tareas</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {protectedData.stats?.completedTasks}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tareas completadas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccessTimeIcon color="warning" />
                    <Typography variant="h6">Revisiones</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold">
                    {protectedData.stats?.pendingReviews}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pendientes de revisión
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Actividad reciente */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Actividad Reciente
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {protectedData.recentActivity?.map((activity, index) => (
                <ListItem key={activity.id} divider={index < protectedData.recentActivity.length - 1}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={
                      <>
                        {new Date(activity.timestamp).toLocaleString('es-ES')}
                        {' - IP: '}
                        {activity.ip}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Información de permisos */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Permisos del Usuario
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box display="flex" gap={1} flexWrap="wrap">
              {protectedData.userProfile?.permissions?.map((permission) => (
                <Chip
                  key={permission}
                  label={permission.toUpperCase()}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default DashboardPage;

