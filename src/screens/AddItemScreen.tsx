import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useFridge } from '../state/FridgeContext';
import { ingredientNameSuggestions } from '../../../../packages/shared/src';
import type { DetectedIngredient } from '../services/scanIngredients';
import {
  scanIngredientsFromImage,
  getDefaultExpiryDate,
  createDetectedIngredientId,
} from '../services/scanIngredients';
import ScanFromPhotoButton from '../components/ScanFromPhotoButton';
import ScanReviewModal from '../components/ScanReviewModal';
import type { ScanSource } from '../components/ScanFromPhotoButton';

const UNITS = ['pcs', 'g', 'ml', 'box', 'bag', 'carton'];

const AddItemScreen: React.FC = () => {
  const { addIngredient } = useFridge();
  const [name, setName] = useState('');
  const [quantityNumber, setQuantityNumber] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState(() => {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    return now;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Scan-from-photo state
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedIngredient[]>([]);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const suggestions = ingredientNameSuggestions.filter((s) =>
    s.toLowerCase().includes(name.toLowerCase()),
  );

  const handleScanSelectSource = async (source: ScanSource) => {
    setScanError(null);
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera access',
          'Camera permission is required to take a photo of your ingredients.',
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      await runScan(result.assets[0].uri);
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Photo library access',
          'Photo library permission is required to choose an image.',
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
      });
      if (result.canceled || !result.assets?.[0]?.uri) return;
      await runScan(result.assets[0].uri);
    }
  };

  const runScan = async (uri: string) => {
    setSelectedImageUri(uri);
    setIsScanning(true);
    setScanError(null);
    try {
      const items = await scanIngredientsFromImage({ type: 'uri', uri });
      setIsScanning(false);
      if (items.length === 0) {
        Alert.alert(
          'No ingredients detected',
          'No ingredients detected. Try another photo.',
        );
        return;
      }
      setDetectedItems(items);
      setIsReviewModalVisible(true);
    } catch (e) {
      setIsScanning(false);
      const message = e instanceof Error ? e.message : 'Scan failed';
      setScanError(message);
    }
  };

  const handleScanConfirmSave = () => {
    const defaultExpiry = getDefaultExpiryDate();
    const valid = detectedItems.filter((item) => item.name.trim() !== '');
    if (valid.length === 0) {
      Alert.alert('No items to save', 'Add at least one ingredient with a name.');
      return;
    }
    setIsSaving(true);
    valid.forEach((item) => {
      addIngredient({
        name: item.name.trim(),
        quantity: (item.quantity || '1').trim(),
        expiryDate: item.expiryDate || defaultExpiry,
      });
    });
    setIsSaving(false);
    setIsReviewModalVisible(false);
    setDetectedItems([]);
    setSelectedImageUri(null);
    setScanError(null);
    Alert.alert('Success', 'Items added to fridge');
  };

  const handleScanModalCancel = () => {
    setIsReviewModalVisible(false);
    setDetectedItems([]);
    setSelectedImageUri(null);
  };

  const handleUpdateDetectedItem = (id: string, updates: Partial<DetectedIngredient>) => {
    setDetectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const handleDeleteDetectedItem = (id: string) => {
    setDetectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddDetectedRow = () => {
    setDetectedItems((prev) => [
      ...prev,
      {
        id: createDetectedIngredientId(),
        name: '',
        quantity: '',
        expiryDate: getDefaultExpiryDate(),
      },
    ]);
  };

  const handleSave = () => {
    if (!name.trim() || !quantityNumber.trim()) {
      Alert.alert('Missing information', 'Please fill in all required fields.');
      return;
    }

    const expiryStr = expiryDate.toISOString().slice(0, 10);

    addIngredient({
      name: name.trim(),
      quantity: `${quantityNumber.trim()} ${unit}`,
      expiryDate: expiryStr,
    });

    Alert.alert('Success', 'Item added to fridge');
    setName('');
    setQuantityNumber('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Item</Text>

      <ScanFromPhotoButton
        onSelectSource={handleScanSelectSource}
        disabled={isScanning}
      />

      {isScanning && (
        <View style={styles.scanOverlay}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.scanOverlayText}>Scanning...</Text>
        </View>
      )}

      {scanError ? (
        <View style={styles.scanErrorBox}>
          <Text style={styles.scanErrorText}>{scanError}</Text>
          <View style={styles.scanErrorActions}>
            {selectedImageUri ? (
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => runScan(selectedImageUri)}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => setScanError(null)}
            >
              <Text style={styles.dismissButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ScanReviewModal
        visible={isReviewModalVisible}
        imageUri={selectedImageUri}
        items={detectedItems}
        onUpdateItem={handleUpdateDetectedItem}
        onDeleteItem={handleDeleteDetectedItem}
        onAddRow={handleAddDetectedRow}
        onConfirm={handleScanConfirmSave}
        onCancel={handleScanModalCancel}
        isSaving={isSaving}
      />

      <Text style={styles.label}>Ingredient Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Milk"
        value={name}
        onChangeText={setName}
      />
      {name.length > 0 && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          style={styles.suggestions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setName(item)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.label}>Quantity *</Text>
      <View style={styles.quantityRow}>
        <TextInput
          style={[styles.input, styles.quantityInput]}
          placeholder="e.g. 1"
          keyboardType="numeric"
          value={quantityNumber}
          onChangeText={setQuantityNumber}
        />
        <FlatList
          horizontal
          data={UNITS}
          keyExtractor={(u) => u}
          contentContainerStyle={styles.unitsRow}
          renderItem={({ item }) => {
            const selected = item === unit;
            return (
              <TouchableOpacity
                onPress={() => setUnit(item)}
                style={[styles.unitChip, selected && styles.unitChipSelected]}
              >
                <Text
                  style={[styles.unitText, selected && styles.unitTextSelected]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <Text style={styles.label}>Expiry Date *</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>
          {expiryDate.toISOString().slice(0, 10)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setExpiryDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <View style={styles.futureSection}>
        <Text style={styles.sectionTitle}>Quick Add (coming soon)</Text>
        <View style={styles.quickRow}>
          {['Milk', 'Eggs', 'Bread'].map((item) => (
            <View key={item} style={styles.quickButton}>
              <Text style={styles.quickText}>{item}</Text>
            </View>
          ))}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  suggestions: {
    maxHeight: 120,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
  },
  quantityRow: {
    marginBottom: 4,
  },
  quantityInput: {
    marginBottom: 8,
  },
  unitsRow: {
    paddingVertical: 2,
  },
  unitChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    backgroundColor: '#f9fafb',
  },
  unitChipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  unitText: {
    fontSize: 13,
    color: '#374151',
  },
  unitTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  dateButton: {
    marginTop: 4,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#111827',
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  futureSection: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  quickRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  quickButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
  },
  quickText: {
    fontSize: 13,
    color: '#374151',
  },
  scanOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scanOverlayText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  scanErrorBox: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  scanErrorText: {
    fontSize: 14,
    color: '#b91c1c',
    marginBottom: 8,
  },
  scanErrorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  retryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#b91c1c',
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  dismissButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#6b7280',
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default AddItemScreen;

