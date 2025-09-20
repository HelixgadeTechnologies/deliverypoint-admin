import { Withdrawal } from "@/types/table-data";
import { useCallback, useState } from "react";

export interface WithdrawalState {
  viewUserDetails: boolean;
  selectedUser: Withdrawal | null;
}

export interface WithdrawalActions {
  setViewUserDetails: (value: boolean) => void;
  setSelectedUser: (user: Withdrawal | null) => void;
  handleViewUserDetails: (
    user: Withdrawal,
    setActiveRowId?: (id: string | null) => void
  ) => void;
  closeAllModals: () => void;
  resetModalState: () => void;
}

export function useWithdrawalModal(): WithdrawalState & WithdrawalActions {
  const [viewUserDetails, setViewUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Withdrawal | null>(null);

  const handleViewUserDetails = useCallback((
    user: Withdrawal, 
    setActiveRowId?: (id: string | null) => void
  ) => {
    setSelectedUser(user);
    setViewUserDetails(true);
    setActiveRowId?.(null);
  }, []);

  const closeAllModals = useCallback(() => {
    setViewUserDetails(false);
    setSelectedUser(null);
  }, []);

  const resetModalState = useCallback(() => {
    setViewUserDetails(false);
    setSelectedUser(null);
  }, []);

  return {
    viewUserDetails,
    selectedUser,
    setSelectedUser,
    setViewUserDetails,
    handleViewUserDetails,
    closeAllModals,
    resetModalState,
  };
}
