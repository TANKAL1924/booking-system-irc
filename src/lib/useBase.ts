import { useEffect } from 'react';
import { useBaseStore } from '@/store/baseStore';

export function useBase() {
  const { base, loading, fetch } = useBaseStore();
  useEffect(() => { fetch(); }, [fetch]);
  return { base, loading };
}
