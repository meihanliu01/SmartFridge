import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFridge } from '../state/FridgeContext';
import { groupIngredientsByExpiry, getExpiryStatus } from '../../../../packages/shared/src';

const ExpiryAlertsScreen: React.FC = () => {
  const { ingredients } = useFridge();

  const sections = useMemo(() => groupIngredientsByExpiry(ingredients), [ingredients]);

  if (sections.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Expiry Alerts</Text>
        <Text style={styles.emptyText}>
          Nothing urgent right now. Your fridge looks fresh!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Expiry Alerts</Text>
      {sections.map((section) => (
        <View key={section.key} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item) => {
            const info = getExpiryStatus(item.expiryDate);
            return (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>
                    Expires on {item.expiryDate} · {info.label}
                  </Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {info.status === 'expired'
                      ? 'Expired'
                      : info.status === 'tomorrow'
                      ? 'Tomorrow'
                      : info.status === 'within3Days'
                      ? 'Within 3 Days'
                      : 'Later'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      ))}

      <View style={styles.futureSection}>
        <Text style={styles.futureTitle}>Notifications (future)</Text>
        <Text style={styles.futureText}>
          A future version of Smart Fridge will send a daily 9:00 AM reminder
          when ingredients are close to expiring. The notification scheduler
          will plug into this Expiry Alerts logic.
        </Text>
      </View>
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
    marginBottom: 8,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  itemLeft: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  itemDetails: {
    fontSize: 13,
    color: '#6b7280',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b91c1c',
  },
  futureSection: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  futureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  futureText: {
    fontSize: 13,
    color: '#374151',
  },
});

export default ExpiryAlertsScreen;

