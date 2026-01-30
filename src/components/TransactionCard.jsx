import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

/**
 * Transaction Card Component
 * Muestra información de una transacción/movimiento
 * @param {Object} transaction - Datos del movimiento
 * @param {Function} onPress - Callback al presionar la tarjeta
 */
const TransactionCard = ({ transaction, onPress }) => {
  const isPositive = transaction.monto > 0;
  const tipoDisplay = transaction.tipoMovimientoDetalle?.nombre || transaction.tipoMovimiento?.nombre || transaction.tipo || 'Movimiento';

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {/* Icono circular */}
        <View style={[
          styles.iconContainer,
          isPositive ? styles.iconPositive : styles.iconNegative
        ]}>
          <Text style={styles.iconText}>{isPositive ? '↑' : '↓'}</Text>
        </View>

        {/* Info de la transacción */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {tipoDisplay}
          </Text>
          <Text style={styles.date}>
            {new Date(transaction.fecha).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Text>
        </View>
      </View>

      {/* Monto */}
      <Text style={[
        styles.amount,
        isPositive ? styles.amountPositive : styles.amountNegative
      ]}>
        {isPositive ? '+' : '-'}${Math.abs(transaction.monto).toFixed(2)}
      </Text>
    </View>
  );
};

TransactionCard.propTypes = {
  transaction: PropTypes.shape({
    monto: PropTypes.number.isRequired,
    fecha: PropTypes.string.isRequired,
    tipoMovimientoDetalle: PropTypes.object,
    tipoMovimiento: PropTypes.object,
    tipo: PropTypes.string
  }).isRequired,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md
  },
  iconPositive: {
    backgroundColor: 'rgba(20, 83, 45, 0.5)'
  },
  iconNegative: {
    backgroundColor: 'rgba(127, 29, 29, 0.5)'
  },
  iconText: {
    fontSize: 24,
    color: COLORS.text.primary
  },
  infoContainer: {
    flex: 1
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary
  },
  amount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginLeft: SPACING.sm
  },
  amountPositive: {
    color: '#4ADE80'
  },
  amountNegative: {
    color: '#F87171'
  }
});

export default TransactionCard;
