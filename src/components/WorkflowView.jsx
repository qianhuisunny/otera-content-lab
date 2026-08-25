import {
  Article,
  FileText,
  FilmSlate,
  GraduationCap,
  ImageSquare,
  MonitorPlay,
  VideoCamera,
} from "@phosphor-icons/react";
import { IconGridSection } from "@qianhui/ui";

const iconProps = { size: 24, weight: "regular" };

const workflowPhases = [
  {
    heading: "BRIEF",
    description: "Define the objective, audience, and creative direction.",
    items: [
      {
        icon: <FilmSlate {...iconProps} />,
        name: "Video Storyboarding Briefing",
        description: "Define goals, audience, key messages, and visual style for your video storyboard.",
      },
      {
        icon: <FileText {...iconProps} />,
        name: "Blog Article Briefing",
        description: "Define topic, angle, audience, keywords, and success metrics for your blog article.",
      },
      {
        icon: <GraduationCap {...iconProps} />,
        name: "Learning Solution Plan",
        description: "Define learning objectives, audience, content structure, and success metrics.",
      },
    ],
  },
  {
    heading: "WRITE",
    description: "Turn briefs into structured content and narratives.",
    items: [
      {
        icon: <VideoCamera {...iconProps} />,
        name: "Video Storyboard",
        description: "Transform your brief into a visual storyboard with scene-by-scene breakdown.",
      },
      {
        icon: <Article {...iconProps} />,
        name: "Long-Form Blog Article",
        description: "Craft comprehensive, SEO-optimized long-form blog articles.",
      },
      {
        icon: <MonitorPlay {...iconProps} />,
        name: "E-Learning Storyboard",
        description: "Design e-learning flows and storyboards for engaging learning experiences.",
      },
    ],
  },
  {
    heading: "PUBLISH",
    description: "Finalize and publish content across channels.",
    items: [
      {
        icon: <ImageSquare {...iconProps} />,
        name: "Illustration Creation",
        description: "Create custom illustrations and social graphics for LinkedIn, Xiaohongshu, and other platforms.",
      },
    ],
  },
];

export function WorkflowView() {
  return (
    <div aria-label="Content workflow" className="workflow-view">
      {workflowPhases.map((phase) => (
        <IconGridSection {...phase} key={phase.heading} />
      ))}
    </div>
  );
}
