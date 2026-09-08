import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';
import { AcademicService } from '../../services/academicService';
import { StudentMyClassItem } from '../../types/academic';

export default function StudentKelasScreen() {
  useProtectedRoute(['STUDENT']);

  const [myClass, setMyClass] = useState<StudentMyClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await AcademicService.getStudentMyClass();
      setMyClass(res);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Kelas Saya" subtitle="Informasi Rombongan Belajar" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Memuat informasi kelas...</Text>
        </View>
      ) : !myClass ? (
        <View style={styles.emptyBox}>
          <Ionicons name="school-outline" size={54} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Belum Ditempatkan ke Kelas</Text>
          <Text style={styles.emptySub}>
            Akun Anda belum terdaftar pada kelas aktif tahun ajaran ini. Silakan hubungi bagian Tata Usaha / Admin Sekolah.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myClass.classmates || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.accent]} />
          }
          ListHeaderComponent={
            <View>
              {/* Card Banner Kelas Utama */}
              <Card style={styles.classBannerCard}>
                <View style={styles.bannerRow}>
                  <View style={styles.classIconBox}>
                    <Ionicons name="school" size={32} color="#FFFFFF" />
                  </View>
                  <View style={styles.bannerInfo}>
                    <Text style={styles.bannerLabel}>ROMBONGAN BELAJAR</Text>
                    <Text style={styles.bannerClassName}>Kelas {myClass.name}</Text>
                    <Text style={styles.bannerGrade}>
                      Tingkat {myClass.grade} • Tahun Ajaran {myClass.academicYear?.name || '-'}
                    </Text>
                  </View>
                </View>

                {/* Wali Kelas */}
                <View style={styles.waliBox}>
                  <Ionicons name="person-circle-outline" size={20} color={Colors.accent} />
                  <View style={styles.waliTexts}>
                    <Text style={styles.waliLabel}>Wali Kelas:</Text>
                    <Text style={styles.waliName}>
                      {myClass.homeroomTeacher ? myClass.homeroomTeacher.name : 'Belum Ditentukan'}
                    </Text>
                  </View>
                </View>
              </Card>

              {/* Mata Pelajaran Kelas */}
              {myClass.subjects && myClass.subjects.length > 0 && (
                <View style={styles.subjectsSection}>
                  <Text style={styles.sectionTitle}>
                    Mata Pelajaran ({myClass.subjects.length})
                  </Text>
                  <View style={styles.subjectsGrid}>
                    {myClass.subjects.map((sub) => (
                      <View key={sub.id} style={styles.subjectChip}>
                        <Ionicons name="book-outline" size={14} color={Colors.accent} />
                        <View style={styles.subjectChipInfo}>
                          <Text style={styles.subjectChipName}>{sub.subjectName}</Text>
                          <Text style={styles.subjectChipTeacher}>{sub.teacherName}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>
                Teman Sekelas ({myClass.totalClassmates} Siswa)
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Card style={[styles.classmateCard, item.isMe && styles.myCard]}>
              <View style={styles.classmateRow}>
                <View style={[styles.numberCircle, item.isMe && styles.myNumberCircle]}>
                  <Text style={[styles.numberText, item.isMe && styles.myNumberText]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.classmateInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.classmateName, item.isMe && styles.myName]}>
                      {item.name}
                    </Text>
                    {item.isMe && (
                      <View style={styles.meBadge}>
                        <Text style={styles.meBadgeText}>Saya</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.classmateMeta}>
                    NIS: {item.studentNumber} • NISN: {item.nisn}
                  </Text>
                </View>
              </View>
            </Card>
          )}
        />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  classBannerCard: {
    backgroundColor: '#0D9488',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 1,
  },
  bannerClassName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  bannerGrade: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  waliBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 14,
  },
  waliTexts: {
    marginLeft: 8,
    flex: 1,
  },
  waliLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  waliName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 1,
  },
  subjectsSection: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    width: '48%',
  },
  subjectChipInfo: {
    marginLeft: 6,
    flex: 1,
  },
  subjectChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  subjectChipTeacher: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  classmateCard: {
    padding: 12,
    marginBottom: 8,
  },
  myCard: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  classmateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  myNumberCircle: {
    backgroundColor: '#0D9488',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  myNumberText: {
    color: '#FFFFFF',
  },
  classmateInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classmateName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  myName: {
    fontWeight: '800',
    color: '#0D9488',
  },
  meBadge: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 8,
  },
  meBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  classmateMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
