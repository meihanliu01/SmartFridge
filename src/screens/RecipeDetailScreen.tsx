import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFridge } from '../state/FridgeContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

const RecipeDetailScreen: React.FC<Props> = ({ route }) => {
  const { recipeId } = route.params;
  const { recipes, ingredients } = useFridge();
  const [stepIndex, setStepIndex] = useState(0);
  const [cookingMode, setCookingMode] = useState(false);

  const recipe = useMemo(
    () => recipes.find((r) => r.id === recipeId),
    [recipes, recipeId],
  );

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recipe not found</Text>
      </View>
    );
  }

  const getAvailability = (requiredName: string) => {
    const haveItems = ingredients.filter(
      (ing) => ing.name.toLowerCase() === requiredName.toLowerCase(),
    );
    const haveQuantity = haveItems.length > 0 ? haveItems[0].quantity : '0';
    const hasAny = haveItems.length > 0;
    return { hasAny, haveQuantity };
  };

  const toggleCookingMode = () => {
    setCookingMode((prev) => !prev);
    setStepIndex(0);
  };

  const nextStep = () => {
    setStepIndex((prev) => Math.min(prev + 1, recipe.steps.length - 1));
  };

  const prevStep = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  if (cookingMode) {
    return (
      <View style={styles.cookingContainer}>
        <Text style={styles.cookingTitle}>{recipe.name}</Text>
        <Text style={styles.cookingStepLabel}>
          Step {stepIndex + 1} of {recipe.steps.length}
        </Text>
        <Text style={styles.cookingStepText}>{recipe.steps[stepIndex]}</Text>
        <View style={styles.cookingButtonsRow}>
          <TouchableOpacity
            style={[styles.cookingButton, stepIndex === 0 && styles.cookingButtonDisabled]}
            onPress={prevStep}
            disabled={stepIndex === 0}
          >
            <Text
              style={[
                styles.cookingButtonText,
                stepIndex === 0 && styles.cookingButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cookingButton,
              stepIndex === recipe.steps.length - 1 && styles.cookingButtonDone,
            ]}
            onPress={nextStep}
            disabled={stepIndex === recipe.steps.length - 1}
          >
            <Text style={styles.cookingButtonText}>
              {stepIndex === recipe.steps.length - 1 ? 'Done' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.exitCookingButton} onPress={toggleCookingMode}>
          <Text style={styles.exitCookingText}>Exit Cooking Mode</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>{recipe.name}</Text>

      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.requiredIngredients.map((req) => {
        const { hasAny, haveQuantity } = getAvailability(req.name);
        return (
          <View key={req.name} style={styles.ingredientRow}>
            <View style={styles.ingredientLeft}>
              <Text style={styles.ingredientName}>{req.name}</Text>
              <Text style={styles.ingredientNeed}>Need: {req.quantity}</Text>
            </View>
            <View style={styles.ingredientRight}>
              <Text style={styles.ingredientHave}>Have: {haveQuantity}</Text>
              <Text style={hasAny ? styles.checkIcon : styles.crossIcon}>
                {hasAny ? '✅' : '❌'}
              </Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Steps</Text>
      {recipe.steps.map((step, index) => (
        <View key={index} style={styles.stepRow}>
          <Text style={styles.stepIndex}>{index + 1}.</Text>
          <Text style={styles.stepText}>{step}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.startButton} onPress={toggleCookingMode}>
        <Text style={styles.startButtonText}>Start Cooking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  ingredientLeft: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  ingredientNeed: {
    fontSize: 13,
    color: '#6b7280',
  },
  ingredientRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  ingredientHave: {
    fontSize: 13,
    color: '#374151',
  },
  checkIcon: {
    marginTop: 4,
    fontSize: 18,
  },
  crossIcon: {
    marginTop: 4,
    fontSize: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  stepIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 6,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  startButton: {
    marginTop: 20,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cookingContainer: {
    flex: 1,
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  cookingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  cookingStepLabel: {
    fontSize: 14,
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 8,
  },
  cookingStepText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 8,
    lineHeight: 26,
  },
  cookingButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cookingButton: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#f97316',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  cookingButtonDisabled: {
    backgroundColor: '#6b7280',
  },
  cookingButtonDone: {
    backgroundColor: '#16a34a',
  },
  cookingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  cookingButtonTextDisabled: {
    color: '#e5e7eb',
  },
  exitCookingButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  exitCookingText: {
    color: '#e5e7eb',
    textDecorationLine: 'underline',
  },
});

export default RecipeDetailScreen;

