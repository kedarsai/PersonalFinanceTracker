import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading, error, and data state
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Custom hook for API mutations (create, update, delete)
export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (apiFunction, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, loading, error, reset };
};

// Custom hook for paginated API calls
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(params);
      
      if (isLoadMore) {
        setData(prev => [...prev, ...result]);
      } else {
        setData(result);
      }
      
      // Assume API returns empty array when no more data
      setHasMore(result.length > 0);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(true);
    }
  }, [loading, hasMore, fetchData]);

  const refetch = useCallback(() => {
    setData([]);
    setHasMore(true);
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    setData([]);
    setHasMore(true);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    refetch, 
    updateParams 
  };
};

// Custom hook for API calls with caching
export const useCachedApi = (apiFunction, cacheKey, dependencies = []) => {
  const [data, setData] = useState(() => {
    // Try to get cached data from localStorage
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      
      // Cache the result
      try {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {
        // Ignore caching errors
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
    } catch {
      // Ignore errors
    }
    setData(null);
    fetchData();
  }, [cacheKey, fetchData]);

  return { data, loading, error, refetch, clearCache };
};