import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useFridge } from '../state/FridgeContext';
import IngredientListItem from '../components/IngredientListItem';
import FilterChips from '../components/FilterChips';
import EmptyState from '../components/EmptyState';
import { sortIngredientsByExpiry, getExpiryStatus } from '../../../../packages/shared/src';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Tabs'>;

type FilterKey = 'all' | 'expiringSoon' | 'expired';

const FridgeScreen: React.FC<Props> = () => {
  const { ingredients, deleteIngredient } = useFridge();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(() => {
    const sorted = sortIngredientsByExpiry(ingredients);
    if (filter === 'all') return sorted;
    if (filter === 'expired') {
      return sorted.filter((item) => getExpiryStatus(item.expiryDate).status === 'expired');
    }
    // expiringSoon
    return sorted.filter((item) => {
      const info = getExpiryStatus(item.expiryDate);
      return info.status === 'tomorrow' || info.status === 'within3Days';
    });
  }, [ingredients, filter]);

  const handleAdd = () => {
    // navigate to Add Item tab
    // @ts-ignore - tab name from bottom tab
    navigation.navigate('Add Item');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Fridge</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FilterChips
        value={filter}
        onChange={(key) => setFilter(key as FilterKey)}
        options={[
          { key: 'all', label: 'All' },
          { key: 'expiringSoon', label: 'Expiring Soon' },
          { key: 'expired', label: 'Expired' },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No ingredients yet"
          description="Add items to your fridge to start tracking expiry dates."
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <IngredientListItem
              item={item}
              onDelete={() => deleteIngredient(item.id)}
              // For MVP, reuse Add Item screen for editing in future
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export default FridgeScreen;

