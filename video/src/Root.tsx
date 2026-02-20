import { Composition } from "remotion";
import { GradientBackground } from "./components/GradientBackground";
import { AnimatedText } from "./components/AnimatedText";

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
    <Composition
      id="test"
      component={TestComp}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
