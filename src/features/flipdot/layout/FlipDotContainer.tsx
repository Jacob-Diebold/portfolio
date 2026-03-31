"use client";
import { Canvas } from "@react-three/fiber";
import FlipDotBoard from "../components/FlipDotBoard";
import { FlipDotBoardProps } from "../types/flipdot";
import OrthoBoardFit from "./OrthoBoardFit";

export default function FlipDotContainer(props: FlipDotBoardProps) {
  const { rows, cols, board, colors, onSetCell } = props;
  return (
    <Canvas orthographic camera={{ position: [0, 0, 10], fov: 50 }} style={{ touchAction: "none" }}>
      <OrthoBoardFit rows={rows} cols={cols} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <FlipDotBoard rows={rows} cols={cols} board={board} colors={colors} onSetCell={onSetCell} />
    </Canvas>
  );
}
