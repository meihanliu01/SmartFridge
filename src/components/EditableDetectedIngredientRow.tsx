import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DetectedIngredient } from '../services/scanIngredients';
import { getDefaultExpiryDate } from '../services/scanIngredients';

interface EditableDetectedIngredientRowProps {
  item: DetectedIngredient;
  onUpdate: (id: string, updates: Partial<DetectedIngredient>) => void;
  onDelete: (id: string) => void;
}

const EditableDetectedIngredientRow: React.FC<EditableDetectedIngredientRowProps> = ({
  item,
  onUpdate,
  onDelete,
}) => {
  const expiryDateStr = item.expiryDate ?? getDefaultExpiryDate();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dateForPicker = expiryDateStr
    ? new Date(expiryDateStr + 'T12:00:00')
    : new Date();

  const handleDateChange = (_: unknown, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      onUpdate(item.id, { expiryDate: date.toISOString().slice(0, 10) });
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.inputs}>
        <TextInput
          style={styles.nameInput}
          placeholder="Ingredient name"
          placeholderTextColor="#9ca3af"
          value={item.name}
          onChangeText={(name) => onUpdate(item.id, { name })}
        />
        <TextInput
          style={styles.quantityInput}
          placeholder="Quantity"
          placeholderTextColor="#9ca3af"
          value={item.quantity}
          onChangeText={(quantity) => onUpdate(item.id, { quantity })}
        />
        <TouchableOpacity
          style={styles.dateTouchable}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            Expiry: {expiryDateStr}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateForPicker}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  inputs: {
    flex: 1,
    marginRight: 8,
  },
  nameInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 6,
    color: '#111827',
  },
  quantityInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 6,
    color: '#111827',
  },
  dateTouchable: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 14,
    color: '#b91c1c',
    fontWeight: '500',
  },
});

export default EditableDetectedIngredientRow;
