// components/sos-alert-modal.tsx
"use client";

import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import { useState, useEffect } from "react";
import MapView from "@/ui/map";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/(app)/firebase/config";
import { formatTriggerTime } from "@/utils/date-utility";
import Loading from "@/app/loading";
import { SOSAlert, useSOSAlerts } from "@/context/SOSContext";
import Button from "@/ui/button";

interface Customer {
  id: string;
  phoneNumber?: string;
  phone_number?: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Function to convert latitude/longitude to percentage coordinates (0-100)
const convertCoordinatesToPercentage = (lat: number, lng: number) => {
  const NIGERIA_BOUNDS = {
    minLat: 4.0,
    maxLat: 14.0,
    minLng: 2.0,
    maxLng: 15.0,
  };

  const y =
    100 -
    ((lat - NIGERIA_BOUNDS.minLat) /
      (NIGERIA_BOUNDS.maxLat - NIGERIA_BOUNDS.minLat)) *
      100;
  const x =
    ((lng - NIGERIA_BOUNDS.minLng) /
      (NIGERIA_BOUNDS.maxLng - NIGERIA_BOUNDS.minLng)) *
    100;

  return {
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(5, Math.min(95, y)),
  };
};

export default function SOSAlertModal({ isOpen, onClose }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<Record<string, Customer>>(
    {}
  );
  const [resolvingAlerts, setResolvingAlerts] = useState<Set<string>>(
    new Set()
  );

  // Use the context instead of local state
  const { activeAlerts: sosAlerts, loading, markAsResolved } = useSOSAlerts();

  // Fetch customer phone numbers
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (sosAlerts.length === 0) return;

      try {
        const customerPromises = sosAlerts.map(async (alert) => {
          try {
            const customerRef = doc(db, "riders", alert.userId);
            const customerSnapshot = await getDoc(customerRef);

            if (customerSnapshot.exists()) {
              return {
                userId: alert.userId,
                data: {
                  id: customerSnapshot.id,
                  ...customerSnapshot.data(),
                } as Customer,
              };
            }
          } catch (error) {
            console.error(`Error fetching customer ${alert.userId}:`, error);
          }
          return null;
        });

        const customerResults = await Promise.all(customerPromises);
        const customerMap: Record<string, Customer> = {};

        customerResults.forEach((result) => {
          if (result && result.data) {
            customerMap[result.userId] = result.data;
          }
        });

        setCustomerData(customerMap);
      } catch (error) {
        console.error("Error fetching rider data:", error);
      }
    };

    fetchCustomerData();
  }, [sosAlerts]);

  const openMap = (sosId: string) => {
    setSelectedSosId(sosId);
    setIsMapOpen(true);
  };

  // const closeMap = () => {
  //   setIsMapOpen(false);
  //   setSelectedSosId(null);
  // };

  // Handle resolve alert
  const handleResolveAlert = async (alertId: string) => {
    try {
      setResolvingAlerts((prev) => new Set(prev).add(alertId));
      await markAsResolved(alertId);
    } catch (error) {
      // Error is handled by the context and toast will show
      console.error("Error resolving alert:", error);
    } finally {
      setResolvingAlerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(alertId);
        return newSet;
      });
    }
  };


  // Get phone number from customer data
  const getPhoneNumber = (userId: string): string => {
    return customerData[userId]?.phoneNumber || customerData[userId]?.phone_number || "N/A";
  };

  // Get coordinates for map
  const getMapCoordinates = (sos: SOSAlert) => {
    const currentCoords = convertCoordinatesToPercentage(
      sos.location.latitude,
      sos.location.longitude
    );

    const destinationCoords = convertCoordinatesToPercentage(
      sos.location.latitude + 0.02,
      sos.location.longitude + 0.02
    );

    return {
      currentLocation: {
        label: "Current Location",
        description: sos.location.address,
        x: currentCoords.x,
        y: currentCoords.y,
      },
      destination: {
        label: "Nearest Help",
        x: destinationCoords.x,
        y: destinationCoords.y,
      },
    };
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="876px">
        <div className="flex items-center justify-between">
          <h1 className="text-[#1F1F1F] font-extrabold text-[32px]">
            SOS Alert (Loading...)
          </h1>
          <div
            onClick={onClose}
            className="size-12 bg-[#F8F9FA99] rounded-[20px] p-2 flex justify-center items-center cursor-pointer">
            <Icon icon={"mingcute:close-line"} height={25} width={25} />
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="876px">
      <div className="flex items-center justify-between">
        <h1 className="text-[#1F1F1F] font-extrabold text-[32px]">
          SOS Alert({sosAlerts.length})
        </h1>
        <div
          onClick={onClose}
          className="size-12 bg-[#F8F9FA99] rounded-[20px] p-2 flex justify-center items-center cursor-pointer">
          <Icon icon={"mingcute:close-line"} height={25} width={25} />
        </div>
      </div>

      {/* alert list */}
      <div className="space-y-5 h-[550px] overflow-y-auto scrollbar-hide">
        {sosAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Icon
              icon="fa:check-circle"
              height={60}
              width={60}
              color="#21C788"
            />
            <p className="text-lg font-semibold mt-4">No Active SOS Alerts</p>
            <p className="text-sm">All alerts have been resolved</p>
          </div>
        ) : (
          sosAlerts.map((sos) => {
            const mapCoords = getMapCoordinates(sos);
            const isResolving = resolvingAlerts.has(sos.id);

            return (
              <CardComponent key={sos.id}>
                <div className="space-y-6">
                  {/* header */}
                  <div className="h-[100px] w-full rounded-t-2xl border-b-2 border-[#FF4D4F] bg-[#FEE2E299] p-6 flex items-center gap-5">
                    <Icon
                      icon="fa:warning"
                      color="#FF4D4F"
                      height={25}
                      width={25}
                    />
                    <div className="space-y-1 text-[#FF4D4F]">
                      <h3 className="text-xl font-bold">
                        Emergency SOS Alerts
                      </h3>
                      <p className="text-base">
                        Immediate attention required - Rider in distress
                      </p>
                    </div>
                  </div>

                  {/* rider details */}
                  <div className="flex justify-between items-center">
                    {/* rider details */}
                    <div>
                      <Heading
                        heading={sos.userName}
                        subtitle={`Rider ID: ${sos.userId}`}
                        sm
                        className="capitalize"
                      />
                      <div className="flex items-center gap-1.5">
                        <Icon
                          icon="fa:warning"
                          color="#FFAC33"
                          height={16}
                          width={16}
                        />
                        <p className="text-sm text-[#FF4D4F]">
                          SOS Triggered {formatTriggerTime(sos.timestamp)}
                        </p>
                      </div>
                    </div>
                    {/* action buttons */}
                    <div className="flex items-center gap-4">
                      <button className="bg-[#21C788] px-6 py-3 rounded-full h-[46px] w-fit flex items-center justify-center gap-3 cursor-pointer hover:bg-[#15b879] transition-colors duration-300 ease-in-out">
                        <Icon icon={"fontisto:phone"} color="#FFF" />
                        <p className="text-sm font-semibold text-white">
                          Call Rider
                        </p>
                      </button>
                      <button
                        onClick={() => openMap(sos.id)}
                        className="bg-white border border-[#7C7979] px-6 py-3 rounded-full h-[46px] w-fit flex items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors duration-300 ease-in-out">
                        <Icon icon={"fa:send"} color="#7C7979" />
                        <p className="text-sm font-semibold text-[#7C7979]">
                          Track Location
                        </p>
                      </button>
                    </div>
                  </div>

                  {isMapOpen && selectedSosId === sos.id && (
                    <MapView
                      currentLocation={mapCoords.currentLocation}
                      destination={mapCoords.destination}
                      showPath={true}
                    />
                  )}
                  {/* grids */}
                  <div className="flex justify-between gap-4 h-[170px]">
                    {/* rider location */}
                    <div className="bg-[#F9FAFB] rounded-xl px-3 py-5 w-full space-y-4">
                      <div className="flex gap-2 items-center">
                        <Icon
                          icon={"famicons:location-sharp"}
                          color="#7C7979"
                          height={25}
                          width={25}
                        />
                        <p className="font-bold text-base text-[#7C7979]">
                          Rider Location
                        </p>
                      </div>
                      <p className="text-sm text-[#1F1F1F]">
                        {sos.location.address}
                      </p>

                      <div className="flex gap-2 items-center">
                        <Icon
                          icon={"fontisto:phone"}
                          color="#7C7979"
                          height={16}
                          width={16}
                        />
                        <p className="font-bold text-base text-[#7C7979]">
                          {getPhoneNumber(sos.userId)}
                        </p>
                      </div>
                    </div>

                    {/* current delivery */}
                    <div className="bg-[#EFF6FF] rounded-xl px-3 py-5 w-full space-y-1 text-sm text-[#7C7979]">
                      <div className="flex gap-2 items-center">
                        <Icon
                          icon={"basil:box-solid"}
                          color="#0095DA"
                          height={25}
                          width={25}
                        />
                        <p className="font-bold text-base primary">
                          Current Delivery
                        </p>
                      </div>
                      <p className="text-[#1F1F1F] font-bold text-base">
                        Order: N/A
                      </p>
                      <p>From: N/A</p>
                      <p>To: N/A</p>
                      <div className="flex gap-2 items-center">
                        <Icon
                          icon={"famicons:location-sharp"}
                          color="#FF4D4F"
                          height={16}
                          width={16}
                        />
                        <p className="ext-base text-[#7C7979]">N/A</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    content={isResolving ? "Resolving..." : "Mark Resolved"}
                    variant="success"
                    onClick={() => handleResolveAlert(sos.id)}
                    isDisabled={isResolving}
                  />
                </div>
              </CardComponent>
            );
          })
        )}
      </div>
    </Modal>
  );
}
