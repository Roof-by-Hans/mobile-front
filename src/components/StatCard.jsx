import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

/**
 * Stat Card Component
 * Muestra una estadística con título y valor
 * @param {string} title - Título de la estadística
 * @param {string|number} value - Valor a mostrar
 * @param {string} subtitle - Subtítulo opcional
 */
const StatCard = ({ title, value, subtitle }) => {
  return (
    <View style={styles.card}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    alignItems: 'center'
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center'
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text.primary,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
    marginTop: SPACING.xs,
    fontWeight: '500'
  }
});

export default StatCard;
