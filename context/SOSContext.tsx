// contexts/SOSContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/app/(app)/firebase/config';
import { toast } from 'react-hot-toast';

export interface SOSAlert {
  id: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
    resolved: boolean;
  };
  status: string;
  timestamp: any;
  userId: string;
  userName: string;
}

interface SOSAlertsContextType {
  sosAlerts: SOSAlert[];
  activeAlerts: SOSAlert[];
  loading: boolean;
  error: string | null;
  refreshAlerts: () => void;
  markAsResolved: (alertId: string) => Promise<void>;
}

const SOSAlertsContext = createContext<SOSAlertsContextType | undefined>(undefined);

interface SOSAlertsProviderProps {
  children: React.ReactNode;
}

export const SOSAlertsProvider: React.FC<SOSAlertsProviderProps> = ({ children }) => {
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all SOS alerts with real-time updates
  useEffect(() => {
    const fetchSOSAlerts = async () => {
      try {
        setLoading(true);
        const sosRef = collection(db, 'sos_alerts');
        
        // Remove the where clause to get ALL alerts, then filter client-side
        const q = query(
          sosRef,
          orderBy('timestamp', 'desc')
        );

        const unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            const alertsData: SOSAlert[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              alertsData.push({
                id: doc.id,
                location: {
                  address: data.location?.address || 'N/A',
                  latitude: data.location?.latitude || 0,
                  longitude: data.location?.longitude || 0,
                  resolved: data.location?.resolved || false,
                },
                status: data.status || 'active',
                timestamp: data.timestamp,
                userId: data.userId || 'Unknown User',
                userName: data.userName || 'Unknown Rider',
              } as SOSAlert);
            });
            
            setSosAlerts(alertsData);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error fetching SOS alerts:', err);
            setError('Failed to load SOS alerts');
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error('Error setting up SOS alerts listener:', err);
        setError('Failed to load SOS alerts');
        setLoading(false);
      }
    };

    const unsubscribe = fetchSOSAlerts();
    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub && unsub());
      }
    };
  }, []);

  // Function to mark an alert as resolved
  const markAsResolved = async (alertId: string) => {
    try {
      const alertRef = doc(db, 'sos_alerts', alertId);
      await updateDoc(alertRef, {
        'location.resolved': true,
        'resolvedAt': new Date()
      });
      toast.success('SOS alert marked as resolved');
    } catch (error) {
      console.error('Error marking alert as resolved:', error);
      toast.error('Failed to resolve alert');
      throw error;
    }
  };

  // Get only active, unresolved alerts - FIXED FILTER
  const activeAlerts = sosAlerts.filter(alert => 
    alert.status === 'active' && !alert.location.resolved
  );

  const refreshAlerts = () => {
    setLoading(true);
  };

  const value: SOSAlertsContextType = {
    sosAlerts,
    activeAlerts,
    loading,
    error,
    refreshAlerts,
    markAsResolved,
  };

  return (
    <SOSAlertsContext.Provider value={value}>
      {children}
    </SOSAlertsContext.Provider>
  );
};

// Custom hook to use the SOS alerts context
export const useSOSAlerts = (): SOSAlertsContextType => {
  const context = useContext(SOSAlertsContext);
  if (context === undefined) {
    throw new Error('useSOSAlerts must be used within a SOSAlertsProvider');
  }
  return context;
};