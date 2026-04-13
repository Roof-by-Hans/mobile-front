import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
  StatusBar,
  Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import TransactionCard from '../components/TransactionCard';
import { Avatar, Loading, EmptyState } from '../components';
import { getClientPhotoUrl } from '../utils/helpers';

/**
 * Home Screen Component - Dashboard del Cliente
 * Muestra resumen de cuenta, actividad reciente y accesos rápidos
 * Basado en diseño de Figma: Home Mobile
 */
const HomeScreen = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const { cliente } = useAuth();
  const { 
    resumenCuenta, 
    actividadReciente, 
    perfilCliente, 
    isLoading, 
    error, 
    refrescar 
  } = useDashboard(cliente?.id);

  const formatCurrency = React.useCallback((amount) => {
    const value = Number(amount);
    const safeValue = Number.isFinite(value) ? value : 0;

    return `$${safeValue.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }, []);

  const tipoSuscripcionTexto = React.useMemo(() => {
    const rawValue = perfilCliente?.tipoSuscripcion?.tipo || perfilCliente?.tipoSuscripcion?.nombre || '';
    const safeValue = String(rawValue).trim();

    if (!safeValue) {
      return '';
    }

    return safeValue
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }, [perfilCliente?.tipoSuscripcion?.tipo, perfilCliente?.tipoSuscripcion?.nombre]);

  const esSuscripcionCredito = tipoSuscripcionTexto === 'CREDITO';
  const limiteTotal = Number.isFinite(Number(resumenCuenta?.limiteTotal)) ? Number(resumenCuenta?.limiteTotal) : 0;
  const consumidoMes = Number.isFinite(Number(resumenCuenta?.consumidoMes)) ? Number(resumenCuenta?.consumidoMes) : 0;
  const limiteRestante = Number.isFinite(Number(resumenCuenta?.limiteRestante))
    ? Number(resumenCuenta?.limiteRestante)
    : 0;
  const saldoDisponible = Number.isFinite(Number(resumenCuenta?.saldoActual)) ? Number(resumenCuenta?.saldoActual) : 0;
  const hasFocusedOnceRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (hasFocusedOnceRef.current) {
        refrescar();
      } else {
        hasFocusedOnceRef.current = true;
      }
    }, [refrescar])
  );

  const subtitleSaldoDisponible = React.useMemo(() => {
    const mesActual = new Date().getMonth();
    const movimientosMesActual = actividadReciente?.filter(mov => {
      const fechaMov = new Date(mov.fecha || mov.createdAt);
      return fechaMov.getMonth() === mesActual;
    }).length || 0;

    return movimientosMesActual > 0
      ? `${movimientosMesActual} movimientos este mes`
      : 'Sin movimientos este mes';
  }, [actividadReciente]);

  const balanceResponsive = React.useMemo(() => {
    // Clamp por ancho para evitar recortes en pantallas chicas sin alterar el look general.
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const contentWidth = Math.max(windowWidth - SPACING.lg * 2, 280);
    const isCompact = windowWidth <= 375;

    return {
      cardHeight: clamp(Math.round(contentWidth * 0.58), 184, 210),
      cardHorizontalPadding: clamp(Math.round(contentWidth * 0.1), 18, SPACING.xl),
      cardVerticalPadding: isCompact ? 14 : SPACING.lg,
      amountFontSize: clamp(Math.round(contentWidth * 0.14), 40, 52),
      amountLineHeight: clamp(Math.round(contentWidth * 0.145), 42, 54),
      amountMaxWidth: isCompact ? '96%' : '92%'
    };
  }, [windowWidth]);

  const responsiveStyles = React.useMemo(() => {
    return StyleSheet.create({
      balanceCard: {
        height: balanceResponsive.cardHeight,
        paddingHorizontal: balanceResponsive.cardHorizontalPadding,
        paddingVertical: balanceResponsive.cardVerticalPadding
      },
      balanceAmount: {
        fontSize: balanceResponsive.amountFontSize,
        lineHeight: balanceResponsive.amountLineHeight,
        maxWidth: balanceResponsive.amountMaxWidth
      }
    });
  }, [balanceResponsive]);

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
          <View style={[styles.balanceCard, responsiveStyles.balanceCard, Platform.OS === 'android' && styles.balanceCardAndroid]}>
            <Text style={styles.balanceLabel}>
              {esSuscripcionCredito ? 'LIMITE RESTANTE' : 'SALDO DISPONIBLE'}
            </Text>
            <Text
              style={[styles.balanceAmount, responsiveStyles.balanceAmount]}
              adjustsFontSizeToFit
              minimumFontScale={0.82}
              numberOfLines={1}
            >
              {formatCurrency(esSuscripcionCredito ? limiteRestante : saldoDisponible)}
            </Text>

            {esSuscripcionCredito ? (
              <View style={styles.creditSummaryContainer}>
                <Text style={styles.balanceSubtitle}>
                  CONSUMIDO ESTE MES: {formatCurrency(consumidoMes)}
                </Text>
                <Text style={styles.creditLimitText}>
                  LIMITE TOTAL: {formatCurrency(limiteTotal)}
                </Text>
              </View>
            ) : (
              <Text style={styles.balanceSubtitle}>{subtitleSaldoDisponible}</Text>
            )}
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
              onPress={() => navigation.navigate('DetallesMovimiento', { movimiento: transaction })}
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadowGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 5
  },
  balanceCardAndroid: {
    // Android dibuja mal sombras de alto blur sobre fondos translucidos.
    elevation: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)'
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    textAlign: 'center'
  },
  balanceAmount: {
    fontWeight: '300',
    color: COLORS.text.primary,
    letterSpacing: -1.3,
    marginBottom: SPACING.lg,
    textAlign: 'center'
  },
  balanceSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: COLORS.text.muted,
    letterSpacing: 0.3,
    lineHeight: 16,
    textAlign: 'center'
  },
  creditSummaryContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm
  },
  creditLimitText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.secondary,
    letterSpacing: 0.8,
    lineHeight: 16,
    marginTop: SPACING.xs,
    textAlign: 'center'
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
