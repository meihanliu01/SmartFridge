import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFridge } from '../state/FridgeContext';
import {
  evaluateRecipeMatch,
  prioritizeRecipesByExpiringIngredients,
  RecipeMatchInfo,
} from '../../../../packages/shared/src';
import FilterChips from '../components/FilterChips';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Tabs'>;

type FilterKey = 'all' | 'cookable' | 'almost';

const RecipeSuggestionsScreen: React.FC<Props> = ({ navigation }) => {
  const { recipes, ingredients } = useFridge();
  const [filter, setFilter] = useState<FilterKey>('all');

  const matches = useMemo<RecipeMatchInfo[]>(() => {
    const prioritized = prioritizeRecipesByExpiringIngredients(recipes, ingredients);
    return prioritized.map((r) => evaluateRecipeMatch(r, ingredients));
  }, [recipes, ingredients]);

  const filtered = useMemo(() => {
    if (filter === 'all') return matches;
    if (filter === 'cookable') {
      return matches.filter((m) => m.status === 'cookable');
    }
    // almost
    return matches.filter((m) => m.status === 'almostCookable');
  }, [matches, filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Suggestions</Text>
      <FilterChips
        value={filter}
        onChange={(key) => setFilter(key as FilterKey)}
        options={[
          { key: 'all', label: 'All' },
          { key: 'cookable', label: 'Cookable' },
          { key: 'almost', label: 'Almost Cookable' },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No recipes yet"
          description="Add more ingredients to your fridge to unlock more recipes."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.listContent}>
          {filtered.map((match) => (
            <RecipeCard
              key={match.recipe.id}
              matchInfo={match}
              onPress={() =>
                navigation.navigate('RecipeDetail', { recipeId: match.recipe.id })
              }
            />
          ))}
        </ScrollView>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
});

export default RecipeSuggestionsScreen;

