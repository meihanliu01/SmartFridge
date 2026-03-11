import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IngredientItem, getExpiryStatus, getExpirySeverityColor } from '../../../../packages/shared/src';

interface Props {
  item: IngredientItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

const IngredientListItem: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  const info = getExpiryStatus(item.expiryDate);
  const color = getExpirySeverityColor(info.status);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantity}>{item.quantity}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.expiryText, { color }]}>{info.label}</Text>
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit}>
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete}>
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  left: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  quantity: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 4,
  },
  actionText: {
    fontSize: 13,
    color: '#2563eb',
    marginLeft: 8,
  },
  deleteText: {
    color: '#b91c1c',
  },
});

export default IngredientListItem;

