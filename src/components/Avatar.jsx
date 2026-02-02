import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '../constants/theme';

/**
 * Avatar Component
 * Displays user avatar with optional edit functionality
 * 
 * @param {string} imageUri - URI of the avatar image
 * @param {string} name - User name for fallback initial
 * @param {number} size - Avatar size (default: 100)
 * @param {boolean} editable - Whether the avatar is editable
 * @param {function} onPress - Callback when avatar is pressed
 * @param {boolean} isLoading - Loading state
 * @param {string} borderColor - Optional border color
 * @param {number} borderWidth - Optional border width
 */
const Avatar = ({ 
  imageUri, 
  name = 'U', 
  size = 100, 
  editable = false, 
  onPress,
  isLoading = false,
  borderColor = null,
  borderWidth = 0
}) => {
  const radius = size / 2;
  const fontSize = size * 0.4;
  const badgeSize = size * 0.3;

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: radius,
    ...(borderColor && borderWidth ? {
      borderColor: borderColor,
      borderWidth: borderWidth
    } : {})
  };

  const content = (
    <View style={[styles.container, { marginBottom: editable ? 16 : 0 }]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={avatarStyle} />
      ) : (
        <View style={[styles.placeholder, avatarStyle, { backgroundColor: COLORS.primary }]}>
          <Text style={[styles.placeholderText, { fontSize, color: COLORS.white }]}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      
      {editable && (
        <View style={[styles.editBadge, { 
          width: badgeSize, 
          height: badgeSize, 
          borderRadius: badgeSize / 2,
          backgroundColor: COLORS.primary,
          borderColor: COLORS.white 
        }]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={[styles.editIcon, { fontSize: badgeSize * 0.5 }]}>📷</Text>
          )}
        </View>
      )}
    </View>
  );

  if (editable && !isLoading) {
    return (
      <TouchableOpacity onPress={onPress} disabled={!onPress || isLoading}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

Avatar.propTypes = {
  imageUri: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.number,
  editable: PropTypes.bool,
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  editIcon: {
    textAlign: 'center',
  },
});

export default Avatar;
