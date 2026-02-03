import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Reusable Button component
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Press handler
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'outline', 'danger', 'success'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.fullWidth - Full width button
 * @param {Object} props.style - Additional custom styles
 * @param {Object} props.textStyle - Additional text styles
 * @param {React.ReactNode} props.icon - Optional icon component
 */
const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false, 
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  icon
}) => {
  const getButtonStyle = () => {
    if (disabled) return styles.buttonDisabled;
    
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'outline':
        return styles.buttonOutline;
      case 'danger':
        return styles.buttonDanger;
      case 'success':
        return styles.buttonSuccess;
      default:
        return styles.buttonPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.buttonSmall;
      case 'large':
        return styles.buttonLarge;
      default:
        return styles.buttonMedium;
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text];
    
    if (variant === 'outline') {
      baseTextStyle.push(styles.textOutline);
    }
    
    if (size === 'small') {
      baseTextStyle.push(styles.textSmall);
    } else if (size === 'large') {
      baseTextStyle.push(styles.textLarge);
    }
    
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    
    return baseTextStyle;
  };

  const getLoadingColor = () => {
    if (variant === 'outline') return COLORS.primary;
    if (variant === 'danger') return COLORS.white;
    if (variant === 'success') return COLORS.white;
    return COLORS.white;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        !fullWidth && styles.buttonNotFullWidth,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getLoadingColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
  icon: PropTypes.node,
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  buttonMedium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 57,
    width: '100%',
  },
  buttonSmall: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 40,
    width: '100%',
  },
  buttonLarge: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minHeight: 64,
    width: '100%',
  },
  buttonNotFullWidth: {
    width: 'auto',
    alignSelf: 'flex-start',
  },
  buttonPrimary: {
    backgroundColor: COLORS.buttonBackground,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  textSmall: {
    fontSize: FONT_SIZES.sm,
  },
  textLarge: {
    fontSize: FONT_SIZES.lg,
  },
  textOutline: {
    color: COLORS.primary,
  },
});

export default Button;
