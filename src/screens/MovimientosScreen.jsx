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
  Modal,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as userService from '../services/userService';
import { COLORS } from '../constants/theme';

/**
 * MovimientosScreen - Screen showing all account movements/transactions
 * Displays transaction history with filtering and sorting options
 */
const MovimientosScreen = ({ navigation }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosFiltrados, setMovimientosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter and sort states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos'); // todos, positivos, negativos
  const [ordenamiento, setOrdenamiento] = useState('fecha-desc'); // fecha-desc, fecha-asc, monto-desc, monto-asc

  useEffect(() => {
    fetchMovimientos();
  }, []);

  useEffect(() => {
    aplicarFiltrosYOrden();
  }, [movimientos, filtroTipo, ordenamiento]);

  const fetchMovimientos = async () => {
    try {
      setError(null);
      const response = await userService.getClientMovements({ limit: 100, offset: 0 });
      // El backend puede devolver { success, data: { movimientos: [], total, page, limit } }
      // o directamente los movimientos dependiendo del endpoint
      const data = response?.data || response?.movimientos || [];
      setMovimientos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching movimientos:', err);
      setError('No se pudieron cargar los movimientos');
      setMovimientos([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const aplicarFiltrosYOrden = () => {
    let resultado = [...movimientos];

    // Aplicar filtro por tipo de movimiento
    if (filtroTipo === 'positivos') {
      // Filtrar por "Recarga" (ingresos)
      resultado = resultado.filter(m => {
        const tipo = m.tipoMovimiento?.nombre?.toLowerCase() || '';
        return !tipo.includes('consumo');
      });
    } else if (filtroTipo === 'negativos') {
      // Filtrar por "Consumo" (gastos)
      resultado = resultado.filter(m => {
        const tipo = m.tipoMovimiento?.nombre?.toLowerCase() || '';
        return tipo.includes('consumo');
      });
    }

    // Aplicar ordenamiento
    resultado.sort((a, b) => {
      switch (ordenamiento) {
        case 'fecha-desc':
          return new Date(b.fecha) - new Date(a.fecha);
        case 'fecha-asc':
          return new Date(a.fecha) - new Date(b.fecha);
        case 'monto-desc':
          return parseFloat(b.monto) - parseFloat(a.monto);
        case 'monto-asc':
          return parseFloat(a.monto) - parseFloat(b.monto);
        default:
          return 0;
      }
    });

    setMovimientosFiltrados(resultado);
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
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const formatAmount = (amount, tipoMovimiento) => {
    if (!amount) return '$0.00';
    const num = parseFloat(amount);
    const tipo = tipoMovimiento?.nombre?.toLowerCase() || '';
    const isConsumo = tipo.includes('consumo');
    const sign = isConsumo ? '-' : '+';
    return `${sign}$${Math.abs(num).toFixed(2)}`;
  };

  const getAmountColor = (tipoMovimiento) => {
    const tipo = tipoMovimiento?.nombre?.toLowerCase() || '';
    // Consumo = rojo (gasto), Recarga = verde (ingreso)
    return tipo.includes('consumo') ? COLORS.danger : COLORS.success;
  };

  const renderMovimiento = ({ item }) => (
    <TouchableOpacity
      style={styles.movimientoCard}
      onPress={() => navigation.navigate('DetallesMovimiento', { movimiento: item })}
    >
      <View style={styles.movimientoInfo}>
        <Text style={styles.movimientoTitulo}>
          {item.tipoMovimiento?.nombre || 'Movimiento'}
        </Text>
        <Text style={styles.movimientoFecha}>
          {formatDate(item.fecha)}
        </Text>
      </View>
      <Text style={[styles.movimientoMonto, { color: getAmountColor(item.tipoMovimiento) }]}>
        {formatAmount(item.monto, item.tipoMovimiento)}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.titulo}>Mis movimientos</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity 
          style={[styles.filterButton, filtroTipo !== 'todos' && styles.filterButtonActive]}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={[styles.filterButtonText, filtroTipo !== 'todos' && styles.filterButtonTextActive]}>
            {filtroTipo === 'todos' ? 'Filtrar' : filtroTipo === 'positivos' ? 'Ingresos' : 'Gastos'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, ordenamiento !== 'fecha-desc' && styles.filterButtonActive]}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={[styles.filterButtonText, ordenamiento !== 'fecha-desc' && styles.filterButtonTextActive]}>
            Ordenar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filtrar por tipo</Text>
          
          <TouchableOpacity
            style={[styles.modalOption, filtroTipo === 'todos' && styles.modalOptionActive]}
            onPress={() => {
              setFiltroTipo('todos');
              setShowFilterModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, filtroTipo === 'todos' && styles.modalOptionTextActive]}>
              Todos los movimientos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, filtroTipo === 'positivos' && styles.modalOptionActive]}
            onPress={() => {
              setFiltroTipo('positivos');
              setShowFilterModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, filtroTipo === 'positivos' && styles.modalOptionTextActive]}>
              Solo ingresos (+)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, filtroTipo === 'negativos' && styles.modalOptionActive]}
            onPress={() => {
              setFiltroTipo('negativos');
              setShowFilterModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, filtroTipo === 'negativos' && styles.modalOptionTextActive]}>
              Solo gastos (-)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ordenar por</Text>
          
          <TouchableOpacity
            style={[styles.modalOption, ordenamiento === 'fecha-desc' && styles.modalOptionActive]}
            onPress={() => {
              setOrdenamiento('fecha-desc');
              setShowSortModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, ordenamiento === 'fecha-desc' && styles.modalOptionTextActive]}>
              Fecha (más reciente)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, ordenamiento === 'fecha-asc' && styles.modalOptionActive]}
            onPress={() => {
              setOrdenamiento('fecha-asc');
              setShowSortModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, ordenamiento === 'fecha-asc' && styles.modalOptionTextActive]}>
              Fecha (más antiguo)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, ordenamiento === 'monto-desc' && styles.modalOptionActive]}
            onPress={() => {
              setOrdenamiento('monto-desc');
              setShowSortModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, ordenamiento === 'monto-desc' && styles.modalOptionTextActive]}>
              Monto (mayor a menor)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalOption, ordenamiento === 'monto-asc' && styles.modalOptionActive]}
            onPress={() => {
              setOrdenamiento('monto-asc');
              setShowSortModal(false);
            }}
          >
            <Text style={[styles.modalOptionText, ordenamiento === 'monto-asc' && styles.modalOptionTextActive]}>
              Monto (menor a mayor)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowSortModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <FlatList
          data={movimientosFiltrados}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderMovimiento}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {filtroTipo === 'todos' 
                  ? 'No hay movimientos registrados' 
                  : `No hay ${filtroTipo === 'positivos' ? 'ingresos' : 'gastos'}`
                }
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            movimientosFiltrados.length === 0 && styles.listContentEmpty
          ]}
        />
        {renderFilterModal()}
        {renderSortModal()}
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
    gap: 12,
  },
  filterButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    color: COLORS.text.muted,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  listContentEmpty: {
    flex: 1,
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
    fontWeight: '600',
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
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modalOptionActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MovimientosScreen;
