import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../constants/theme';

/**
 * Reusable Input component with validation
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.secureTextEntry - Password input
 * @param {string} props.keyboardType - Keyboard type
 * @param {string} props.autoCapitalize - Auto capitalize option
 * @param {boolean} props.editable - Editable state
 * @param {string} props.error - Error message
 * @param {Function} props.onBlur - Blur handler
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  error = '',
  onBlur,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.inputPlaceholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        onBlur={onBlur}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  keyboardType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  editable: PropTypes.bool,
  error: PropTypes.string,
  onBlur: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.buttonText,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 16,
    fontSize: FONT_SIZES.md,
    color: COLORS.inputPlaceholder,
    fontWeight: FONT_WEIGHTS.regular,
    minHeight: 56,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.danger,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default Input;
