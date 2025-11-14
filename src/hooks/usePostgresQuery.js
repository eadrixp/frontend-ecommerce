// Custom Hook for PostgreSQL Database Queries
import { useState, useEffect, useCallback } from 'react';
import databaseService from '../services/databaseService';

/**
 * Hook to fetch data from PostgreSQL views
 * @param {string} viewName - Name of the database view
 * @param {object} options - Configuration options
 * @returns {object} - { data, loading, error, refetch, setFilters }
 */
export const usePostgresQuery = (viewName, options = {}) => {
  const {
    filters = {},
    enabled = true,
    dependencies = [],
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState(filters);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await databaseService.queryView(viewName, currentFilters);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching data from ${viewName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [viewName, currentFilters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters) => {
    setCurrentFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    setFilters: updateFilters,
    count: data.length,
  };
};

/**
 * Hook for paginated queries
 */
export const usePostgresQueryPaginated = (viewName, options = {}) => {
  const {
    pageSize = 20,
    filters = {},
    enabled = true,
  } = options;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await databaseService.getViewPaginated(
        viewName,
        page,
        pageSize,
        filters
      );
      setData(Array.isArray(result) ? result : []);
      // Calculate total pages if backend provides total count
      if (result.total) {
        setTotalPages(Math.ceil(result.total / pageSize));
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching paginated data from ${viewName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [viewName, page, pageSize, filters, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(page + 1), [page, goToPage]);
  const previousPage = useCallback(() => goToPage(page - 1), [page, goToPage]);

  return {
    data,
    loading,
    error,
    page,
    totalPages,
    pageSize,
    goToPage,
    nextPage,
    previousPage,
    refetch: fetchData,
  };
};
