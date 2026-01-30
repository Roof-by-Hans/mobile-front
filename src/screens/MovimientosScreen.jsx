import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clientService } from '../services/clientService';
import { COLORS } from '../constants/theme';

/**
 * MovimientosScreen - Screen showing all account movements/transactions
 * Displays transaction history with filtering and sorting options
 */
const MovimientosScreen = ({ navigation }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    try {
      setError(null);
      const data = await clientService.getMovimientosCuenta();
      setMovimientos(data || []);
    } catch (err) {
      console.error('Error fetching movimientos:', err);
      setError('No se pudieron cargar los movimientos');
      setMovimientos([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMovimientos();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} de ${month}, ${year}`;
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    const sign = num >= 0 ? '+' : '-';
    return `${sign}$${Math.abs(num).toFixed(2)}`;
  };

  const getAmountColor = (amount) => {
    const num = parseFloat(amount);
    return num >= 0 ? COLORS.success : COLORS.danger;
  };

  const renderMovimiento = ({ item }) => (
    <TouchableOpacity
      style={styles.movimientoCard}
      onPress={() => navigation.navigate('DetallesMovimiento', { movimiento: item })}
    >
      <View style={styles.movimientoInfo}>
        <Text style={styles.movimientoTitulo}>
          {item.tipoMovimientoDetalle || 'Movimiento'}
        </Text>
        <Text style={styles.movimientoFecha}>
          {formatDate(item.fecha)}
        </Text>
      </View>
      <Text style={[styles.movimientoMonto, { color: getAmountColor(item.monto) }]}>
        {formatAmount(item.monto)}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.titulo}>Mis movimientos</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Ordenar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando movimientos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMovimientos}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (movimientos.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay movimientos registrados</Text>
        </View>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
      <FlatList
        data={movimientos}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderMovimiento}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: COLORS.text.muted,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  movimientoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  movimientoInfo: {
    flex: 1,
  },
  movimientoTitulo: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  movimientoFecha: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  movimientoMonto: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default MovimientosScreen;
