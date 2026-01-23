import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import PropTypes from 'prop-types';

/**
 * Settings Screen Component
 * Displays application settings and preferences
 */
const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Notificaciones</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Modo oscuro</Text>
          <Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Versión:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Términos y condiciones</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Política de privacidad</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Soporte</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Ayuda y soporte</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Reportar un problema</Text>
        </View>
      </View>
    </ScrollView>
  );
};

SettingsScreen.propTypes = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
});

export default SettingsScreen;
