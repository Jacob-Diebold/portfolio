"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";

export default function OrthoBoardFit({ rows, cols }: { rows: number; cols: number }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const pad = 0.55;
    const dotR = 0.45;
    const boardHalfW = cols / 2 + dotR + pad;
    const boardHalfH = rows / 2 + dotR + pad;
    const viewAspect = size.width / size.height;

    let left: number;
    let right: number;
    let top: number;
    let bottom: number;

    if (boardHalfW / boardHalfH > viewAspect) {
      right = boardHalfW;
      left = -right;
      top = boardHalfW / viewAspect;
      bottom = -top;
    } else {
      top = boardHalfH;
      bottom = -top;
      right = boardHalfH * viewAspect;
      left = -right;
    }

    camera.manual = true;
    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;
    camera.zoom = 1;
    camera.position.set(0, 0, 10);
    camera.near = 0.1;
    camera.far = 200;
    camera.updateProjectionMatrix();
  }, [camera, rows, cols, size.width, size.height]);

  return null;
}
