import { useState, useEffect } from 'react';
import * as clientService from '../services/clientService';

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
          return { data: { saldoActual: 0 } };
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
      
      console.log('📊 Datos procesados:', {
        resumen,
        perfil,
        movimientos
      });
      
      setResumenCuenta(resumen);
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
      setResumenCuenta({ saldoActual: 0, id: idCliente });
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
