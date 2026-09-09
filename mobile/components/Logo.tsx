import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'dark', showTagline = true }) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 20,
    md: 36,
    lg: 48,
    xl: 60,
  };

  const containerSizes = {
    sm: 38,
    md: 64,
    lg: 84,
    xl: 104,
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            width: containerSizes[size],
            height: containerSizes[size],
            borderRadius: containerSizes[size] / 3.2,
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.18)' : Colors.primary,
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
          size === 'xl' && styles.titleXl,
          { color: isLight ? '#FFFFFF' : Colors.text },
        ]}
      >
        BISA
      </Text>
      <Text
        style={[
          styles.subtitle,
          size === 'sm' && styles.subtitleSm,
          size === 'lg' && styles.subtitleLg,
          size === 'xl' && styles.subtitleLg,
          { color: isLight ? '#E0F2FE' : Colors.primaryLight },
        ]}
      >
        Bisa Insani Smart Academy
      </Text>
      {showTagline && (
        <Text
          style={[
            styles.motto,
            size === 'sm' && styles.mottoSm,
            { color: isLight ? 'rgba(255, 255, 255, 0.85)' : Colors.textSecondary },
          ]}
        >
          PKBM Bina Insani • Hebat • Mandiri • Kreatif
        </Text>
      )}
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
    marginBottom: 10,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  titleSm: {
    fontSize: 18,
    letterSpacing: 1,
  },
  titleLg: {
    fontSize: 32,
    letterSpacing: 2.5,
  },
  titleXl: {
    fontSize: 40,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
  subtitleSm: {
    fontSize: 11,
  },
  subtitleLg: {
    fontSize: 16,
  },
  motto: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  mottoSm: {
    fontSize: 9,
  },
});

