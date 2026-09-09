import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Animated,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../theme';

// ==========================================
// 1. AppButton
// ==========================================
interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'google' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: Colors.secondary };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: Colors.borderDark,
        };
      case 'danger':
        return { backgroundColor: Colors.error };
      case 'google':
        return {
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: '#E2E8F0',
          ...Shadows.soft,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'primary':
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return Colors.primary;
      case 'google':
        return '#1F2937';
      default:
        return '#FFFFFF';
    }
  };

  const sizeStyles: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
    sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13 },
    md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 15 },
    lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 },
  };

  const currentSize = sizeStyles[size];

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.buttonBase,
          getButtonStyle(),
          {
            paddingVertical: currentSize.paddingVertical,
            paddingHorizontal: currentSize.paddingHorizontal,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <View style={styles.buttonContent}>
            {variant === 'google' && (
              <View style={styles.googleIconContainer}>
                {/* Official Google G visual icon */}
                <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 10 }} />
              </View>
            )}
            {icon && iconPosition === 'left' && variant !== 'google' && (
              <Ionicons name={icon} size={currentSize.fontSize + 2} color={getTextColor()} style={{ marginRight: 8 }} />
            )}
            <Text
              style={[
                styles.buttonText,
                {
                  color: getTextColor(),
                  fontSize: currentSize.fontSize,
                },
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons name={icon} size={currentSize.fontSize + 2} color={getTextColor()} style={{ marginLeft: 8 }} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ==========================================
// 2. AppInput
// ==========================================
interface AppInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  hint?: string;
  editable?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  icon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  hint,
  editable = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.inputGroup, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? Colors.primaryLight : Colors.textMuted}
            style={styles.inputLeftIcon}
          />
        )}
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

// ==========================================
// 3. AppCard
// ==========================================
interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outline' | 'gradient';
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
}) => {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'flat':
        return { backgroundColor: Colors.surfaceSubtle, borderWidth: 0 };
      case 'outline':
        return { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border };
      case 'elevated':
      default:
        return {
          backgroundColor: Colors.surface,
          ...Shadows.soft,
          borderWidth: 1,
          borderColor: Colors.border,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.cardBase, getCardStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.cardBase, getCardStyle(), style]}>{children}</View>;
};

// ==========================================
// 4. AppHeader
// ==========================================
interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  variant?: 'light' | 'dark';
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  variant = 'light',
}) => {
  const isDark = variant === 'dark';

  return (
    <View style={[styles.headerContainer, isDark && styles.headerDark]}>
      <View style={styles.headerRow}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.headerBackButton}>
            <Ionicons name="arrow-back" size={22} color={isDark ? '#FFFFFF' : Colors.text} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.headerSubtitle, isDark && styles.headerSubtitleDark]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        {rightAction && <View style={styles.headerRightAction}>{rightAction}</View>}
      </View>
    </View>
  );
};

// ==========================================
// 5. AppLoader (Branded Loader BISA)
// ==========================================
interface AppLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  message = 'Memuat...',
  fullScreen = false,
}) => {
  return (
    <View style={[styles.loaderContainer, fullScreen && styles.loaderFullScreen]}>
      <View style={styles.brandedLoaderCard}>
        <View style={styles.miniLogoBox}>
          <Ionicons name="school" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.miniLogoText}>BISA</Text>
        <ActivityIndicator size="small" color={Colors.primaryLight} style={{ marginVertical: 12 }} />
        <Text style={styles.loaderMessage}>{message}</Text>
      </View>
    </View>
  );
};

// ==========================================
// 6. AppEmptyState
// ==========================================
interface AppEmptyStateProps {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionText?: string;
  onAction?: () => void;
}

export const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  title,
  description,
  icon = 'file-tray-outline',
  actionText,
  onAction,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name={icon} size={36} color={Colors.primaryLight} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {actionText && onAction && (
        <AppButton title={actionText} onPress={onAction} size="sm" style={{ marginTop: 16 }} />
      )}
    </View>
  );
};

// ==========================================
// 7. AppErrorState
// ==========================================
interface AppErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const AppErrorState: React.FC<AppErrorStateProps> = ({
  title = 'Terjadi Kesalahan',
  description = 'Koneksi atau proses mengalami gangguan. Silakan coba kembali.',
  onRetry,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconCircle, { backgroundColor: Colors.errorLight }]}>
        <Ionicons name="alert-circle-outline" size={36} color={Colors.error} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {onRetry && (
        <AppButton
          title="Coba Lagi"
          onPress={onRetry}
          icon="refresh-outline"
          variant="outline"
          size="sm"
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

// ==========================================
// 8. AppModal
// ==========================================
interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

// ==========================================
// 9. StatusBadge
// ==========================================
interface StatusBadgeProps {
  status: string;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getBadgeStyle = () => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
        return { bg: Colors.successLight, text: Colors.success, label: label || 'Aktif' };
      case 'PENDING':
      case 'PENDING_REVIEW':
        return { bg: Colors.amberLight, text: Colors.amber, label: label || 'Menunggu' };
      case 'DRAFT':
        return { bg: Colors.surfaceSubtle, text: Colors.textSecondary, label: label || 'Draft' };
      case 'INACTIVE':
      case 'ARCHIVED':
        return { bg: Colors.errorLight, text: Colors.error, label: label || 'Nonaktif' };
      case 'REJECTED':
        return { bg: Colors.errorLight, text: Colors.error, label: label || 'Ditolak' };
      default:
        return { bg: Colors.surfaceSubtle, text: Colors.textSecondary, label: label || status };
    }
  };

  const badge = getBadgeStyle();

  return (
    <View style={[styles.badgeContainer, { backgroundColor: badge.bg }]}>
      <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
    </View>
  );
};

// ==========================================
// 10. SearchInput
// ==========================================
interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Cari...',
  onClear,
}) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
        >
          <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ==========================================
// 11. SectionHeader
// ==========================================
interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.sectionHeaderLeft}>
        {icon && <Ionicons name={icon} size={18} color={Colors.primary} style={{ marginRight: 6 }} />}
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
      {actionText && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.sectionHeaderAction}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ==========================================
// 12. Avatar
// ==========================================
interface AvatarProps {
  name: string;
  url?: string | null;
  size?: number;
  role?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  url,
  size = 44,
  role,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const getBgColor = () => {
    if (role === 'ADMIN') return Colors.roles.admin;
    if (role === 'TEACHER') return Colors.roles.teacher;
    if (role === 'STUDENT') return Colors.roles.student;
    return Colors.primary;
  };

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: getBgColor(),
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: size * 0.38 }}>
        {initials || '?'}
      </Text>
    </View>
  );
};

// ==========================================
// 13. ProgressBar
// ==========================================
interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  height?: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.accent,
  height = 8,
  showText = false,
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View style={{ width: '100%' }}>
      {showText && (
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>Progres Belajar</Text>
          <Text style={styles.progressPercent}>{Math.round(clampedProgress)}%</Text>
        </View>
      )}
      <View style={[styles.progressTrack, { height }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${clampedProgress}%`, backgroundColor: color, height },
          ]}
        />
      </View>
    </View>
  );
};

// ==========================================
// 14. SkeletonLoader
// ==========================================
interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 6,
  style,
}) => {
  const [opacity] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ==========================================
// 15. Toast
// ==========================================
interface ToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  onDismiss,
}) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getBg = () => {
    if (type === 'error') return Colors.error;
    if (type === 'info') return Colors.primaryLight;
    return Colors.accent;
  };

  const getIcon = () => {
    if (type === 'error') return 'alert-circle';
    if (type === 'info') return 'information-circle';
    return 'checkmark-circle';
  };

  return (
    <View style={[styles.toastContainer, { backgroundColor: getBg() }]}>
      <Ionicons name={getIcon()} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
};

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  // Button
  buttonBase: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  googleIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Input
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    height: 48,
  },
  inputFocused: {
    borderColor: Colors.primaryLight,
    backgroundColor: '#FFFFFF',
    ...Shadows.soft,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputDisabled: {
    backgroundColor: Colors.surfaceSubtle,
    borderColor: Colors.border,
  },
  inputLeftIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  passwordToggle: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // Card
  cardBase: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  // Header
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerDark: {
    backgroundColor: Colors.primaryDark,
    borderBottomColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBackButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  headerSubtitleDark: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  headerRightAction: {
    marginLeft: 8,
  },

  // Loader
  loaderContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderFullScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  brandedLoaderCard: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    ...Shadows.medium,
    minWidth: 160,
  },
  miniLogoBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  miniLogoText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: Colors.primary,
  },
  loaderMessage: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  emptyDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 260,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 420,
    ...Shadows.elevated,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },

  // Badge
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },

  // Section Header
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionHeaderAction: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryLight,
  },

  // Progress
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  progressTrack: {
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: BorderRadius.full,
  },

  // Toast
  toastContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    ...Shadows.medium,
    zIndex: 999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
