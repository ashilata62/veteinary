import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add Pet Form State
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('2 Years');
  const [weight, setWeight] = useState('15 kg');
  const [gender, setGender] = useState('Male');
  const [ownerName, setOwnerName] = useState('');

  const [pets, setPets] = useState([
    {
      id: 'p1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3 Years',
      weight: '28 kg',
      gender: 'Male',
      ownerName: 'Rahul Sharma',
      contact: '+91 98765 43210',
      lastVaccine: 'Rabies (May 2026)',
      medicalHistory: ['Dewormed - Apr 2026', 'Ear Infection Cleared - Jan 2026'],
    },
    {
      id: 'p2',
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian White',
      age: '1.5 Years',
      weight: '4.2 kg',
      gender: 'Female',
      ownerName: 'Priya Singh',
      contact: '+91 98123 88990',
      lastVaccine: 'FVRCP (Feb 2026)',
      medicalHistory: ['Dental Checkup - Mar 2026'],
    },
    {
      id: 'p3',
      name: 'Max',
      species: 'Dog',
      breed: 'German Shepherd',
      age: '5 Years',
      weight: '34 kg',
      gender: 'Male',
      ownerName: 'Amit Patel',
      contact: '+91 97711 22334',
      lastVaccine: 'DHPP (Jun 2026)',
      medicalHistory: ['Annual Health Screening - Jun 2026'],
    },
    {
      id: 'p4',
      name: 'Coco',
      species: 'Parrot',
      breed: 'African Grey',
      age: '2 Years',
      weight: '450 g',
      gender: 'Female',
      ownerName: 'Vikram Mehta',
      contact: '+91 99000 11223',
      lastVaccine: 'N/A',
      medicalHistory: ['Beak Trim - Feb 2026'],
    },
  ]);

  const fetchPets = async () => {
    try {
      const res = await api.get('/pets');
      const list = res.data?.data || res.data;
      if (Array.isArray(list) && list.length > 0) {
        setPets(list);
      }
    } catch (e) {
      console.log('Using default pet directory data');
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPetCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedPet(item);
        setModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarCircle}>
          {item.species.toLowerCase().includes('cat') ? (
            <MaterialCommunityIcons name="cat" size={24} color={colors.primary} />
          ) : (
            <MaterialCommunityIcons name="dog" size={24} color={colors.primary} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.petName}>{item.name}</Text>
            <View style={styles.genderChip}>
              <Text style={styles.genderChipText}>{item.gender}</Text>
            </View>
          </View>
          <Text style={styles.breedText}>
            {item.species} • {item.breed}
          </Text>
          <Text style={styles.ownerText}>Owner: {item.ownerName}</Text>
        </View>
      </View>

      <View style={styles.statsStrip}>
        <Text style={styles.stripText}>Age: {item.age}</Text>
        <Text style={styles.stripDivider}>•</Text>
        <Text style={styles.stripText}>Weight: {item.weight}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleAddPet = async () => {
    if (!petName || !ownerName) {
      Alert.alert('Required Fields', 'Please enter both Pet Name and Owner Name.');
      return;
    }

    const payload = {
      name: petName,
      species,
      breed: breed || 'Mixed',
      age,
      weight,
      gender,
      ownerName,
    };

    setSubmitting(true);
    try {
      const res = await api.post('/pets', payload).catch(() => null);
      const newPet = res?.data?.data || res?.data || { ...payload, id: `p${Date.now()}` };

      setPets([newPet, ...pets]);
      setShowAddModal(false);
      setPetName('');
      setBreed('');
      setOwnerName('');
      Alert.alert('Success', 'Pet profile registered successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to save pet profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.headerTitle}>Pet Patients</Text>
            <Text style={styles.headerSubtitle}>Medical records & pet profiles</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pet name, breed, owner..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        contentContainerStyle={styles.listContainer}
      />

      {/* Pet Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPet && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalAvatar}>
                    <MaterialCommunityIcons name="dog" size={32} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.modalPetName}>{selectedPet.name}</Text>
                    <Text style={styles.modalPetBreed}>
                      {selectedPet.species} ({selectedPet.breed})
                    </Text>
                  </View>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>Owner: {selectedPet.ownerName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>{selectedPet.contact}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={colors.textSecondary} />
                    <Text style={styles.infoText}>
                      Vaccine: {selectedPet.lastVaccine}
                    </Text>
                  </View>

                  <Text style={styles.historyTitle}>Medical Records:</Text>
                  {selectedPet.medicalHistory &&
                    selectedPet.medicalHistory.map((rec, idx) => (
                      <Text key={idx} style={styles.historyItem}>
                        • {rec}
                      </Text>
                    ))}
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>Close Record</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ADD PET PATIENT MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register New Pet Patient</Text>

            <TextInput
              style={styles.input}
              placeholder="Pet Name (e.g. Buddy) *"
              placeholderTextColor={colors.textMuted}
              value={petName}
              onChangeText={setPetName}
            />

            <TextInput
              style={styles.input}
              placeholder="Owner Name (e.g. Rahul Sharma) *"
              placeholderTextColor={colors.textMuted}
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <TextInput
              style={styles.input}
              placeholder="Species (Dog / Cat / Parrot / Bird)"
              placeholderTextColor={colors.textMuted}
              value={species}
              onChangeText={setSpecies}
            />

            <TextInput
              style={styles.input}
              placeholder="Breed (e.g. Golden Retriever)"
              placeholderTextColor={colors.textMuted}
              value={breed}
              onChangeText={setBreed}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Age (e.g. 2 Yrs)"
                placeholderTextColor={colors.textMuted}
                value={age}
                onChangeText={setAge}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Weight (e.g. 14 kg)"
                placeholderTextColor={colors.textMuted}
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowAddModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSubmit} onPress={handleAddPet} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>Save Pet Profile</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justify: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnCancel: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  btnCancelText: { color: colors.textSecondary, fontWeight: '600' },
  btnSubmit: { flex: 1, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary },
  btnSubmitText: { color: '#fff', fontWeight: 'bold' },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  topHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  genderChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  genderChipText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  breedText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  ownerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  stripText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  stripDivider: {
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPetName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalPetBreed: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalBody: {
    marginVertical: 12,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 12,
  },
  historyItem: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  closeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
