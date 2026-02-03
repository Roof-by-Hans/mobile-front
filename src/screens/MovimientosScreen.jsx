import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Modal,
  Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as userService from '../services/userService';
import { Loading, EmptyState, ErrorMessage, TransactionCard } from '../components';
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
    <TransactionCard
      transaction={item}
      onPress={() => navigation.navigate('DetallesMovimiento', { movimiento: item })}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.titulo}>Mis movimientos</Text>
      <View style={styles.filterButtons}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.filterButtonText}>Ordenar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowFilterModal(false)}
      >
        <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
        <View style={styles.modalContent}>
          {/* Indicador de arrastre */}
          <View style={styles.modalHandle} />
          
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
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowSortModal(false)}
      >
        <BlurView intensity={40} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
        <View style={styles.modalContent}>
          {/* Indicador de arrastre */}
          <View style={styles.modalHandle} />
          
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
        <Loading text="Cargando movimientos..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorContainer}>
          <ErrorMessage
            title="Error al cargar"
            message={error}
            variant="error"
            actionText="Reintentar"
            onAction={fetchMovimientos}
          />
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
            <EmptyState
              title={filtroTipo === 'todos' ? 'No hay movimientos' : `No hay ${filtroTipo === 'positivos' ? 'ingresos' : 'gastos'}`}
              message={filtroTipo === 'todos' 
                ? 'Aún no tienes movimientos registrados en tu cuenta'
                : `No se encontraron ${filtroTipo === 'positivos' ? 'ingresos' : 'gastos'} en tu historial`
              }
              style={styles.emptyState}
            />
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
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    paddingTop: 15,
    paddingBottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 0,
    marginBottom: 0
  },
  titulo: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.6
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24
  },
  filterButton: {
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(253, 216, 53, 0.4)',
    width: 163,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  filterButtonText: {
    color: COLORS.text.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.35
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    paddingTop: 0
  },
  listContentEmpty: {
    flex: 1,
  },
  emptyState: {
    marginTop: 40,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: COLORS.text.muted,
    borderRadius: 2,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 24,
    marginTop: 12,
    textAlign: 'center',
  },
  modalOption: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 9999,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalOptionActive: {
    backgroundColor: 'transparent',
    borderColor: COLORS.text.primary,
    borderWidth: 2,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '400',
  },
  modalOptionTextActive: {
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  modalCancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginTop: 12,
  },
  modalCancelText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default MovimientosScreen;
