"use client";

import Heading from "./text-heading";
import { Icon } from "@iconify/react";

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
  tableData = [] as T[],
  renderRow,
  heading,
  subtitle,
  children,
}: TableProps<T>) {
  return (
    <div>
      {/* heading */}
      <div className="bg-white py-4 px-3 md:px-6 rounded-t-lg space-y-4">
        <Heading heading={heading} subtitle={subtitle} sm />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          {children}
        </div>
        <div className="w-full h-fit overflow-auto md:overflow-visible rounded-b-lg">
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
              {Array.isArray(tableData) && tableData.length > 0 ? (
                tableData.map((row, i) => {
                  return (
                    <tr
                      key={i}
                      className="h-[88px] text-[#1F1F1F] bg-white border-b border-[#E5E7EB]">
                      {renderRow(row)}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tableHead.length} className="py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Icon
                      icon={"iconoir:glass-empty"}
                      height={60}
                      width={60}
                      color="gray"
                      />
                      <p className="text-gray-600 text-xl font-bold leading-tight tracking-[-0.015em]">
                        No Items to Display
                      </p>
                      <p className="text-gray-500 text-base font-normal leading-normal w-2/4 text-center">
                        Refresh the data to see if anything new has appeared.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
