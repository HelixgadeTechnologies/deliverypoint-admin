import { Icon } from "@iconify/react";
import { useState } from "react";
import Modal from "./popup-modal";
import Image from "next/image";
import Heading from "./text-heading";
import Button from "./button";
import { formatFileSize } from "@/utils/files-utility";

type Props = {
  title: string;
  type: string;
  size: string | number;
  uploadDate: string;
  docLink?: string;
};

export default function DocumentPreview({
  title,
  type,
  size,
  uploadDate,
  docLink
}: Props) {
  const [isPreviewed, setIsPreviewed] = useState(false);
  return (
    <>
      <div className="bg-white h-20 rounded-lg p-4 flex gap-2.5 items-center relative shadow">
        <div className="p-2 bg-[#DBEAFE] rounded-lg flex justify-center items-center size-[34px]">
          <Icon
            icon={"solar:camera-linear"}
            color="#0095DA"
            height={18}
            width={18}
          />
        </div>
        <div>
          <h5 className="text-sm text-[#1E1E1E] font-normal truncate w-[70%]">{title}</h5>
          <div className="text-xs text-[#7C7979] space-x-1">
            <span>{type}</span>
            <span>•</span>
            <span>{formatFileSize(typeof size === 'string' ? parseInt(size, 10) : size)}</span>
            <span>•</span>
            <span>Uploaded {uploadDate}</span>
          </div>
        </div>
        <p
          onClick={() => setIsPreviewed(true)}
          className="text-sm text-[#0095DA] absolute top-4 right-4 cursor-pointer"
        >
          View
        </p>
      </div>

      <Modal isOpen={isPreviewed} onClose={() => setIsPreviewed(false)}>
          <Heading heading={title} sm className="truncate w-[90%]" />
          <div
            onClick={() => setIsPreviewed(false)}
            className="absolute top-5 right-5 size-[34px] rounded-full flex justify-center items-center bg-[#F8F9FA99]"
          >
            <Icon icon={"mingcute:close-line"} height={16} width={16} />
          </div>
        <Image
          src={docLink || "/liscense-template.svg"}
          alt="Liscense Image"
          height={200}
          width={300}
          className="object-cover mb-4 w-full"
        />
        <Button content="Close" onClick={() => setIsPreviewed(false)}/>
      </Modal>
    </>
  );
}
