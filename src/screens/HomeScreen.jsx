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
import { Avatar, Loading, ErrorMessage, EmptyState } from '../components';
import { getClientPhotoUrl } from '../utils/helpers';

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
   * Renderiza el header con avatar y nivel según diseño Figma
   */
  const renderHeader = () => {
    const nombre = perfilCliente?.nombre || cliente?.nombre || cliente?.email || 'Usuario';
    const apellido = perfilCliente?.apellido || '';
    const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre;
    const nivel = perfilCliente?.nivelSuscripcion?.nombre || 'Básico';
    
    return (
      <View style={styles.header}>
        {/* Nombre centrado */}
        <Text style={styles.userName}>
          {nombreCompleto}
        </Text>
        
        {/* Avatar circular con borde dorado y sombra */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <View style={styles.avatarBackground}>
              <Avatar
                imageUri={perfilCliente?.fotoPerfilUrl || getClientPhotoUrl(perfilCliente?.fotoPerfil)}
                name={nombre}
                size={84}
                editable={false}
                borderColor="transparent"
                borderWidth={0}
              />
            </View>
          </View>
        </View>

        {/* Badge de nivel */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badge}>
            {nivel.toUpperCase()}
          </Text>
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
        <Loading text="Cargando dashboard..." />
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
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>SALDO DISPONIBLE</Text>
            <Text style={styles.balanceAmount}>
          ${(resumenCuenta?.saldoActual || 0).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
            </Text>
            <Text style={styles.balanceSubtitle}>
          {(() => {
            const mesActual = new Date().getMonth();
            const movimientosMesActual = actividadReciente?.filter(mov => {
              const fechaMov = new Date(mov.fecha || mov.createdAt);
              return fechaMov.getMonth() === mesActual;
            }).length || 0;
            
            return movimientosMesActual > 0 
              ? `${movimientosMesActual} movimientos este mes` 
              : 'Sin movimientos este mes';
          })()}
            </Text>
          </View>
        </View>

        {/* Actividad Reciente */}
      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Actividad Reciente</Text>
          <Pressable onPress={() => navigation.navigate('Movimientos')}>
            <Text style={styles.viewAllText}>VER TODO</Text>
          </Pressable>
        </View>

        {actividadReciente?.length > 0 ? (
          actividadReciente.slice(0, 4).map((transaction, index) => (
            <TransactionCard
              key={transaction.id || index}
              transaction={transaction}
              onPress={() => console.log('Ver detalles:', transaction.id)}
            />
          ))
        ) : (
          <EmptyState
            title="Sin actividad"
            message="No hay movimientos recientes en tu cuenta"
            style={styles.emptyState}
          />
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
    paddingTop: 15,
    paddingBottom: 10
  },
  // Header Styles (según Figma)
  header: {
    alignItems: 'center',
    height: 179,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg
  },
  userName: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 28,
    marginBottom: SPACING.md
  },
  avatarContainer: {
    marginBottom: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.borderGlow,
    padding: 3,
    backgroundColor: 'transparent',
    shadowColor: COLORS.shadowGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8
  },
  avatarBackground: {
    width: 84,
    height: 84,
    borderRadius: 9999,
    backgroundColor: COLORS.backgroundAvatar,
    overflow: 'hidden'
  },
  badgeContainer: {
    paddingHorizontal: 21,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: COLORS.glassBg,
    borderWidth: 1,
    borderColor: COLORS.borderBadge,
    height: 29
  },
  badge: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 2,
    lineHeight: 15,
    textAlign: 'center'
  },
  // Balance Section Styles (según Figma)
  balanceSection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl
  },
  balanceCard: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 32,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: COLORS.shadowGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5,
    height: 210
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
    letterSpacing: 1.2,
    marginTop: 17,
    marginBottom: SPACING.md
  },
  balanceAmount: {
    fontSize: 52,
    fontWeight: '300',
    color: COLORS.text.primary,
    letterSpacing: -1.3,
    lineHeight: 52,
    marginBottom: SPACING.xl
  },
  balanceSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: COLORS.text.muted,
    letterSpacing: 0.3,
    lineHeight: 16
  },
  // Activity Section Styles (según Figma)
  activitySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
    height: 45
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.text.primary,
    letterSpacing: 0.45,
    lineHeight: 28
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
    letterSpacing: 0.3,
    lineHeight: 16
  },
  emptyState: {
    marginVertical: SPACING.md
  },
  bottomSpacer: {
    height: 100
  }
});

export default HomeScreen;
