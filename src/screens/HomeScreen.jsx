import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import TransactionCard from '../components/TransactionCard';
import StatCard from '../components/StatCard';

/**
 * Home Screen Component - Dashboard del Cliente
 * Muestra resumen de cuenta, actividad reciente y accesos rápidos
 * Basado en diseño de Figma: Home Mobile
 */
const HomeScreen = ({ navigation }) => {
  const { cliente } = useAuth();
  const { 
    resumenCuenta, 
    actividadReciente, 
    perfilCliente, 
    isLoading, 
    error, 
    refrescar 
  } = useDashboard(cliente?.id);

  /**
   * Maneja errores mostrando mensaje sutil (no bloquear UI)
   */
  React.useEffect(() => {
    if (error && error !== 'El servidor está experimentando problemas. Mostrando datos limitados.') {
      // Solo mostrar alert para errores críticos
      Alert.alert('Error', error);
    } else if (error) {
      // Para errores leves, solo log en consola (ya mostrado)
      console.warn('Estado del dashboard:', error);
    }
  }, [error]);

  /**
   * Renderiza el header con avatar y nivel
   */
  const renderHeader = () => {
    const nombre = perfilCliente?.nombre || cliente?.nombre || cliente?.email || 'Usuario';
    const apellido = perfilCliente?.apellido || '';
    const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre;
    const nivel = perfilCliente?.nivelSuscripcion?.nombre || 'Básico';
    
    return (
      <View style={styles.header}>
        {/* Avatar circular */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {nombre.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Nombre y nivel */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {nombreCompleto}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badge}>
              {nivel}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Renderiza el estado de carga
   */
  if (isLoading && !resumenCuenta) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refrescar}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header con avatar y nivel */}
      {renderHeader()}

      {/* Límite de Cuenta / Saldo Disponible */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saldo disponible</Text>
        <StatCard
          title=""
          value={`$${(resumenCuenta?.saldoActual || 0).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
          subtitle={resumenCuenta?.totalMovimientos > 0 
            ? `${resumenCuenta.totalMovimientos} movimientos` 
            : 'Sin movimientos aún'}
        />
      </View>

      {/* Actividad Reciente */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <Pressable onPress={() => navigation.navigate('Movimientos')}>
            <Text style={styles.viewAllText}>Ver todo</Text>
          </Pressable>
        </View>

        {actividadReciente?.length > 0 ? (
          actividadReciente.map((transaction, index) => (
            <TransactionCard
              key={transaction.id || index}
              transaction={transaction}
              onPress={() => console.log('Ver detalles:', transaction.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay actividad reciente
            </Text>
          </View>
        )}
      </View>

      {/* Espacio inferior para el TabBar */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl
  },
  avatarContainer: {
    marginBottom: SPACING.md
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#374151',
    borderWidth: 4,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text.primary
  },
  userInfo: {
    alignItems: 'center'
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm
  },
  badgeContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    background: 'linear-gradient(90deg, rgba(28, 28, 28, 1) 7%, rgba(255, 215, 0, 1) 50%, rgba(28, 28, 28, 1) 93%)'
  },
  badge: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center'
  },
  section: {
    marginBottom: SPACING.xl
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm
  },
  viewAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: '#E0E2E1'
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary
  },
  bottomSpacer: {
    height: 100
  }
});

export default HomeScreen;
