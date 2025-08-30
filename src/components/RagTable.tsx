'use client';

import { useState } from 'react';
import { useEditor } from '@/contexts/useEditor';

interface RagAssessment {
  safety: 'Red' | 'Amber' | 'Green';
  cost: 'Red' | 'Amber' | 'Green';
  justification?: string;
}

interface SystemAssessment {
  system: string;
  critical: RagAssessment;
  lenient: RagAssessment;
}



const getStatusColor = (status: 'Red' | 'Amber' | 'Green') => {
  switch (status) {
    case 'Red':
      return 'bg-red-500 text-white';
    case 'Amber':
      return 'bg-amber-500 text-white';
    case 'Green':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export default function RagTable() {
  const { ragTableData } = useEditor();
  const ragData = ragTableData;
  
  const [activeJustification, setActiveJustification] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{ text: string; x: number; y: number } | null>(null);

  // Convert RAG data to display format
  const displayData: SystemAssessment[] = ragData.map(row => ({
    system: row.system_name,
    critical: {
      safety: row.critical_safety,
      cost: row.critical_cost,
      justification: row.critical_justification
    },
    lenient: {
      safety: row.lenient_safety,
      cost: row.lenient_cost,
      justification: row.lenient_justification
    }
  }));

  // If no RAG data, show mock data for demonstration
  const finalData = displayData.length > 0 ? displayData : [
    {
      system: "Heating Cooling & Ventilation",
      critical: { 
        safety: "Amber" as const, 
        cost: "Amber" as const,
        justification: "Critical safety assessment: Amber due to aging equipment. Cost assessment: Amber due to maintenance requirements."
      },
      lenient: { 
        safety: "Green" as const, 
        cost: "Amber" as const,
        justification: "Lenient safety assessment: Green due to operational standards. Cost assessment: Amber due to maintenance needs."
      }
    },
    {
      system: "Cooling System / BMS",
      critical: { 
        safety: "Red" as const, 
        cost: "Amber" as const,
        justification: "Critical safety assessment: Red due to safety concerns. Cost assessment: Amber due to replacement needs."
      },
      lenient: { 
        safety: "Red" as const, 
        cost: "Amber" as const,
        justification: "Lenient safety assessment: Red due to operational risks. Cost assessment: Amber due to upgrade requirements."
      }
    },
    {
      system: "Electrical Supply & Distribution",
      critical: { 
        safety: "Amber" as const, 
        cost: "Green" as const,
        justification: "Critical safety assessment: Amber because of XYZ reason. Cost assessment: Green due to good condition."
      },
      lenient: { 
        safety: "Amber" as const, 
        cost: "Green" as const,
        justification: "Lenient safety assessment: Amber due to operational considerations. Cost assessment: Green due to efficient operation."
      }
    },
    {
      system: "Small Power, Lightning, Emergency Lighting & Lightning Control",
      critical: { 
        safety: "Amber" as const, 
        cost: "Amber" as const,
        justification: "Critical safety assessment: Amber due to system age. Cost assessment: Amber due to maintenance costs."
      },
      lenient: { 
        safety: "Green" as const, 
        cost: "Amber" as const,
        justification: "Lenient safety assessment: Green due to compliance standards. Cost assessment: Amber due to operational costs."
      }
    },
    {
      system: "Fire Detection and Alarm System",
      critical: { 
        safety: "Amber" as const, 
        cost: "Amber" as const,
        justification: "Critical safety assessment: Amber due to system reliability. Cost assessment: Amber due to maintenance requirements."
      },
      lenient: { 
        safety: "Green" as const, 
        cost: "Green" as const,
        justification: "Lenient safety assessment: Green due to operational standards. Cost assessment: Green due to efficient operation."
      }
    },
    {
      system: "Other Fire Protection Services",
      critical: { 
        safety: "Amber" as const, 
        cost: "Red" as const,
        justification: "Critical safety assessment: Amber due to system adequacy. Cost assessment: Red due to high replacement costs."
      },
      lenient: { 
        safety: "Amber" as const, 
        cost: "Amber" as const,
        justification: "Lenient safety assessment: Amber due to operational standards. Cost assessment: Amber due to maintenance costs."
      }
    },
    {
      system: "Public Health",
      critical: { 
        safety: "Amber" as const, 
        cost: "Amber" as const,
        justification: "Critical safety assessment: Amber due to system compliance. Cost assessment: Amber due to operational costs."
      },
      lenient: { 
        safety: "Green" as const, 
        cost: "Amber" as const,
        justification: "Lenient safety assessment: Green due to health standards. Cost assessment: Amber due to maintenance needs."
      }
    },
    {
      system: "Domestic Water Services",
      critical: { 
        safety: "Red" as const, 
        cost: "Amber" as const,
        justification: "Critical safety assessment: Red due to safety concerns. Cost assessment: Amber due to system maintenance."
      },
      lenient: { 
        safety: "Green" as const, 
        cost: "Amber" as const,
        justification: "Lenient safety assessment: Green due to operational standards. Cost assessment: Amber due to maintenance costs."
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* RAG Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
               <tr>
                 <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                   System
                 </th>
                 <th className="px-8 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                   Critical Assessment
                 </th>
                 <th className="px-8 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                   Lenient Assessment
                 </th>
               </tr>
               <tr>
                 <th className="px-8 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                   {/* Empty cell for System column */}
                 </th>
                 <th className="px-8 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                   <div className="grid grid-cols-2 gap-6">
                     <div>Safety</div>
                     <div>Cost</div>
                   </div>
                 </th>
                 <th className="px-8 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                   <div className="grid grid-cols-2 gap-6">
                     <div>Safety</div>
                     <div>Cost</div>
                   </div>
                 </th>
               </tr>
             </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {finalData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.system}
                  </td>
                                     <td className="px-8 py-6 whitespace-nowrap">
                     <div className="grid grid-cols-2 gap-6">
                       <div className="text-center">
                         <div 
                           className={`inline-flex items-center justify-center w-20 px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(item.critical.safety)} cursor-pointer transition-all duration-200 hover:scale-105`}
                           onMouseEnter={(e) => {
                             if (item.critical.justification) {
                               setHoveredItem({
                                 text: item.critical.justification,
                                 x: e.clientX,
                                 y: e.clientY
                               });
                             }
                           }}
                           onMouseLeave={() => setHoveredItem(null)}
                         >
                           {item.critical.safety}
                           {item.critical.justification && (
                             <span className="ml-1 text-xs">*</span>
                           )}
                         </div>
                       </div>
                       <div className="text-center">
                         <div 
                           className={`inline-flex items-center justify-center w-20 px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(item.critical.cost)} cursor-pointer transition-all duration-200 hover:scale-105`}
                           onMouseEnter={(e) => {
                             if (item.critical.justification) {
                               setHoveredItem({
                                 text: item.critical.justification,
                                 x: e.clientX,
                                 y: e.clientY
                               });
                             }
                           }}
                           onMouseLeave={() => setHoveredItem(null)}
                         >
                           {item.critical.cost}
                         </div>
                       </div>
                     </div>
                   </td>
                                     <td className="px-8 py-6 whitespace-nowrap">
                     <div className="grid grid-cols-2 gap-6">
                       <div className="text-center">
                         <div 
                           className={`inline-flex items-center justify-center w-20 px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(item.lenient.safety)} cursor-pointer transition-all duration-200 hover:scale-105`}
                           onMouseEnter={(e) => {
                             if (item.lenient.justification) {
                               setHoveredItem({
                                 text: item.lenient.justification,
                                 x: e.clientX,
                                 y: e.clientY
                               });
                             }
                           }}
                           onMouseLeave={() => setHoveredItem(null)}
                         >
                           {item.lenient.safety}
                         </div>
                       </div>
                       <div className="text-center">
                         <div 
                           className={`inline-flex items-center justify-center w-20 px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(item.lenient.cost)} cursor-pointer transition-all duration-200 hover:scale-105`}
                           onMouseEnter={(e) => {
                             if (item.lenient.justification) {
                               setHoveredItem({
                                 text: item.lenient.justification,
                                 x: e.clientX,
                                 y: e.clientY
                               });
                             }
                           }}
                           onMouseLeave={() => setHoveredItem(null)}
                         >
                           {item.lenient.cost}
                         </div>
                       </div>
                     </div>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredItem && (
        <div 
          className="fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            left: hoveredItem.x + 10,
            top: hoveredItem.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium mb-1">Justification:</div>
          <div>{hoveredItem.text}</div>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Justification Box */}
      {activeJustification && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justification
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={activeJustification}
            onChange={(e) => setActiveJustification(e.target.value)}
            placeholder="Enter justification for the assessment..."
          />
        </div>
      )}
    </div>
  );
}
