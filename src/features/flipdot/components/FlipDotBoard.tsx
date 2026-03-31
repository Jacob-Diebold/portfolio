// components/FlipDotBoard.tsx
"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useLayoutEffect, useEffect } from "react";
import * as THREE from "three";
import { FlipDotBoardProps } from "../types/flipdot";

/** Base: cylinder (Y up) → disk in board plane. Flip: 180° around axis in the XY plane at 45° (real modules look “diagonal”). */
const AXIS_BASE = new THREE.Vector3(1, 0, 0);
const AXIS_FLIP = new THREE.Vector3(1, 1, 0).normalize();
const Q_BASE = new THREE.Quaternion();
const Q_FLIP = new THREE.Quaternion();

/**
 * Exponential ease toward the target angle. τ ≈ time scale (s); ~3τ ≈ mostly settled.
 * Real flip dots complete a move in roughly 50–120 ms — keep τ small (here ~45 ms).
 */
const FLIP_TAU = 0.1;
const FLIP_SNAP_RAD = 0.006;

/** Cap blend if Δt spikes (tab away); must use real frame Δt from useFrame — not clock.getDelta() (see below). */
const FLIP_K_MAX = 0.92;

export default function FlipDotBoard({ rows, cols, board, colors, onSetCell }: FlipDotBoardProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  /** Flip angle around AXIS_FLIP per instance (0 = off, π = on). */
  const flipAnglesRef = useRef<Float32Array | null>(null);
  const draggingRef = useRef(false);
  const lastInstanceIdRef = useRef<number | null>(null);
  const strokeValueRef = useRef<0 | 1 | null>(null);
  const onSetCellRef = useRef(onSetCell);
  const rowsRef = useRef(rows);
  const colsRef = useRef(cols);
  const boardRef = useRef(board);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { gl } = useThree();
  const count = rows * cols;

  onSetCellRef.current = onSetCell;
  rowsRef.current = rows;
  colsRef.current = cols;
  boardRef.current = board;

  const rimColor = colors?.rim ?? "#3a3a3a";
  const offColor = colors?.off ?? "#e8e8e8";
  const onColor = colors?.on ?? "#1a1a1a";

  /** Thin disk: shorter height = less visible rim whenever the cap isn’t perfectly head‑on. */
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32), []);

  // Cylinder groups: [0] side, [1] top (+Y), [2] bottom (−Y). Rx(π/2) lays the disk flat, then π about AXIS_FLIP swaps caps.
  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: rimColor,
        metalness: 0.5,
        roughness: 0.2,
        emissive: rimColor,
        emissiveIntensity: 0.25,
      }),
      new THREE.MeshStandardMaterial({
        color: offColor,
        metalness: 0.5,
        roughness: 0.2,
        emissive: offColor,
        emissiveIntensity: 0.25,
      }),
      new THREE.MeshStandardMaterial({
        color: onColor,
        metalness: 0.5,
        roughness: 0.2,
        emissive: onColor,
        emissiveIntensity: 0.25,
      }),
    ],
    [rimColor, offColor, onColor],
  );

  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  // Use the `delta` argument — R3F already called `clock.getDelta()` once per frame; calling it again
  // here returns ~0 every time, so easing barely moves (~10s+ for one flip).
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const dt = Math.min(delta, 0.1);
    const b = boardRef.current;

    if (mesh && b.length === rows) {
      let angles = flipAnglesRef.current;
      if (!angles || angles.length !== count) {
        const nextAngles = new Float32Array(count);
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = y * cols + x;
            const on = b[y][x] !== 0;
            nextAngles[idx] = on ? Math.PI : 0;
          }
        }
        flipAnglesRef.current = nextAngles;
        angles = nextAngles;
      }

      // Framerate-independent smoothing; cap k so timing stays stable across irregular Δt.
      const k = Math.min(FLIP_K_MAX, 1 - Math.exp(-dt / FLIP_TAU));

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const target = b[y][x] !== 0 ? Math.PI : 0;
          let theta = angles[idx];
          theta += (target - theta) * k;
          if (Math.abs(target - theta) < FLIP_SNAP_RAD) theta = target;
          angles[idx] = theta;

          Q_BASE.setFromAxisAngle(AXIS_BASE, Math.PI / 2);
          Q_FLIP.setFromAxisAngle(AXIS_FLIP, theta);
          dummy.quaternion.multiplyQuaternions(Q_FLIP, Q_BASE);
          dummy.position.set(x - cols / 2, -y + rows / 2, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(idx, dummy.matrix);
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    const setCell = onSetCellRef.current;
    const stroke = strokeValueRef.current;
    if (!setCell || stroke === null || !draggingRef.current || !mesh) return;

    state.raycaster.setFromCamera(state.pointer, state.camera);
    const hit = state.raycaster.intersectObject(mesh, false)[0];
    const id = hit?.instanceId;
    if (id === undefined || id < 0) return;
    if (id === lastInstanceIdRef.current) return;

    lastInstanceIdRef.current = id;
    const c = colsRef.current;
    const rCount = rowsRef.current;
    const col = id % c;
    const row = Math.floor(id / c);
    if (row >= 0 && row < rCount && col >= 0 && col < c) setCell(row, col, stroke);
  });

  const interactive = Boolean(onSetCell);

  const finishStrokeRef = useRef<(pointerId: number) => void>(() => {});
  finishStrokeRef.current = (pointerId: number) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    lastInstanceIdRef.current = null;
    strokeValueRef.current = null;
    const el = gl.domElement;
    if (el.hasPointerCapture(pointerId)) {
      el.releasePointerCapture(pointerId);
    }
  };

  useEffect(() => {
    const onWindowUp = (e: PointerEvent) => finishStrokeRef.current(e.pointerId);
    window.addEventListener("pointerup", onWindowUp);
    window.addEventListener("pointercancel", onWindowUp);
    return () => {
      window.removeEventListener("pointerup", onWindowUp);
      window.removeEventListener("pointercancel", onWindowUp);
    };
  }, []);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive || !onSetCell) return;
    e.stopPropagation();
    const id = e.instanceId;
    if (id === undefined || id < 0) return;
    const col = id % cols;
    const row = Math.floor(id / cols);
    if (row < 0 || row >= rows || col < 0 || col >= cols || board.length !== rows) return;

    const current = board[row][col] !== 0 ? 1 : 0;
    const paint: 0 | 1 = current === 0 ? 1 : 0;

    gl.domElement.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    lastInstanceIdRef.current = id;
    strokeValueRef.current = paint;
    onSetCell(row, col, paint);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    finishStrokeRef.current(e.pointerId);
  };

  const handlePointerCancel = (e: ThreeEvent<PointerEvent>) => {
    finishStrokeRef.current(e.pointerId);
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, materials, count]}
      key={count}
      onPointerDown={interactive ? handlePointerDown : undefined}
      onPointerUp={interactive ? handlePointerUp : undefined}
      onPointerCancel={interactive ? handlePointerCancel : undefined}
      onPointerOver={
        interactive
          ? (e) => {
              e.stopPropagation();
              gl.domElement.style.cursor = "pointer";
            }
          : undefined
      }
      onPointerOut={
        interactive
          ? () => {
              gl.domElement.style.cursor = draggingRef.current ? "pointer" : "auto";
              if (draggingRef.current) lastInstanceIdRef.current = null;
            }
          : undefined
      }
    />
  );
}
