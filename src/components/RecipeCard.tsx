import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RecipeMatchInfo } from '../../../../packages/shared/src';

interface Props {
  matchInfo: RecipeMatchInfo;
  onPress?: () => void;
}

const RecipeCard: React.FC<Props> = ({ matchInfo, onPress }) => {
  const { recipe, status, missingIngredients } = matchInfo;

  const statusLabel =
    status === 'cookable'
      ? 'Cookable'
      : status === 'almostCookable'
      ? 'Almost Cookable'
      : missingIngredients.length > 0
      ? `Missing: ${missingIngredients.join(', ')}`
      : 'Not Cookable';

  const statusColor =
    status === 'cookable' ? '#16a34a' : status === 'almostCookable' ? '#f97316' : '#6b7280';

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {recipe.requiredIngredients.map((ri) => `${ri.name} (${ri.quantity})`).join(' · ')}
      </Text>
      {status === 'notCookable' && missingIngredients.length > 0 && (
        <Text style={styles.missingText}>
          Missing: {missingIngredients.join(', ')}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  missingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#b91c1c',
  },
});

export default RecipeCard;

