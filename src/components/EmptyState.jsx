import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';
import Button from './Button';

/**
 * Reusable EmptyState component for displaying empty states
 * @param {Object} props - Component props
 * @param {string} props.title - Empty state title
 * @param {string} props.message - Empty state message
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.actionText - Action button text
 * @param {Function} props.onAction - Action button handler
 * @param {string} props.actionVariant - Button variant for action
 * @param {Object} props.style - Additional container styles
 */
const EmptyState = ({
  title = 'No hay datos',
  message = 'No se encontraron resultados',
  icon,
  actionText,
  onAction,
  actionVariant = 'primary',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <Text style={styles.title}>{title}</Text>
      
      {message && <Text style={styles.message}>{message}</Text>}
      
      {actionText && onAction && (
        <View style={styles.actionContainer}>
          <Button
            title={actionText}
            onPress={onAction}
            variant={actionVariant}
            size="medium"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.node,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  actionVariant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    minHeight: 300,
  },
  iconContainer: {
    marginBottom: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
    maxWidth: 300,
  },
  actionContainer: {
    marginTop: SPACING.md,
    width: '100%',
    maxWidth: 200,
  },
});

export default EmptyState;
