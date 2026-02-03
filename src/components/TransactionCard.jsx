import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

/**
 * Icono de flecha inclinada hacia arriba-derecha (Recarga)
 */
const ArrowUpRightIcon = ({ color }) => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M5 13L13 5M13 5H7M13 5V11"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Icono de flecha inclinada hacia abajo-izquierda (Consumo)
 */
const ArrowDownLeftIcon = ({ color }) => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M13 5L5 13M5 13H11M5 13V7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Transaction Card Component
 * Muestra información de una transacción/movimiento
 * @param {Object} transaction - Datos del movimiento
 * @param {Function} onPress - Callback al presionar la tarjeta
 */
const TransactionCard = ({ transaction, onPress }) => {
  const tipoDisplay = transaction.tipoMovimientoDetalle?.nombre || transaction.tipoMovimiento?.nombre || transaction.tipo || 'Movimiento';
  const tipo = tipoDisplay?.toLowerCase() || '';
  const isConsumo = tipo.includes('consumo');
  const isPositive = !isConsumo; // Consumo = negativo (gasto), Recarga = positivo (ingreso)

  const content = (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        {/* Icono circular */}
        <View style={[
          styles.iconContainer,
          isPositive ? styles.iconPositive : styles.iconNegative
        ]}>
          {isPositive ? (
            <ArrowUpRightIcon color={COLORS.text.icon} />
          ) : (
            <ArrowDownLeftIcon color={COLORS.text.icon} />
          )}
        </View>

        {/* Info de la transacción */}
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {tipoDisplay}
          </Text>
          <Text style={styles.date}>
            {new Date(transaction.fecha).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long'
            })}
          </Text>
        </View>
      </View>

      {/* Monto */}
      <Text style={[
        styles.amount,
        isPositive ? styles.amountPositive : styles.amountNegative
      ]}>
        {isConsumo ? '-' : '+'}${Math.abs(transaction.monto).toFixed(2)}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
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
    backgroundColor: 'transparent',
    paddingVertical: 20.25,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderRadius: 8,
    height: 81.5,
    marginBottom: 0
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 20,
    backgroundColor: 'transparent'
  },
  iconPositive: {
    backgroundColor: 'transparent'
  },
  iconNegative: {
    backgroundColor: 'transparent'
  },
  infoContainer: {
    flex: 1
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    letterSpacing: 0.35,
    lineHeight: 20,
    textTransform: 'uppercase',
    marginBottom: 4
  },
  date: {
    fontSize: 11,
    fontWeight: '300',
    color: COLORS.gray,
    lineHeight: 16.5
  },
  amount: {
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.35,
    lineHeight: 20,
    marginLeft: SPACING.sm
  },
  amountPositive: {
    color: COLORS.success
  },
  amountNegative: {
    color: COLORS.text.primary
  }
});

export default TransactionCard;
