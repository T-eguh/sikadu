import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';

export default function StudentTugasScreen() {
  useProtectedRoute(['STUDENT']);

  const dummyAssignments = [
    { id: '1', title: 'Latihan Soal Matriks & Vektor', subject: 'Matematika Wajib', deadline: 'Jumat, 23:59', status: 'Belum Selesai' },
    { id: '2', title: 'Analisis Paragraf Eksposisi', subject: 'Bahasa Indonesia', deadline: 'Senin Depan, 18:00', status: 'Sudah Dikumpul' },
  ];

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Tugas & Ujian" subtitle="Latihan Siswa" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tugas Mendatang</Text>

        {dummyAssignments.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Ionicons name="checkbox" size={22} color={Colors.warning} />
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubject}>{item.subject}</Text>
                <Text style={styles.cardDeadline}>Tenggat: {item.deadline}</Text>
              </View>
              <View
                style={[
                  styles.statusPill,
                  item.status === 'Sudah Dikumpul' ? styles.statusSubmitted : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === 'Sudah Dikumpul' ? styles.statusSubmittedText : styles.statusPendingText,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        <View style={styles.noticeBox}>
          <Ionicons name="time-outline" size={18} color={Colors.warning} />
          <Text style={styles.noticeText}>
            Fitur pengumpulan berkas, kuis timer online, dan penilaian otomatis dibuka pada Tahap 2 LMS.
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  cardSubject: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardDeadline: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '600',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusPendingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  statusSubmitted: {
    backgroundColor: Colors.successLight,
  },
  statusSubmittedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
});
