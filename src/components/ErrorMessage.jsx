import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Reusable ErrorMessage component for displaying error messages
 * @param {Object} props - Component props
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {string} props.variant - Error variant: 'error', 'warning', 'info', 'success'
 * @param {boolean} props.dismissible - Show dismiss button
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {string} props.actionText - Action button text
 * @param {Function} props.onAction - Action button handler
 * @param {React.ReactNode} props.icon - Custom icon component
 * @param {Object} props.style - Additional container styles
 */
const ErrorMessage = ({
  title,
  message,
  variant = 'error',
  dismissible = false,
  onDismiss,
  actionText,
  onAction,
  icon,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: styles.containerWarning,
          title: styles.titleWarning,
          message: styles.messageWarning,
        };
      case 'info':
        return {
          container: styles.containerInfo,
          title: styles.titleInfo,
          message: styles.messageInfo,
        };
      case 'success':
        return {
          container: styles.containerSuccess,
          title: styles.titleSuccess,
          message: styles.messageSuccess,
        };
      default:
        return {
          container: styles.containerError,
          title: styles.titleError,
          message: styles.messageError,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <View style={[styles.container, variantStyles.container, style]}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <View style={styles.textContainer}>
          {title && <Text style={[styles.title, variantStyles.title]}>{title}</Text>}
          {message && <Text style={[styles.message, variantStyles.message]}>{message}</Text>}
        </View>

        {dismissible && (
          <Pressable style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissText}>✕</Text>
          </Pressable>
        )}
      </View>

      {actionText && onAction && (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={[styles.actionText, variantStyles.title]}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

ErrorMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  icon: PropTypes.node,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: SPACING.sm,
    paddingTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  dismissButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  dismissText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.gray,
  },
  actionButton: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    textAlign: 'center',
  },
  // Error variant
  containerError: {
    backgroundColor: '#FEE2E2',
    borderColor: COLORS.danger,
  },
  titleError: {
    color: COLORS.danger,
  },
  messageError: {
    color: '#991B1B',
  },
  // Warning variant
  containerWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: COLORS.warning,
  },
  titleWarning: {
    color: '#B45309',
  },
  messageWarning: {
    color: '#92400E',
  },
  // Info variant
  containerInfo: {
    backgroundColor: '#DBEAFE',
    borderColor: COLORS.info,
  },
  titleInfo: {
    color: '#1E40AF',
  },
  messageInfo: {
    color: '#1E3A8A',
  },
  // Success variant
  containerSuccess: {
    backgroundColor: '#D1FAE5',
    borderColor: COLORS.success,
  },
  titleSuccess: {
    color: COLORS.success,
  },
  messageSuccess: {
    color: '#065F46',
  },
});

export default ErrorMessage;
