import { Composition } from "remotion";

const TestComp: React.FC = () => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F172A",
      }}
    >
      <h1 style={{ color: "white", fontSize: 80 }}>ConsentHub Video</h1>
    </div>
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
