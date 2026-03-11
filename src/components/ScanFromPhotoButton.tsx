import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';

export type ScanSource = 'camera' | 'library';

interface ScanFromPhotoButtonProps {
  onSelectSource: (source: ScanSource) => void;
  disabled?: boolean;
}

const ScanFromPhotoButton: React.FC<ScanFromPhotoButtonProps> = ({
  onSelectSource,
  disabled = false,
}) => {
  const handlePress = () => {
    Alert.alert(
      'Scan from Photo',
      'Choose an image to detect ingredients.',
      [
        { text: 'Take Photo', onPress: () => onSelectSource('camera') },
        { text: 'Choose from Library', onPress: () => onSelectSource('library') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>Scan from Photo</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#111827',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

export default ScanFromPhotoButton;
