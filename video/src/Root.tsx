import { Composition, Folder } from "remotion";
import { LogoIntro } from "./scenes/LogoIntro";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";
import { DashboardDemo } from "./scenes/DashboardDemo";
import { ConsentWizard } from "./scenes/ConsentWizard";
import { SyncVisualization } from "./scenes/SyncVisualization";
import { AuditTrail } from "./scenes/AuditTrail";
import { PricingComparison } from "./scenes/PricingComparison";
import { FeatureGrid } from "./scenes/FeatureGrid";
import { CTAEndCard } from "./scenes/CTAEndCard";

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Scenes">
      <Composition id="logo-intro" component={LogoIntro} durationInFrames={120} fps={30} width={1920} height={1080} />
      <Composition id="problem-scene" component={ProblemScene} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="solution-scene" component={SolutionScene} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="dashboard-demo" component={DashboardDemo} durationInFrames={450} fps={30} width={1920} height={1080} />
      <Composition id="consent-wizard" component={ConsentWizard} durationInFrames={360} fps={30} width={1920} height={1080} />
      <Composition id="sync-visualization" component={SyncVisualization} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="audit-trail" component={AuditTrail} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="pricing-comparison" component={PricingComparison} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="feature-grid" component={FeatureGrid} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="cta-endcard" component={CTAEndCard} durationInFrames={150} fps={30} width={1920} height={1080} />
    </Folder>
  );
};
