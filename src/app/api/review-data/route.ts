import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data based on the CSV structure
  const reviewData = [
    {
      section_name: "Page 4, Introduction (Section 1)",
      original_text: "The is a office building covering ground to 6th floors that are occupiable.",
      proposed_revision: "The property is an office building comprising ground to sixth floors, all of which are occupiable.",
      justification: "This revision corrects the grammatical error 'The is a' to 'The property is an', changes '6th' to 'sixth' for formal consistency, and replaces 'covering' with the more precise 'comprising'. The phrase 'all of which are occupiable' improves clarity and resolves a potential consistency issue with floor counts mentioned elsewhere in the report.",
      edit_type: "Grammar, Clarity, Internal Consistency, Professionalism & Presentation"
    },
    {
      section_name: "Page 5, Executive Summary (Section 2)",
      original_text: "The building is provided with an on site utility transformer and meter within an external enclosure as is the gas supply. Lightning protection is provided to the structure as well as a fire alarm system.",
      proposed_revision: "The building is provided with an on-site utility transformer and meter within an external enclosure, as is the gas supply. Lightning protection is provided to the structure as well as a fire alarm system.",
      justification: "Hyphenated 'on-site' as it is used as a compound adjective. Added a comma before 'as is' for improved readability and grammatical structure.",
      edit_type: "Grammar, Formatting"
    },
    {
      section_name: "Page 8, Survey Report (Section 3)",
      original_text: "The heating Dating back to construction circa 1980 two of the original three Hoval sectional boilers incorporating pressure jet gas burners although decommissioned are still in situ.",
      proposed_revision: "Regarding the heating system, two of the original three Hoval sectional boilers (circa 1980) are still in situ, although decommissioned.",
      justification: "This revision completely restructures the original text to correct significant grammatical errors and improve clarity. It clearly separates the status of the old boilers from the description of the new system, uses correct hyphenation for 'three-boiler', and presents the technical information in a logical, professional manner.",
      edit_type: "Clarity, Grammar, Professionalism & Presentation, Technical Accuracy"
    },
    {
      section_name: "Page 9, Survey Report (Section 3)",
      original_text: "The secondary circulation for the heating serving the roof void Air Handling units and building wide Fan Coil units and a now decommissioned Domestic Hot water cylinder.",
      proposed_revision: "The secondary circulation for heating, which serves the roof void Air Handling Units, building-wide Fan Coil Units and a now decommissioned Domestic Hot Water cylinder.",
      justification: "This synthesised revision corrects the original sentence fragment and fixes the subject-verb agreement ('circulation... appears'). It enhances technical clarity by spelling out 'Direct-On-Line (DOL)', uses consistent capitalisation for defined systems, and applies correct hyphenation for 'building-wide' and 'belt-driven', improving overall professionalism and accuracy.",
      edit_type: "Grammar, Clarity, Technical Accuracy, Professionalism & Presentation"
    },
    {
      section_name: "Page 10, Survey Report (Section 3)",
      original_text: "A building wide Fire alarm panel and system is provided located within the data room adjacent to reception. with a repeater panel within the entrance lobby.",
      proposed_revision: "A building-wide fire alarm panel and system are located within the data room adjacent to reception, with a repeater panel in the entrance lobby.",
      justification: "This synthesised revision combines multiple fixes: hyphenates 'building-wide', corrects subject-verb agreement ('panel and system are'), improves sentence structure and punctuation, and uses the more formal 'indicated' instead of 'shown'. This results in a clearer and more professional statement.",
      edit_type: "Grammar, Professionalism & Presentation, Formatting"
    },
    // RAG Data for testing
    {
      section_name: "Page 6, Executive Summary (Section 2)",
      original_text: "-",
      proposed_revision: "Heating, Cooling & Ventilation: Safety change to Green, Operation / Cost change to Amber",
      justification: "Safety is Green because new boilers are in place and working, radiators are in 'fair condition', and chillers are also in 'fair condition' (Page 8). While water quality certification was not available, it's only 'possible' that it's poor (Page 5), not a confirmed direct safety hazard. Operation/Cost is Amber due to old 'Fan coil units' (circa 1980) having a 'history of failures' which will incur 'retrofit and modify' costs (Page 8), and the phased-out R404A refrigerant gases will lead to increased future costs (Page 5).",
      edit_type: "RAG suggestion (lenient)"
    },
    {
      section_name: "Page 7, Survey Report (Section 3)",
      original_text: "-",
      proposed_revision: "Cooling System / BMS: Safety change to Red, Operation / Cost change to Amber",
      justification: "Safety is Red due to critical system failures and potential hazards. Operation/Cost is Amber due to replacement needs and maintenance requirements.",
      edit_type: "RAG suggestion (critical)"
    },
    {
      section_name: "Page 8, Survey Report (Section 3)",
      original_text: "-",
      proposed_revision: "Electrical Supply & Distribution: Safety change to Amber, Operation / Cost change to Green",
      justification: "Safety is Amber due to aging infrastructure concerns. Operation/Cost is Green due to good condition and efficient operation.",
      edit_type: "RAG suggestion (lenient)"
    }
  ];

  return NextResponse.json({ data: reviewData });
}
