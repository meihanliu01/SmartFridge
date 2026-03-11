import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface FilterChipOption {
  key: string;
  label: string;
}

interface Props {
  options: FilterChipOption[];
  value: string;
  onChange: (key: string) => void;
}

const FilterChips: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const selected = opt.key === value;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onChange(opt.key)}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  label: {
    fontSize: 14,
    color: '#111827',
  },
  labelSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default FilterChips;

