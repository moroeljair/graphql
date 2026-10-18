import DataLoader from 'dataloader';
import { db } from './database.js';

// Crea los loaders para una petición concreta.
// La función batch recibe todas las claves acumuladas durante ese ciclo.
export function createDataLoaders() {
  return {
    facturasPorCliente: new DataLoader((clienteIds) =>
      db.fetchFacturasByClienteIdsBatch(clienteIds)
    ),
  };
}
