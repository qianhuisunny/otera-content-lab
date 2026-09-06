import { COLLECTION_STATS, OTERA_ARTIFACTS } from "./oteraArtifacts";
import { RETELL_ARTIFACTS, RETELL_COLLECTION_STATS } from "./retellArtifacts";

export const DEFAULT_COMPANY_ID = "otera";

export const COMPANY_CATALOG = [
  {
    id: "otera",
    name: "Otera",
    initials: "OT",
    topbarLabel: "Otera context library",
    sidebarSubtitle: "Company context",
    collectionTitle: "Otera context artifacts",
    collectionIntro:
      "A writing-ready source of truth for company narrative, ideal customer profile, buying committee, and role-level persona depth.",
    evidenceDescription:
      "This library combines public Otera material, public customer and partner evidence, analyst or industry context, and explicitly labeled research inference. It does not contain private CRM, call, procurement, or retention data.",
    artifacts: OTERA_ARTIFACTS,
    stats: COLLECTION_STATS,
    sections: [
      {
        id: "company",
        title: "Company & market",
        description:
          "What Otera is, where it fits, who should buy, and what should disqualify an opportunity.",
        artifactIds: ["company-overview", "icp-context"],
      },
      {
        id: "personas",
        title: "Audience & buying committee",
        description:
          "The committee map plus seven role-level dossiers with jobs, incentives, objections, evidence needs, and messaging guidance.",
        artifactIds: [
          "persona-index",
          "economic-buyer",
          "executive-champion",
          "functional-champion",
          "technical-evaluator",
          "risk-approval-gate",
          "operational-user",
          "transformation-partner",
        ],
      },
    ],
  },
  {
    id: "retell",
    name: "Retell AI",
    initials: "RA",
    topbarLabel: "Retell AI context library",
    sidebarSubtitle: "Company context",
    collectionTitle: "Retell AI context artifacts",
    collectionIntro:
      "A citation-aware source of truth for company and founder narrative, market position, ideal customer profile, buying committee, and evidence-derived persona depth.",
    evidenceDescription:
      "This library combines public Retell AI material, named customer and partner evidence, independent reporting, product and legal documentation, review or community language, and explicitly labeled research inference. It contains no private customer, call, procurement, or retention data.",
    artifacts: RETELL_ARTIFACTS,
    stats: RETELL_COLLECTION_STATS,
    sections: [
      {
        id: "company",
        title: "Company, founders & market",
        description:
          "What Retell AI is, how the founders frame it, where the platform fits, who should buy, and what should disqualify an opportunity.",
        artifactIds: [
          "retell-company-overview",
          "retell-founder-context",
          "retell-market-context",
          "retell-icp-context",
        ],
      },
      {
        id: "personas",
        title: "Audience & buying committee",
        description:
          "The evidence-derived committee map plus seven role-level dossiers with jobs, authority, objections, proof needs, and writing guidance.",
        artifactIds: [
          "retell-persona-index",
          "retell-executive-sponsor",
          "retell-workflow-owner",
          "retell-technical-owner",
          "retell-agent-builder",
          "retell-conversation-quality-owner",
          "retell-governance-approver",
          "retell-solution-partner-platform-operator",
        ],
      },
    ],
  },
];
