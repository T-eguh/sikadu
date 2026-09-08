import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/colors';
import { formatRoleLabel } from '../utils/formatters';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showLogout = true }) => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return { bg: Colors.roles.adminLight, text: Colors.roles.admin };
      case 'TEACHER':
        return { bg: Colors.roles.teacherLight, text: Colors.roles.teacher };
      case 'STUDENT':
        return { bg: Colors.roles.studentLight, text: Colors.roles.student };
      default:
        return { bg: Colors.surface, text: Colors.textSecondary };
    }
  };

  const badgeColor = getRoleBadgeColor();

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
        )}
        <View style={styles.nameBlock}>
          <Text style={styles.greeting} numberOfLines={1}>
            {title || `Halo, ${user?.name || 'Pengguna'}`}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.roleBadge, { backgroundColor: badgeColor.bg }]}>
              <Text style={[styles.roleText, { color: badgeColor.text }]}>
                {formatRoleLabel(user?.role)}
              </Text>
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </View>

      {showLogout && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  nameBlock: {
    marginLeft: 12,
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
