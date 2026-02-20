import { Composition } from "remotion";
import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";
import { LogoIntro } from "./scenes/LogoIntro";
import { ProblemScene } from "./scenes/ProblemScene";
import { SolutionScene } from "./scenes/SolutionScene";

const TestComp: React.FC = () => {
  return (
    <GradientBackground>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <AnimatedText text="ConsentHub" fontSize={80} />
      </div>
    </GradientBackground>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="test"
        component={TestComp}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="logo-intro"
        component={LogoIntro}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="problem-scene"
        component={ProblemScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="solution-scene"
        component={SolutionScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
