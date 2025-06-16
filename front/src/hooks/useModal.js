import { useState, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

// Hook específico para manejar múltiples modales
export const useModals = () => {
  const [modals, setModals] = useState({});

  const open = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const close = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const closeAll = useCallback(() => {
    setModals({});
  }, []);

  const isOpen = useCallback((modalName) => {
    return Boolean(modals[modalName]);
  }, [modals]);

  const toggle = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  return {
    open,
    close,
    closeAll,
    isOpen,
    toggle
  };
};