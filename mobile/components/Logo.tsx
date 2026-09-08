import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark' }) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  const containerSizes = {
    sm: 44,
    md: 72,
    lg: 96,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            width: containerSizes[size],
            height: containerSizes[size],
            borderRadius: containerSizes[size] / 3.5,
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.2)' : Colors.primary,
          },
        ]}
      >
        <Ionicons
          name="school"
          size={iconSizes[size]}
          color={isLight ? '#FFFFFF' : '#FFFFFF'}
        />
      </View>
      <Text
        style={[
          styles.title,
          size === 'sm' && styles.titleSm,
          size === 'lg' && styles.titleLg,
          { color: isLight ? '#FFFFFF' : Colors.text },
        ]}
      >
        SEKOLAH MODEL
      </Text>
      <Text
        style={[
          styles.subtitle,
          size === 'sm' && styles.subtitleSm,
          size === 'lg' && styles.subtitleLg,
          { color: isLight ? 'rgba(255, 255, 255, 0.8)' : Colors.textSecondary },
        ]}
      >
        Sistem Pembelajaran Digital
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
  titleSm: {
    fontSize: 16,
    letterSpacing: 0.5,
  },
  titleLg: {
    fontSize: 26,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitleSm: {
    fontSize: 11,
  },
  subtitleLg: {
    fontSize: 15,
  },
});
