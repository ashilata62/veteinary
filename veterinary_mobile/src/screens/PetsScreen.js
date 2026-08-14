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
  Image,
  ScrollView,
} from 'react-native';
import { colors } from '../theme/colors';
import api from '../config/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function PetsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Owners list for dropdown
  const [owners, setOwners] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');

  // Add Pet Form State
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('2');
  const [weight, setWeight] = useState('15');
  const [gender, setGender] = useState('Male');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  // Owner Selector state
  const [ownerSelectorVisible, setOwnerSelectorVisible] = useState(false);
  const [ownerQuery, setOwnerQuery] = useState('');

  const [pets, setPets] = useState([
    {
      id: 'p1',
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3',
      weight: '28',
      gender: 'Male',
      ownerName: 'Rahul Sharma',
      contact: '+91 98765 43210',
      lastVaccine: 'Rabies',
    },
  ]);

  const loadScreenData = async () => {
    try {
      setLoading(true);
      const [petsRes, ownersRes] = await Promise.all([
        api.get('/pets').catch(() => ({ data: [] })),
        api.get('/owners').catch(() => ({ data: [] })),
      ]);

      const petsList = petsRes.data?.data || petsRes.data || [];
      if (Array.isArray(petsList) && petsList.length > 0) {
        setPets(petsList);
      }

      setOwners(ownersRes.data?.data || ownersRes.data || []);
    } catch (e) {
      console.log('Using default pet directory fallback data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreenData();
  }, []);

  const filteredPets = pets.filter(
    (pet) =>
      (pet.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.ownerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePickImage = async (useCamera = false) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync() 
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', `Permission to access the ${useCamera ? 'camera' : 'gallery'} is required!`);
        return;
      }

      const options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64);
      }
    } catch (error) {
      console.warn('Image picker error:', error);
    }
  };

  const handleAddPet = async () => {
    if (!petName.trim() || !selectedOwnerId || !species) {
      Alert.alert('Required Fields', 'Please enter Pet Name, Select Owner and Select Species.');
      return;
    }

    if (weight && isNaN(Number(weight))) {
      Alert.alert('Validation Error', 'Weight must be a valid plain number.');
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = null;
      if (imageBase64) {
        try {
          const uploadRes = await api.post('/pets/upload', {
            base64Data: `data:image/jpeg;base64,${imageBase64}`,
            fileName: 'pet_photo.jpg'
          });
          photoUrl = uploadRes.data?.data?.url;
        } catch (uploadErr) {
          console.log('Failed to upload image file directly:', uploadErr);
        }
      }

      const payload = {
        name: petName,
        species,
        breed: breed || 'Mixed',
        age: age ? Number(age) : null,
        weight: weight ? Number(weight) : null,
        gender,
        ownerId: selectedOwnerId,
        microchip_number: microchipNumber || null,
        photo_url: photoUrl
      };

      await api.post('/pets', payload);

      Alert.alert('Success', 'Pet profile registered successfully!');
      setShowAddModal(false);
      
      // Clear forms
      setPetName('');
      setBreed('');
      setSelectedOwnerId('');
      setMicrochipNumber('');
      setImageUri(null);
      setImageBase64(null);
      setAge('2');
      setWeight('15');

      loadScreenData();
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to save pet profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const getOwnerLabel = () => {
    const o = owners.find(owner => owner.id === selectedOwnerId);
    return o ? o.name : 'Select Owner...';
  };

  const getFilteredOwners = () => {
    return owners.filter(o => o.name.toLowerCase().includes(ownerQuery.toLowerCase()));
  };

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
          {item.photo_url || item.image || item.photo ? (
            <Image source={{ uri: item.photo_url || item.image || item.photo }} style={{ width: 44, height: 44, borderRadius: 22 }} />
          ) : item.species?.toLowerCase().includes('cat') ? (
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
          <Text style={styles.ownerText}>Owner: {item.ownerName || item.owner_name || 'Clinic Patient'}</Text>
        </View>
      </View>

      <View style={styles.statsStrip}>
        <Text style={styles.stripText}>Age: {item.age} Years</Text>
        <Text style={styles.stripDivider}>•</Text>
        <Text style={styles.stripText}>Weight: {item.weight} kg</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Screen Title & Add Button */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.headerTitle}>Pet Directory</Text>
          <Text style={styles.headerSubtitle}>Manage patient records & history</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by pet name, breed, or owner..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredPets}
          keyExtractor={(item, index) => (item.id || index).toString()}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No pets registered in clinic database.</Text>
          }
        />
      )}

      {/* VIEW DETAILS MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPet && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>{selectedPet.name}'s Profile</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                    <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  <View style={styles.detailAvatarContainer}>
                    {selectedPet.photo_url || selectedPet.image || selectedPet.photo ? (
                      <Image source={{ uri: selectedPet.photo_url || selectedPet.image || selectedPet.photo }} style={styles.detailAvatar} />
                    ) : (
                      <View style={[styles.detailAvatar, { backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center' }]}>
                        <MaterialCommunityIcons name={selectedPet.species?.toLowerCase().includes('cat') ? 'cat' : 'dog'} size={60} color={colors.primary} />
                      </View>
                    )}
                  </View>

                  <View style={styles.infoGroup}>
                    <Text style={styles.detailLabel}>Species</Text>
                    <Text style={styles.detailValue}>{selectedPet.species}</Text>

                    <Text style={styles.detailLabel}>Breed</Text>
                    <Text style={styles.detailValue}>{selectedPet.breed || 'N/A'}</Text>

                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{selectedPet.gender}</Text>

                    <Text style={styles.detailLabel}>Age</Text>
                    <Text style={styles.detailValue}>{selectedPet.age} Years</Text>

                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>{selectedPet.weight} kg</Text>

                    <Text style={styles.detailLabel}>Microchip Number</Text>
                    <Text style={styles.detailValue}>{selectedPet.microchip_number || 'No microchip registered'}</Text>

                    <Text style={styles.detailLabel}>Owner Name</Text>
                    <Text style={styles.detailValue}>{selectedPet.ownerName || selectedPet.owner_name || 'N/A'}</Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* REGISTER NEW PET MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Register Pet Patient</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle-outline" size={26} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              {/* Pet Name */}
              <Text style={styles.label}>Pet Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Buddy"
                placeholderTextColor={colors.textMuted}
                value={petName}
                onChangeText={setPetName}
              />

              {/* Owner Selector */}
              <Text style={styles.label}>Select Client / Pet Owner *</Text>
              <TouchableOpacity style={styles.selectorBtn} onPress={() => setOwnerSelectorVisible(true)}>
                <Text style={styles.selectorBtnText}>{getOwnerLabel()}</Text>
                <Ionicons name="chevron-down-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.dropdownRow}>
                {/* Species Selector */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Species *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Dog / Cat / Bird"
                    placeholderTextColor={colors.textMuted}
                    value={species}
                    onChangeText={setSpecies}
                  />
                </View>

                {/* Breed */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Breed</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Golden Retriever"
                    placeholderTextColor={colors.textMuted}
                    value={breed}
                    onChangeText={setBreed}
                  />
                </View>
              </View>

              <View style={styles.dropdownRow}>
                {/* Age */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Age (Years)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 2"
                    placeholderTextColor={colors.textMuted}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>

                {/* Weight */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Weight (kg) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 15"
                    placeholderTextColor={colors.textMuted}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Microchip */}
              <Text style={styles.label}>Microchip Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 981022300481239"
                placeholderTextColor={colors.textMuted}
                value={microchipNumber}
                onChangeText={setMicrochipNumber}
              />

              {/* Gender */}
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.tabContainer}>
                {['Male', 'Female'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.tabChip, gender === g && styles.tabChipActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.tabChipText, gender === g && styles.tabChipTextActive]}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Photo Upload Options */}
              <Text style={styles.label}>Upload Pet Photo</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <TouchableOpacity style={styles.photoBtn} onPress={() => handlePickImage(true)}>
                  <Ionicons name="camera" size={20} color={colors.primary} />
                  <Text style={styles.photoBtnText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoBtn} onPress={() => handlePickImage(false)}>
                  <Ionicons name="image" size={20} color={colors.primary} />
                  <Text style={styles.photoBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>

              {imageUri && (
                <Image source={{ uri: imageUri }} style={{ width: 80, height: 80, borderRadius: 10, alignSelf: 'center', marginBottom: 12 }} />
              )}

              <TouchableOpacity style={styles.submitBtn} onPress={handleAddPet} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Register Pet Patient</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Owners Search Modal */}
      <Modal visible={ownerSelectorVisible} transparent animationType="fade">
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorContent}>
            <View style={styles.selectorHeader}>
              <Text style={styles.selectorTitle}>Select Client / Pet Owner</Text>
              <TouchableOpacity onPress={() => setOwnerSelectorVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.selectorSearch}>
              <Ionicons name="search" size={16} color={colors.textMuted} />
              <TextInput
                style={styles.selectorSearchInput}
                placeholder="Search owner..."
                placeholderTextColor={colors.textMuted}
                value={ownerQuery}
                onChangeText={setOwnerQuery}
              />
            </View>

            <FlatList
              data={getFilteredOwners()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.selectorItem}
                  onPress={() => {
                    setSelectedOwnerId(item.id);
                    setOwnerSelectorVisible(false);
                  }}
                >
                  <Ionicons name="person-outline" size={16} color={colors.primary} />
                  <Text style={styles.selectorItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptySelector}>No results match your search.</Text>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  petName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  genderChip: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  genderChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  breedText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ownerText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  stripText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stripDivider: {
    color: colors.border,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailAvatarContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  detailAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  infoGroup: {
    gap: 12,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  selectorBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 4,
  },
  selectorBtnText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tabChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabChipTextActive: {
    color: colors.primary,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 40,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  photoBtnText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectorContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    width: '85%',
    maxHeight: '70%',
    padding: 16,
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectorTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  selectorSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
    marginBottom: 12,
  },
  selectorSearchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  selectorItemText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  emptySelector: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 13,
    marginVertical: 20,
  },
});
