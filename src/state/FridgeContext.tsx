import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import {
  IngredientItem,
  Recipe,
  mockIngredients,
  mockRecipes,
} from '../../../../packages/shared/src';

interface FridgeContextValue {
  ingredients: IngredientItem[];
  recipes: Recipe[];
  addIngredient: (item: Omit<IngredientItem, 'id'>) => void;
  updateIngredient: (id: string, updates: Partial<Omit<IngredientItem, 'id'>>) => void;
  deleteIngredient: (id: string) => void;
}

const FridgeContext = createContext<FridgeContextValue | undefined>(undefined);

export const FridgeProvider = ({ children }: { children: ReactNode }) => {
  const [ingredients, setIngredients] = useState<IngredientItem[]>(mockIngredients);
  const [recipes] = useState<Recipe[]>(mockRecipes);

  const addIngredient = (item: Omit<IngredientItem, 'id'>) => {
    const id = `ing-${Date.now()}`;
    setIngredients((prev) => [...prev, { ...item, id }]);
  };

  const updateIngredient = (id: string, updates: Partial<Omit<IngredientItem, 'id'>>) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const deleteIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({
      ingredients,
      recipes,
      addIngredient,
      updateIngredient,
      deleteIngredient,
    }),
    [ingredients, recipes],
  );

  return <FridgeContext.Provider value={value}>{children}</FridgeContext.Provider>;
};

export const useFridge = (): FridgeContextValue => {
  const ctx = useContext(FridgeContext);
  if (!ctx) {
    throw new Error('useFridge must be used within a FridgeProvider');
  }
  return ctx;
};

