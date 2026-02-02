import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

/**
 * DetalleMovimientoScreen - Pantalla de detalle de un movimiento
 * Muestra información completa de una transacción individual
 */
const DetalleMovimientoScreen = ({ route, navigation }) => {
  const { movimiento } = route.params || {};

  if (!movimiento) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Movimiento no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const formatAmount = (amount, tipoMovimiento) => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    const tipo = tipoMovimiento?.nombre?.toLowerCase() || '';
    const isConsumo = tipo.includes('consumo');
    const sign = isConsumo ? '-' : '+';
    return `${sign}$${Math.abs(num).toFixed(2)}`;
  };

  const getAmountColor = (tipoMovimiento) => {
    const tipo = tipoMovimiento?.nombre?.toLowerCase() || '';
    // Consumo = rojo (gasto), Recarga = verde (ingreso)
    return tipo.includes('consumo') ? COLORS.danger : COLORS.success;
  };

  const getTipoMovimiento = () => {
    return movimiento.tipoMovimiento?.nombre || 'Movimiento';
  };

  const getEstadoFactura = () => {
    if (!movimiento.factura) return null;
    const estado = movimiento.factura.estado || 'PENDIENTE';
    const colorMap = {
      'PENDIENTE': '#F59E0B',
      'PAGADA': COLORS.success,
      'CANCELADA': COLORS.danger,
      'VENCIDA': '#EF4444'
    };
    return {
      texto: estado,
      color: colorMap[estado] || COLORS.text.secondary
    };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Detalle del Movimiento</Text>
        </View>

        {/* Monto Principal */}
        <View style={styles.montoContainer}>
          <Text style={styles.montoLabel}>Monto</Text>
          <Text style={[styles.montoValor, { color: getAmountColor(movimiento.tipoMovimiento) }]}>
            {formatAmount(movimiento.monto, movimiento.tipoMovimiento)}
          </Text>
        </View>

        {/* Información del Movimiento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>{getTipoMovimiento()}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha:</Text>
              <Text style={styles.infoValue}>{formatDate(movimiento.fecha)}</Text>
            </View>

            {movimiento.observaciones && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Observaciones:</Text>
                  <Text style={styles.infoValue}>{movimiento.observaciones}</Text>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID Movimiento:</Text>
              <Text style={styles.infoValue}>#{movimiento.id}</Text>
            </View>
          </View>
        </View>

        {/* Información de Factura */}
        {movimiento.factura && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Factura Asociada</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ID Factura:</Text>
                <Text style={styles.infoValue}>#{movimiento.factura.id}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total Factura:</Text>
                <Text style={styles.infoValue}>{formatAmount(movimiento.factura.total)}</Text>
              </View>

              {getEstadoFactura() && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado:</Text>
                    <View style={[styles.estadoBadge, { backgroundColor: getEstadoFactura().color + '20' }]}>
                      <Text style={[styles.estadoText, { color: getEstadoFactura().color }]}>
                        {getEstadoFactura().texto}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

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
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  titulo: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  montoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.xl,
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 16,
  },
  montoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  montoValor: {
    fontSize: 48,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 12,
    padding: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: SPACING.sm,
  },
  estadoBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  estadoText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.danger,
    textAlign: 'center',
  },
});

export default DetalleMovimientoScreen;
