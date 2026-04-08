import { useState, useEffect } from 'react';
import * as clientService from '../services/clientService';

const DEFAULT_RESUMEN = {
  saldoActual: 0,
  limiteTotal: 0,
  consumidoMes: 0,
  limiteRestante: 0
};

/**
 * Convierte valores monetarios potencialmente nulos/strings a numero seguro.
 * @param {unknown} value
 * @returns {number}
 */
const toSafeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Normaliza el resumen para mantener compatibilidad con contratos anteriores.
 * @param {Object} rawResumen
 * @returns {Object}
 */
const normalizeResumen = (rawResumen = {}) => {
  const saldoActual = toSafeNumber(rawResumen.saldoActual);
  const limiteTotal = toSafeNumber(rawResumen.limiteTotal);
  const consumidoMes = toSafeNumber(rawResumen.consumidoMes);

  const limiteRestante = rawResumen.limiteRestante == null
    ? Math.max(limiteTotal - consumidoMes, 0)
    : toSafeNumber(rawResumen.limiteRestante);

  return {
    ...DEFAULT_RESUMEN,
    ...rawResumen,
    saldoActual,
    limiteTotal,
    consumidoMes,
    limiteRestante
  };
};

/**
 * Custom Hook - Dashboard Data
 * Maneja el estado y lógica de obtención de datos del dashboard del cliente
 * @param {number} idCliente - ID del cliente autenticado
 * @returns {Object} Estado del dashboard
 */
export const useDashboard = (idCliente) => {
  const [resumenCuenta, setResumenCuenta] = useState(null);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [perfilCliente, setPerfilCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Carga todos los datos del dashboard en paralelo
   */
  const cargarDatos = async () => {
    if (!idCliente) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Intentar obtener datos del cliente autenticado desde el backend
      let hasErrors = false;
      
      const [resumenResponse, perfilResponse, movimientosResponse] = await Promise.all([
        clientService.getResumenCuenta().catch(err => {
          console.error('❌ Error en getResumenCuenta:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
          });
          hasErrors = true;
          return { data: DEFAULT_RESUMEN };
        }),
        clientService.getPerfilCliente().catch(err => {
          console.error('❌ Error en getPerfilCliente:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
          });
          hasErrors = true;
          return { data: { id: idCliente, nombre: 'Usuario', apellido: '' } };
        }),
        clientService.getMovimientosCuenta(5).catch(err => {
          console.error('❌ Error en getMovimientosCuenta:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message
          });
          hasErrors = true;
          return { data: [] };
        })
      ]);
      
      // Log de respuestas exitosas para debugging
      if (!hasErrors) {
        console.log('✅ Respuestas del backend:', {
          resumen: resumenResponse,
          perfil: perfilResponse,
          movimientos: movimientosResponse
        });
      }
      
      // Extraer los datos de las respuestas
      const resumen = resumenResponse.data || resumenResponse;
      const perfil = perfilResponse.data || perfilResponse;
      const movimientos = movimientosResponse.data || movimientosResponse;
      const resumenNormalizado = normalizeResumen(resumen);
      
      console.log('📊 Datos procesados:', {
        resumen: resumenNormalizado,
        perfil,
        movimientos
      });
      
      setResumenCuenta(resumenNormalizado);
      setPerfilCliente(perfil);
      setActividadReciente(Array.isArray(movimientos) ? movimientos : []);
      
      // Si hubo errores, mostrar advertencia
      if (hasErrors) {
        console.warn('⚠️ Backend retornó errores. Mostrando datos de fallback.');
        setError('El servidor está experimentando problemas. Mostrando datos limitados.');
      } else {
        // Limpiar error si la carga fue exitosa
        setError(null);
      }
      
    } catch (err) {
      console.error('Error crítico cargando datos del dashboard:', err);
      // Datos de fallback completos
      setResumenCuenta({ ...DEFAULT_RESUMEN, id: idCliente });
      setPerfilCliente({ id: idCliente, nombre: 'Usuario', apellido: '' });
      setActividadReciente([]);
      setError('Error al cargar datos. Por favor, intenta más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresca los datos del dashboard
   */
  const refrescar = async () => {
    await cargarDatos();
  };

  // Cargar datos al montar y cuando cambie el idCliente
  useEffect(() => {
    cargarDatos();
  }, [idCliente]);

  return {
    resumenCuenta,
    actividadReciente,
    perfilCliente,
    isLoading,
    error,
    refrescar
  };
};
