import type { CompoundProfile } from "@/lib/compoundProfileTypes";

export const COMPOUND_PROFILES: CompoundProfile[] = [
  {
    id: "core-concepts",
    title: "Steroid Family Tree",
    route: "concept",
    tagline: "Core concepts — how injectables and orals are classified by structure and metabolism.",
    compoundIds: [],
    sections: [
      {
        heading: "Testosterone Derivatives",
        body: "Aromatize into estrogen. Can be 5-alpha reduced into DHT.",
      },
      {
        heading: "Dihydrotestosterone (DHT) Derivatives",
        body: "Do not aromatize. Largely cannot be 5-alpha reduced (with some minor exceptions, such as Boldenone converting to DHB in small amounts). Some possess inherent anti-estrogenic properties (e.g., Primo and EQ).",
      },
      {
        heading: "19-Nortestosterone (Nandrolone) Derivatives",
        body: "Aromatize into a very weak estrogen. Can be 5-alpha reduced into a much weaker, less androgenic compound (notably Nandrolone → DHN). They are progestins by nature, which can elevate prolactin and increase gyno risk by sensitizing estrogen receptors.",
      },
    ],
  },
  {
    id: "testosterone",
    title: "Testosterone",
    aliases: ["Test E", "Test C", "Test P", "Sustanon"],
    route: "injectable",
    tagline: "The foundational anabolic steroid and the reference compound for all others.",
    compoundIds: ["test-e", "test-c", "test-p", "test-sus", "test-trt", "test-tne"],
    sections: [
      {
        heading: "How to Use / Receptors",
        body: "Anabolic Androgenic Steroid (AAS). Binds directly to androgen receptors (AR) throughout the body. It is the primary male sex hormone.",
      },
      { heading: "Aromatization?", body: "Yes. It serves as the main substrate for the aromatase enzyme, converting to estradiol (E2). Conversion rate is highly individual and strongly influenced by body fat percentage." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Hormones", body: "Strongly suppresses LH and FSH, leading to shutdown of natural production. Lowers SHBG, increasing free testosterone, estradiol, and DHT." },
          { heading: "Lipids", body: "Commonly worsens cholesterol — raises LDL and lowers HDL." },
          { heading: "Cardiovascular", body: "Can increase hematocrit (RBC count), usually manageable with proper hydration, and raises blood pressure (largely estrogen-mediated)." },
          { heading: "Other", body: "Slight potential for elevated liver enzymes (rare with injectables) and increased PSA." },
          { heading: "TSH", body: "All AAS lower TSH; testosterone does so notably, which can elevate free T4 and T3 on bloodwork." },
          { heading: "DHEA/Pregnanolone", body: "Long-term use (including TRT) reduces neurosteroid production, often contributing to libido problems. Supplementation with DHEA/pregnenolone or HCG can help." },
        ],
      },
      {
        heading: "Dosage Ranges",
        list: [
          "TRT/Replacement: 70 – 250 mg/week",
          "Beginner Cycle: 300 – 500 mg/week",
          "Intermediate/Advanced: 500 – 1000+ mg/week",
        ],
      },
      { heading: "General Safety Profile", body: "The most researched and well-understood AAS. Essential for normal physiological function and used as the base in nearly all cycles. Safety is entirely dose-dependent." },
      {
        heading: "Odd/Unique Effects",
        list: [
          "All other steroids are generally evaluated relative to testosterone as the test base.",
          "Different esters (Enanthate, Cypionate, Propionate) only alter release timing, not core effects. Enanthate is suitable for most users. Some prefer daily Propionate for closer alignment with natural secretion.",
          "Note: The ester-cleaving enzyme for Cypionate may be rate-limited, potentially resulting in lower serum levels than Enanthate at high doses.",
        ],
      },
    ],
  },
  {
    id: "boldenone",
    title: "Boldenone (Equipoise / EQ)",
    route: "injectable",
    tagline: "A slow-acting, mild bulking agent valued for its effects on endurance and vascularity.",
    compoundIds: ["eq", "eq-c", "eq-a"],
    sections: [
      { heading: "How to Use / Receptors", body: "Testosterone derivative. Binds to the AR. Due to its long ester, it requires significant time to reach full saturation. Best used from the beginning of a cycle or in extended cycles (16–20+ weeks)." },
      { heading: "Aromatization?", body: "Yes, but weakly. It converts primarily to synthetic estrone rather than estradiol. Several metabolites act as aromatase inhibitors, often lowering serum E2 when dosed 1:1 with testosterone." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Cardiovascular", body: "Notably increases hematocrit and red blood cell count. Can negatively affect cholesterol." },
          { heading: "Hormones", body: "Exerts strong downward pressure on estrogen levels for most users." },
        ],
      },
      { heading: "Dosage Ranges", list: ["Beginner/Intermediate: 200 – 600 mg/week", "Advanced: 600 – 1000 mg/week"] },
      { heading: "General Safety Profile", body: "Generally considered mild, though the rise in hematocrit poses a meaningful cardiovascular risk that requires monitoring. SGLT2 inhibitors are commonly used for kidney protection. Low-dose aspirin may help with clotting risk." },
      { heading: "Odd/Unique Effects", list: ["Significantly increases appetite.", "Produces hard, vascular gains that develop more slowly.", "The long Undecylenate ester makes shorter cycles suboptimal."] },
    ],
  },
  {
    id: "dhb",
    title: "DHB (Dihydroboldenone)",
    route: "injectable",
    tagline: "A potent, non-aromatizing anabolic derived from Boldenone.",
    compoundIds: ["dhb"],
    sections: [
      { heading: "Aromatization?", body: "No." },
      { heading: "5-alpha Reduction?", body: "No (already 5-alpha reduced)." },
      { heading: "Opinion", body: "This steroid is complete garbage. Avoid it." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Hormones", body: "Suppresses natural testosterone production. No estrogen conversion." },
          { heading: "Lipids", body: "Likely negative impact on cholesterol (raise LDL, lower HDL), possibly milder than many other AAS." },
          { heading: "Cardiovascular", body: "May mildly increase blood pressure." },
          { heading: "Other", body: "Potential liver stress (possibly related to carrier). Prostate effects similar to Testosterone Propionate." },
        ],
      },
      { heading: "Dosage Ranges", list: ["300 – 1000+ mg/week"] },
      { heading: "General Safety Profile", body: "Strong anabolic with relatively mild side effects aside from low-estrogen symptoms and frequent post-injection pain (PIP). Brewing in GSO often reduces PIP." },
      { heading: "Odd/Unique Effects", body: "Chemically analogous to Primobolan without the 1-methyl group, rendering it ineffective orally. It relates to Boldenone as DHT relates to Testosterone." },
    ],
  },
  {
    id: "nandrolone",
    title: "Nandrolone (Deca / NPP)",
    route: "injectable",
    tagline: "A classic bulking steroid prized for joint relief and robust anabolic properties.",
    compoundIds: ["deca", "deca-d", "npp"],
    sections: [
      { heading: "How to Use / Receptors", body: "19-Nortestosterone derivative. Binds to the AR with notable progestogenic activity." },
      { heading: "Aromatization?", body: "Very weak." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Lipids", body: "Negatively affects cholesterol." },
          { heading: "Cardiovascular", body: "Increases blood pressure." },
          { heading: "Hormones", body: "Can elevate prolactin significantly, especially alongside higher estrogen (Deca Dick risk)." },
        ],
      },
      { heading: "Dosage Ranges", list: ["Deca (Long Ester): 400 – 1000 mg/week", "NPP (Short Ester): 200 – 500 mg/week"] },
      { heading: "General Safety Profile", body: "Relatively mild on the liver for an injectable, but raises concerns around prolactin, lipids, and potential cardiac enlargement (particularly with HGH). Not a compound I recommend." },
      {
        heading: "Odd/Unique Effects",
        list: [
          "Provides excellent joint lubrication and pain relief.",
          "Can cause notable water retention at higher doses.",
          "Finasteride/Dutasteride increases hair loss risk with Nandrolone.",
          "Extremely suppressive with a very long half-life, making PCT difficult.",
        ],
      },
    ],
  },
  {
    id: "trenbolone",
    title: "Trenbolone (Tren)",
    route: "injectable",
    tagline: "The most powerful and infamous steroid for muscle growth and fat loss, accompanied by harsh side effects.",
    compoundIds: ["tren-a", "tren-e"],
    sections: [
      { heading: "How to Use / Receptors", body: "19-Nortestosterone derivative with exceptionally high androgen receptor affinity and progestogenic activity." },
      { heading: "Aromatization?", body: "No. Gyno risk persists through prolactin pathways." },
      { heading: "Blood Markers Impacted", body: "Highly disruptive across nearly all markers — severely lowers HDL, elevates blood pressure and heart rate, stresses kidneys and liver." },
      { heading: "Dosage Ranges", list: ["Beginner: 30 – 75 mg/week (often ideal)", "Advanced: 75 – 300 mg/week", "Very High: 500+ mg/week (strongly advised against)"] },
      { heading: "General Safety Profile", body: "Poor. Extremely toxic from cardiovascular, lipid, and neurological standpoints. May accelerate amyloid plaque buildup." },
      {
        heading: "Odd/Unique Effects",
        list: [
          "Tren Cough immediately after injection.",
          "Night sweats, insomnia, and anxiety (Tren Brain).",
          "Significant impairment of cardiovascular endurance.",
          "Heightened aggression, jealousy, and libido fluctuations.",
          "Strongly boosts IGF-1 and satellite cell activity.",
        ],
      },
      { heading: "Recommended Support", body: "Melatonin, Cardarine/PPAR agonists, Glutathione or NAC, anti-inflammatory diet, thyroid support as needed." },
    ],
  },
  {
    id: "masteron",
    title: "Masteron (Drostanolone)",
    route: "injectable",
    tagline: "A DHT-derived hardening and anti-estrogenic agent primarily used pre-contest for aesthetic enhancement.",
    compoundIds: ["mast-e", "mast-p"],
    sections: [
      { heading: "How to Use / Receptors", body: "DHT derivative. Binds to the AR. Minimal anabolic effect until very high doses (~1g/week)." },
      { heading: "Aromatization?", body: "No. Functions somewhat like a SERM by competing for co-factors, limiting estrogenic effects without necessarily lowering serum E2." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Lipids", body: "Can negatively impact cholesterol." },
          { heading: "Hormones", body: "Exhibits anti-estrogenic properties in many users." },
        ],
      },
      { heading: "Dosage Ranges", body: "Highly variable; often run 1:1 with Testosterone for cosmetic benefits." },
      { heading: "General Safety Profile", body: "Relatively safe organ-wise, but strongly androgenic and harsh on the hairline." },
      {
        heading: "Odd/Unique Effects",
        list: [
          "Delivers a dry, hard, vascular appearance.",
          "Ineffective against hair loss with 5-AR inhibitors (already DHT-derived).",
          "Best results at low body fat (<12%).",
          "Promotes mineral excretion affecting water storage.",
        ],
      },
    ],
  },
  {
    id: "primobolan",
    title: "Primobolan (Methenolone)",
    route: "injectable",
    tagline: "A mild, well-tolerated DHT-derived steroid favored for safety and lean mass preservation. Also mildly anti-estrogenic.",
    compoundIds: ["primo-e"],
    sections: [
      { heading: "How to Use / Receptors", body: "DHT derivative. Binds to the AR." },
      { heading: "Aromatization?", body: "No. Metabolites contribute to lowering serum E2 (often 25-50% when run 1:1 with Testosterone)." },
      { heading: "Blood Markers Impacted", body: "One of the most benign AAS with minimal impact on lipids, liver, or other markers at moderate doses." },
      { heading: "Dosage Ranges", list: ["Men (Injectable): 200 – 1000 mg/week"] },
      { heading: "Note", body: "Roughly as anabolic as Testosterone mg-for-mg. A 1:1 ratio with Test often yields better aesthetics with less need for AI." },
      { heading: "General Safety Profile", body: "Excellent. Frequently regarded as one of the safest AAS, though expensive and commonly counterfeited." },
      { heading: "Odd/Unique Effects", list: ["Slow, high-quality lean gains with virtually no water retention.", "Limited impact on strength.", "Popular for cruising or cutting phases."] },
    ],
  },
  {
    id: "ment",
    title: "Ment (Trestolone)",
    route: "injectable",
    tagline: "A highly potent synthetic 19-Nor steroid with strong anabolic and progestogenic effects. Previously studied as male birth control and TRT alternative.",
    compoundIds: ["ment"],
    sections: [
      { heading: "How to Use / Receptors", body: "Potent 19-Nor derivative. Binds to AR with strong progestogenic activity." },
      { heading: "Aromatization?", body: "No direct aromatization, but converts to a potent methyl-estrogen via alternative pathways (AIs like Arimidex ineffective)." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Cardiovascular", body: "Often causes notable blood pressure increases." },
          { heading: "Lipids", body: "Affected like most AAS." },
          { heading: "Hormones", body: "Extremely suppressive." },
        ],
      },
      { heading: "Dosage Ranges", list: ["Low: 10 – 40 mg/week", "Moderate: 35 – 140 mg/week", "High: 140+ mg/week"] },
      { heading: "General Safety Profile", body: "Potent but understudied long-term. Complex side effect management due to unique estrogenic and progestogenic activity." },
      { heading: "Odd/Unique Effects", list: ["High risk of gynecomastia (Gyno in a Bottle).", "Neurotoxic without a Testosterone base.", "Extremely suppressive of natural production and fertility."] },
    ],
  },
  {
    id: "anadrol",
    title: "Anadrol (Oxymetholone)",
    route: "oral",
    tagline: "An extremely potent mass and strength builder known for rapid effects and high toxicity.",
    compoundIds: ["anadrol"],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral DHT-derived. Binds to AR with additional non-AR effects." },
      { heading: "Aromatization?", body: "No, but highly estrogenic via other mechanisms (e.g., cortisol-related), causing significant water retention and gyno risk." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Liver", body: "Highly hepatotoxic — dramatically raises ALT/AST." },
          { heading: "Cardiovascular", body: "Severe blood pressure spikes and cholesterol disruption." },
          { heading: "Other", body: "Can greatly increase red blood cell count." },
        ],
      },
      { heading: "Dosage Ranges", list: ["25 – 150 mg/day (4-8 weeks max; little benefit beyond 150mg)"] },
      { heading: "General Safety Profile", body: "Poor. One of the harshest orals. Requires strong liver support and short cycles." },
      { heading: "Odd/Unique Effects", list: ["Rapid strength and mass gains with a puffy, watery look.", "Often causes appetite suppression and GI distress."] },
    ],
  },
  {
    id: "cheque-drops",
    title: "Cheque Drops (Mibolerone)",
    route: "oral",
    tagline: "An ultra-potent oral androgen used for pre-event aggression. Veterinary origin for suppressing estrus in dogs.",
    compoundIds: [],
    sections: [
      { heading: "How to Use / Receptors", body: "17α-alkylated, 7α-methylated nandrolone derivative. Highly AR-active and mostly unbound in blood." },
      { heading: "Aromatization?", body: "No." },
      { heading: "Progestogenic?", body: "Yes." },
      { heading: "5-alpha Reduction?", body: "No." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Liver", body: "Extremely hepatotoxic; risk of acute failure." },
          { heading: "Lipids", body: "Severely negative." },
          { heading: "Cardiovascular", body: "Sharp blood pressure increases." },
        ],
      },
      { heading: "Dosage Ranges", list: ["200–250 mcg/day sublingually (1-2 weeks max pre-event)"] },
      { heading: "General Safety Profile", body: "Extremely poor for anything beyond very short use. Not suitable for muscle building." },
      { heading: "Odd/Unique Effects", list: ["Induces intense aggression and focus (Rage Spell).", "Rapid onset (30 min), short duration (2-4 hours)."] },
    ],
  },
  {
    id: "anavar",
    title: "Anavar (Oxandrolone)",
    route: "oral",
    tagline: "A mild DHT-derived oral popular for fat loss and a hard, quality look.",
    compoundIds: [],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral DHT derivative. Binds to AR." },
      { heading: "Aromatization?", body: "No. Strongly lowers SHBG, potentially shifting estrogen balance." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Lipids", body: "Harsh on HDL (HDL rapist)." },
          { heading: "Liver", body: "Mildly hepatotoxic compared to other orals." },
        ],
      },
      { heading: "Dosage Ranges", list: ["25 – 80 mg/day (6-8 weeks). 25mg often sufficient."] },
      { heading: "General Safety Profile", body: "Good relative to other orals, though still carries lipid risks." },
      { heading: "Odd/Unique Effects", list: ["Minimal water retention for a dry, quality appearance.", "Enhances abdominal fat loss.", "Notable pumps that can hinder performance.", "Relatively mild on hairline for a DHT derivative."] },
    ],
  },
  {
    id: "winstrol",
    title: "Winstrol (Stanozolol)",
    route: "oral",
    tagline: "A DHT-derived compound (oral or injectable) known for dry gains and joint issues.",
    compoundIds: [],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral/Injectable DHT derivative. Binds to AR." },
      { heading: "Aromatization?", body: "No." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Lipids", body: "Very harsh on cholesterol, especially HDL." },
          { heading: "Liver", body: "Hepatotoxic." },
          { heading: "Other", body: "Can cause tendon brittleness." },
        ],
      },
      { heading: "Dosage Ranges", list: ["25–100 mg/day oral or 50mg EOD injectable."] },
      { heading: "General Safety Profile", body: "Harsh on lipids and joints. Best reserved for contest prep." },
      { heading: "Odd/Unique Effects", list: ["Dramatic dry, vascular look.", "Painful pumps and joint dryness.", "Sucks water from the body, leading to a bark-like feel."] },
    ],
  },
  {
    id: "dianabol",
    title: "Dianabol (Methandrostenolone)",
    route: "oral",
    tagline: "The iconic bulking oral responsible for classic mass-building eras.",
    compoundIds: ["dbol"],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral testosterone derivative. Binds to AR." },
      { heading: "Aromatization?", body: "Yes, heavily to methyl-estradiol." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Liver", body: "Mildly hepatotoxic." },
          { heading: "Estrogen", body: "High water retention and gyno risk." },
          { heading: "Blood Pressure", body: "Significant increases." },
        ],
      },
      { heading: "Dosage Ranges", list: ["25 – 50 mg/day."] },
      { heading: "General Safety Profile", body: "Poor due to estrogenic and liver effects." },
      { heading: "Odd/Unique Effects", list: ["Rapid mass and strength with much of it being water/glycogen.", "Classic bloated appearance."] },
    ],
  },
  {
    id: "halotestin",
    title: "Halotestin (Fluoxymesterone)",
    route: "oral",
    tagline: "A powerful androgen for extreme strength and pre-contest hardness. Favorite among powerlifters.",
    compoundIds: ["halo"],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral testosterone derivative with high AR affinity." },
      { heading: "Aromatization?", body: "No." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Liver", body: "Extremely hepatotoxic." },
          { heading: "Lipids", body: "Very harsh." },
          { heading: "Blood Pressure", body: "Dangerous spikes." },
        ],
      },
      { heading: "Dosage Ranges", list: ["10 – 50 mg/day (2-4 weeks max)."] },
      { heading: "General Safety Profile", body: "Very poor. Requires extensive liver support." },
      { heading: "Odd/Unique Effects", list: ["Massive strength and aggression gains with minimal muscle growth.", "Hard, dense muscle look.", "Severe roid rage potential."] },
    ],
  },
  {
    id: "turinabol",
    title: "Turinabol (Tbol)",
    route: "oral",
    tagline: "A balanced oral often described as a non-aromatizing hybrid of Anavar and Dianabol.",
    compoundIds: [],
    sections: [
      { heading: "How to Use / Receptors", body: "Chlorinated Dianabol derivative. Binds to AR." },
      { heading: "Aromatization?", body: "No." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Liver", body: "Hepatotoxic but milder than Dianabol." },
          { heading: "Lipids", body: "Suppresses HDL, though less severely than Anavar." },
        ],
      },
      { heading: "Dosage Ranges", list: ["30 – 60 mg/day (6-8 weeks)."] },
      { heading: "General Safety Profile", body: "Moderate for an oral." },
      { heading: "Odd/Unique Effects", list: ["Clean, steady lean gains without water retention.", "Aldosterone synthase inhibition can cause cramping."] },
    ],
  },
  {
    id: "superdrol",
    title: "Superdrol (Methyldrostanolone)",
    route: "oral",
    tagline: "A potent DHT-derived oral for rapid dry gains, notorious for toxicity and lethargy.",
    compoundIds: ["sdrol"],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral DHT derivative (potent oral Masteron analog)." },
      { heading: "Aromatization?", body: "No." },
      {
        heading: "Blood Markers Impacted",
        blocks: [
          { heading: "Liver", body: "Extremely hepatotoxic (double methylated)." },
          { heading: "Lipids", body: "Crushes HDL." },
          { heading: "Blood Pressure", body: "Notable increases." },
        ],
      },
      { heading: "Dosage Ranges", list: ["10 – 30 mg/day (3-4 weeks max, ideally 2 weeks)."] },
      { heading: "General Safety Profile", body: "Very poor. Causes extreme lethargy and appetite loss." },
      { heading: "Odd/Unique Effects", list: ["Fast, dry muscle and strength gains.", "Nicknamed Killerdrol for its harshness."] },
    ],
  },
  {
    id: "proviron",
    title: "Proviron (Mesterolone)",
    route: "oral",
    tagline: "Primarily used as an adjunct to increase free testosterone and provide mild AI effects. Also enhances vascularity pre-contest.",
    compoundIds: [],
    sections: [
      { heading: "How to Use / Receptors", body: "Oral DHT derivative. Strongly binds SHBG, increasing free testosterone." },
      { heading: "Aromatization?", body: "No. Mild aromatase inhibition." },
      { heading: "Blood Markers Impacted", body: "Minimal at low doses; lipids may suffer at high doses." },
      { heading: "Dosage Ranges", list: ["25 – 100 mg/day."] },
      { heading: "General Safety Profile", body: "Good. Not hepatotoxic. Main risks are androgenic (hair loss, acne)." },
      { heading: "Odd/Unique Effects", list: ["Does not build significant muscle itself.", "Boosts libido and well-being.", "Supports bone tissue growth.", "Hardens physique and improves vascularity at high doses."] },
    ],
  },
];

const PROFILE_BY_ID = Object.fromEntries(COMPOUND_PROFILES.map((p) => [p.id, p]));
const PROFILE_BY_COMPOUND = new Map<string, CompoundProfile>();
for (const profile of COMPOUND_PROFILES) {
  for (const cid of profile.compoundIds) {
    PROFILE_BY_COMPOUND.set(cid, profile);
  }
}

export function getProfileById(id: string): CompoundProfile | undefined {
  return PROFILE_BY_ID[id];
}

export function getProfileForCompound(compoundId: string): CompoundProfile | undefined {
  return PROFILE_BY_COMPOUND.get(compoundId);
}

export function listInjectableProfiles(): CompoundProfile[] {
  return COMPOUND_PROFILES.filter((p) => p.route === "injectable");
}

export function listOralProfiles(): CompoundProfile[] {
  return COMPOUND_PROFILES.filter((p) => p.route === "oral");
}

export function listConceptProfiles(): CompoundProfile[] {
  return COMPOUND_PROFILES.filter((p) => p.route === "concept");
}