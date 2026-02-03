import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants/theme';

/**
 * Reusable Loading component with different variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Loading variant: 'spinner', 'overlay', 'inline'
 * @param {string} props.size - Spinner size: 'small', 'large'
 * @param {string} props.color - Spinner color
 * @param {string} props.text - Loading text message
 * @param {boolean} props.fullScreen - Full screen overlay
 * @param {Object} props.style - Additional container styles
 */
const Loading = ({
  variant = 'spinner',
  size = 'large',
  color = COLORS.primary,
  text = '',
  fullScreen = false,
  style,
}) => {
  if (variant === 'overlay' || fullScreen) {
    return (
      <View style={[styles.overlay, fullScreen && styles.fullScreen, style]}>
        <View style={styles.overlayContent}>
          <ActivityIndicator size={size} color={color} />
          {text && <Text style={styles.overlayText}>{text}</Text>}
        </View>
      </View>
    );
  }

  if (variant === 'inline') {
    return (
      <View style={[styles.inline, style]}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.inlineText}>{text}</Text>}
      </View>
    );
  }

  // Default spinner variant
  return (
    <View style={[styles.spinner, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.spinnerText}>{text}</Text>}
    </View>
  );
};

Loading.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'overlay', 'inline']),
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  spinnerText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  fullScreen: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlayContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 120,
  },
  overlayText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.dark,
    fontWeight: FONT_WEIGHTS.medium,
    textAlign: 'center',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  inlineText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.regular,
  },
});

export default Loading;
