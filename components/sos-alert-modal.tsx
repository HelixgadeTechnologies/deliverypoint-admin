"use client";

import { sosData } from "@/lib/config/demo-data/sos";
import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import CardComponent from "@/ui/card-wrapper";
import Heading from "@/ui/text-heading";
import { useState } from "react";
import MapView from "@/ui/map";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SOSAlertModal({ isOpen, onClose }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [selectedSosId, setSelectedSosId] = useState<string | null>(null);

  const openMap = (sosId: string) => {
    setSelectedSosId(sosId);
    setIsMapOpen(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="876px">
      <div className="flex items-center justify-between">
        <h1 className="text-[#1F1F1F] font-extrabold text-[32px]">
          SOS Alert({sosData.length})
        </h1>
        <div
          onClick={onClose}
          className="size-12 bg-[#F8F9FA99] rounded-[20px] p-2 flex justify-center items-center cursor-pointer"
        >
          <Icon icon={"mingcute:close-line"} height={25} width={25} />
        </div>
      </div>

      {/* alert list */}
      <div className="space-y-5 h-[550px] overflow-y-auto">
        {sosData.map((sos, index) => (
          <CardComponent key={index}>
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
                  <h3 className="text-xl font-bold">Emergency SOS Alerts</h3>
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
                    heading={sos.rider}
                    subtitle={`Rider ID: ${sos.id}`}
                    sm
                  />
                  <div className="flex items-center gap-1.5">
                    <Icon
                      icon="fa:warning"
                      color="#FFAC33"
                      height={16}
                      width={16}
                    />
                    <p className="text-sm text-[#FF4D4F]">
                      SOS Triggered {sos.triggerTime}
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
                    className="bg-white border border-[#7C7979] px-6 py-3 rounded-full h-[46px] w-fit flex items-center justify-center gap-3 cursor-pointer hover:bg-blue-50 transition-colors duration-300 ease-in-out"
                  >
                    <Icon icon={"fa:send"} color="#7C7979" />
                    <p className="text-sm font-semibold text-[#7C7979]">
                      Track Location
                    </p>
                  </button>
                </div>
              </div>

              {isMapOpen && selectedSosId === sos.id && (
                <MapView
                  currentLocation={{
                    label: "Current Location",
                    description: "Approaching GRA Junction",
                    x: 10,
                    y: 40,
                  }}
                  destination={{
                    label: "Destination",
                    x: 90,
                    y: 50,
                  }}
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
                  <p className="text-sm text-[#1F1F1F]">{sos.location}</p>

                  <div className="flex gap-2 items-center">
                    <Icon
                      icon={"fontisto:phone"}
                      color="#7C7979"
                      height={16}
                      width={16}
                    />
                    <p className="font-bold text-base text-[#7C7979]">
                      {sos.contactNumber}
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
                    Order: {sos.currentDelivery}
                  </p>
                  <p>From: {sos.from}</p>
                  <p>To: {sos.to}</p>
                  <div className="flex gap-2 items-center">
                    <Icon
                      icon={"famicons:location-sharp"}
                      color="#FF4D4F"
                      height={16}
                      width={16}
                    />
                    <p className="ext-base text-[#7C7979]">
                      {sos.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardComponent>
        ))}
      </div>
    </Modal>
  );
}
