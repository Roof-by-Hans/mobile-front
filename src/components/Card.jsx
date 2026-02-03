import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Reusable Card component for displaying content in a card layout
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.header - Custom header component
 * @param {React.ReactNode} props.footer - Custom footer component
 * @param {Function} props.onPress - Press handler (makes card pressable)
 * @param {string} props.variant - Card variant: 'default', 'outlined', 'elevated'
 * @param {Object} props.style - Additional container styles
 * @param {Object} props.contentStyle - Additional content styles
 * @param {boolean} props.noPadding - Remove default padding
 */
const Card = ({
  children,
  title,
  subtitle,
  header,
  footer,
  onPress,
  variant = 'default',
  style,
  contentStyle,
  noPadding = false,
}) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.cardOutlined;
      case 'elevated':
        return styles.cardElevated;
      default:
        return styles.cardDefault;
    }
  };

  const cardContent = (
    <>
      {header && <View style={styles.headerContainer}>{header}</View>}
      
      {(title || subtitle) && (
        <View style={styles.titleContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      )}

      <View style={[styles.content, noPadding && styles.contentNoPadding, contentStyle]}>
        {children}
      </View>

      {footer && <View style={styles.footerContainer}>{footer}</View>}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          getCardStyle(),
          pressed && styles.cardPressed,
          style,
        ]}
        onPress={onPress}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {cardContent}
    </View>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  onPress: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated']),
  style: PropTypes.object,
  contentStyle: PropTypes.object,
  noPadding: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  cardDefault: {
    backgroundColor: COLORS.backgroundCard,
  },
  cardOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardElevated: {
    backgroundColor: COLORS.white,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.9,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  content: {
    padding: SPACING.md,
  },
  contentNoPadding: {
    padding: 0,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.md,
  },
});

export default Card;
