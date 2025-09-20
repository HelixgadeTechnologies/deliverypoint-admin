"use client";

import Heading from "./text-heading";

type TableProps<T> = {
  tableHead: Array<string>;
  tableData?: T[];
  renderRow: (row: T) => React.ReactNode;
  heading: string;
  subtitle: string;
  children?: React.ReactNode;
};

export default function Table<T>({
  tableHead,
  tableData = [],
  renderRow,
  heading,
  subtitle,
  children,
}: TableProps<T>) {
  return (
    <div>
      {/* heading */}
      <div className="bg-white py-4 px-6 rounded-t-lg space-y-4">
        <Heading heading={heading} subtitle={subtitle} sm />
        <div className="flex items-center gap-2">{children}</div>
        <div className="w-full h-fit overflow-visible rounded-b-lg">
            <table className="min-w-full text-sm text-left">
            <thead>
                <tr className="bg-[#E4E9EF33] h-[60px] text-[#7C7979] font-normal text-sm">
                {tableHead.map((head, index) => (
                    <th key={index} className={`px-6 py-3`}>
                    {head}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody>
                {tableData.map((row, i) => {
                return (
                    <tr
                    key={i}
                    className="h-[88px] text-[#1F1F1F] bg-white border-b border-[#E5E7EB]"
                    >
                    {renderRow(row)}
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
