'use client';

import { useState } from 'react';

export default function ExecutiveSummary() {
  const [selectedVersion, setSelectedVersion] = useState('concise');

  // Original executive summary from the CSV data
  const originalSummary = `The property is set within its own grounds and consists of six office floors from ground to sixth, a plant deck is on the 7th floor that facilitates the maintenance team offices. The building is provided with an on site utility transformer and meter within an external enclosure as is the gas supply. Lightning protection is provided to the structure as well as a fire alarm system.

The electrical sub meter appears to meet the requirements of the Measuring Instruments Directive (MID) and are suitable for billing purposes.

We have sought assurance from the Property maintenance team that there has been no history of leaks with the closed water systems within the Building.

The refrigerant gases are hydrofluorocarbons (HFCs), manufacturers are restricted in quantities they can produce and place on the market and it is inevitable that availability will decrease and prices will rise. Legislation is in place to phase out refrigerants with a high Global Warming Potential (GWP). Since January 2020 gas R404A is being phased out (widely used in commercial refrigeration, cold rooms etc.).

Chemical and microbiological certification for the closed loop systems were not available for review. Therefore the water quality of the closed loop systems could not be ascertained. You are therefore advised that it is possible that the closed systems water quality is poor and that costs may be incurred to return to acceptable standards.`;

  // AI-generated versions based on the CSV data
  const aiVersions = {
    concise: {
      title: "AI Summary - Concise Version",
      content: `The asset comprises six office floors (ground to sixth) with a 7th-floor plant deck supporting maintenance operations. Essential utilities, including the transformer, metering, gas supply, lightning protection, and fire alarm system, are present on-site; however, their condition and compliance must be rigorously assessed to identify potential liabilities.

The electrical sub-metering infrastructure appears compliant with the Measuring Instruments Directive (MID), indicating functionality for billing; however, a comprehensive review of calibration records is recommended to confirm ongoing accuracy and prevent future disputes.

While the Property maintenance team has verbally asserted no historical leaks in closed water systems, this remains unverified. The absence of documented evidence presents an inherent risk, and the purchaser should factor in potential liabilities associated with undocumented system integrity.

A significant future capital liability exists due to the prevalence of hydrofluorocarbon (HFC) refrigerants within the systems. Restricted production and a mandated phase-down of high Global Warming Potential (GWP) refrigerants, including R404A (phased out since January 2020), will inevitably lead to decreased availability and substantial price increases. The purchaser will inherit a direct exposure to significant replacement or retrofit costs in the near to medium term.

A critical documentation gap and potential operational risk were identified. The absence of chemical and microbiological certification for closed loop systems precludes any assessment of water quality. This directly indicates a potential for poor water quality, which could necessitate significant, unbudgeted remediation costs to achieve acceptable operational standards and regulatory compliance.`
    },
    buyer: {
      title: "AI Summary - Pre-Acquisition Due Diligence (For the Buyer)",
      content: `The property's fundamental infrastructure includes six office floors, a 7th-floor plant deck, on-site utility transformer, external metering, gas supply, lightning protection, and a fire alarm system. The operational status and compliance of these critical systems directly influence the asset's overall integrity and operational stability.

The electrical sub-metering system indicates compliance with the Measuring Instruments Directive (MID), thereby supporting verifiable billing practices. This contributes positively to the asset's financial transparency and operational consistency.

Reliance on anecdotal assurance from the Property maintenance team regarding the absence of historical leaks within closed water systems represents an unquantified risk. The lack of verifiable documentation prevents a definitive assessment of asset integrity concerning these critical systems.

The presence of hydrofluorocarbon (HFC) refrigerants introduces a discernible financial and regulatory risk to the asset. Legislative restrictions on HFC production and market placement, coupled with the ongoing phase-out of high GWP refrigerants such as R404A (since January 2020), will foreseeably impact operational expenditure and equipment viability. This necessitates a proactive assessment of long-term capital exposure related to essential cooling infrastructure.

A material compliance and operational risk is presented by the unavailability of chemical and microbiological certification for closed loop systems. This deficiency prevents an objective assessment of water quality, raising concerns regarding potential degradation that could necessitate costly corrective measures and impact the long-term operational viability of associated plant.`
    },
    lender: {
      title: "AI Summary - Investment and Financing Due Diligence (For the Lender)",
      content: `The property's fundamental infrastructure includes six office floors, a 7th-floor plant deck, on-site utility transformer, external metering, gas supply, lightning protection, and a fire alarm system. The operational status and compliance of these critical systems directly influence the asset's overall integrity and operational stability.

The electrical sub-metering system indicates compliance with the Measuring Instruments Directive (MID), thereby supporting verifiable billing practices. This contributes positively to the asset's financial transparency and operational consistency.

Reliance on anecdotal assurance from the Property maintenance team regarding the absence of historical leaks within closed water systems represents an unquantified risk. The lack of verifiable documentation prevents a definitive assessment of asset integrity concerning these critical systems.

The presence of hydrofluorocarbon (HFC) refrigerants introduces a discernible financial and regulatory risk to the asset. Legislative restrictions on HFC production and market placement, coupled with the ongoing phase-out of high GWP refrigerants such as R404A (since January 2020), will foreseeably impact operational expenditure and equipment viability. This necessitates a proactive assessment of long-term capital exposure related to essential cooling infrastructure.

A material compliance and operational risk is presented by the unavailability of chemical and microbiological certification for closed loop systems. This deficiency prevents an objective assessment of water quality, raising concerns regarding potential degradation that could necessitate costly corrective measures and impact the long-term operational viability of associated plant.`
    },
    owner: {
      title: "AI Summary - Asset Management & Strategic Planning (For the Current Owner)",
      content: `The property currently provides six office floors, serviced by a 7th-floor plant deck that accommodates maintenance facilities. Key infrastructure, including the utility transformer, metering, gas supply, lightning protection, and fire alarm system, is installed on-site. Ongoing maintenance programs are essential to ensure the continued reliability and compliance of these services.

The electrical sub-metering systems are noted to meet MID requirements, facilitating accurate billing. We recommend regular calibration checks to maintain their integrity and optimize operational efficiency.

The Property maintenance team has advised that no history of leaks has been observed in the closed water systems. We recommend reviewing available historical maintenance logs and considering a system integrity check to confirm this and inform future preventative maintenance.

The existing cooling systems utilize hydrofluorocarbon (HFC) refrigerants, which are subject to regulatory phase-down and increasing cost due to production restrictions. Notably, R404A has been phased out since January 2020. We advise developing a strategic plan for the long-term replacement or conversion of this equipment to mitigate future operational costs and ensure compliance with evolving environmental legislation.

Chemical and microbiological certification for the closed loop systems were not provided for review, preventing an assessment of current water quality. To ensure optimal system performance and mitigate potential future issues, we recommend conducting immediate testing and implementing any necessary remediation to bring water quality to acceptable standards, and establishing a regular monitoring program.`
    },
    seller: {
      title: "AI Summary - Vendor Due Diligence (For the Seller)",
      content: `The property encompasses six office floors, complemented by a 7th-floor plant deck, offering comprehensive facilities for maintenance operations. The property benefits from on-site utility infrastructure, including a transformer, metering, and gas supply, along with comprehensive lightning protection and a fire alarm system, all contributing to a robust operational profile.

The electrical sub-metering system is compliant with the Measuring Instruments Directive (MID), which provides accurate and auditable billing, a key benefit for future tenants and owners.

The Property maintenance team reports no history of leaks within the closed water systems, indicating a well-maintained operational history for this critical infrastructure.

While the current cooling systems utilize hydrofluorocarbon (HFC) refrigerants, it is important to note the industry trend towards phasing out high GWP refrigerants like R404A (phased out since January 2020). This presents an opportunity for a future owner to upgrade to more environmentally sustainable and modern cooling technologies, potentially enhancing long-term operational efficiency.

Currently, chemical and microbiological certification for the closed loop systems is unavailable. To provide a prospective purchaser with complete transparency and to affirm the asset's condition, we recommend commissioning these certifications. Should any remediation be required, addressing this proactively will eliminate a potential point of negotiation during due diligence.`
    }
  };

  const selectedContent = aiVersions[selectedVersion as keyof typeof aiVersions];

  return (
    <div className="space-y-6">
      {/* Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Original Summary - Left Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-[var(--color-primary)] px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Original Summary</h3>
          </div>
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {originalSummary}
              </p>
            </div>
          </div>
        </div>

        {/* AI Generated Summary - Right Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-[var(--color-primary)] px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Revised Summary</h3>
          </div>
          <div className="p-6">
            {/* Dropdown inside the right card */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select AI Summary Version
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
              >
                <option value="concise">AI Summary - Concise Version</option>
                <option value="buyer">Pre-Acquisition Due Diligence (For the Buyer)</option>
                <option value="lender">Investment and Financing Due Diligence (For the Lender)</option>
                <option value="owner">Asset Management & Strategic Planning (For the Current Owner)</option>
                <option value="seller">Vendor Due Diligence (For the Seller)</option>
              </select>
            </div>
            
            {/* AI Generated Content */}
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {selectedContent.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Button */}
      <div className="text-center pt-6">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
          Click to Preview
        </button>
      </div>
    </div>
  );
}
