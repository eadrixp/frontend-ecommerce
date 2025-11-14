// Database Service - Direct PostgreSQL Connection
import postgresConfig from '../utils/postgresConfig';

class DatabaseService {
  constructor() {
    this.config = postgresConfig;
  }

  /**
   * Generic query function to fetch from PostgreSQL views
   * @param {string} viewName - Name of the database view
   * @param {object} params - Query parameters (filters, limit, offset)
   * @returns {Promise<Array>} - Data from the view
   */
  async queryView(viewName, params = {}) {
    try {
      // Connection config available via this.config if needed in future
      // const { host, port, database, user, password } = this.config;
      
      // Convert kebab-case to snake_case for PostgreSQL view names
      const viewNameFormatted = viewName.replace(/-/g, '_');
      
      // Build query
      let query = `SELECT * FROM ${viewNameFormatted}`;
      const queryParams = [];
      let paramIndex = 1;
      
      // Add WHERE clauses for filters
      const filterKeys = Object.keys(params);
      if (filterKeys.length > 0) {
        const whereClauses = filterKeys.map(key => {
          queryParams.push(params[key]);
          return `${key} = $${paramIndex++}`;
        });
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }
      
      // For now, return mock data since we can't use pg directly in browser
      // In production, these queries should be executed on the backend
      console.warn(`Query would be: ${query}`, queryParams);
      return this._getMockData(viewNameFormatted);
    } catch (error) {
      console.error(`Error querying view ${viewName}:`, error);
      throw error;
    }
  }

  /**
   * Get inventario consolidado view data
   */
  async getInventarioConsolidado(filters = {}) {
    return this.queryView('inventario-consolidado', filters);
  }

  /**
   * Get productos bajo stock view data
   */
  async getProductosBajoStock(filters = {}) {
    return this.queryView('productos-bajo-stock', filters);
  }

  /**
   * Get movimientos recientes view data
   */
  async getMovimientosRecientes(filters = {}) {
    return this.queryView('movimientos-recientes', filters);
  }

  /**
   * Get clientes actividad view data (CRM)
   */
  async getClientesActividad(filters = {}) {
    return this.queryView('clientes-actividad', filters);
  }

  /**
   * Get pipeline ventas view data (CRM)
   */
  async getPipelineVentas(filters = {}) {
    return this.queryView('pipeline-ventas', filters);
  }

  /**
   * Mock data for development until backend is ready
   */
  _getMockData(viewName) {
    const mockDataMap = {
      inventario_consolidado: [],
      productos_bajo_stock: [],
      movimientos_recientes: [],
      clientes_actividad: [],
      pipeline_ventas: []
    };
    
    return mockDataMap[viewName] || [];
  }

  /**
   * Get paginated results from a view
   */
  async getViewPaginated(viewName, page = 1, limit = 20, filters = {}) {
    const offset = (page - 1) * limit;
    const allData = await this.queryView(viewName, filters);
    return allData.slice(offset, offset + limit);
  }

  /**
   * Sort view results
   */
  async getViewSorted(viewName, sortField, sortOrder = 'ASC', filters = {}) {
    const data = await this.queryView(viewName, filters);
    return data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'ASC' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }
}

const databaseService = new DatabaseService();
export default databaseService;
