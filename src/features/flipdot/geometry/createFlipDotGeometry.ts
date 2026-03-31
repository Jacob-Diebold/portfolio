import * as THREE from "three";
import { FLIP_DOT_SHAPE_DEFAULTS, type FlipDotShapeOptions } from "./defaults";

/**
 * Extruded flip-dot disk: circular outline with a concave bottom notch.
 * Groups: [0] front lid, [1] back lid, [2] side rim — matches three-material InstancedMesh.
 * Geometry is centered and rotated so the disk lies in XY (thickness along Z before center).
 */
export function createFlipDotDiskGeometry(
  partial?: Partial<FlipDotShapeOptions>,
): THREE.BufferGeometry {
  const o = { ...FLIP_DOT_SHAPE_DEFAULTS, ...partial };
  const shoulderY = -Math.sqrt(o.radius * o.radius - o.notchShoulderX * o.notchShoulderX);
  const notchApexY = -o.radius + o.notchDepth;

  const outerLeftAngle = Math.atan2(shoulderY, -o.notchShoulderX) + Math.PI * 2;
  const outerRightAngle = Math.atan2(shoulderY, o.notchShoulderX);

  const shape = new THREE.Shape();
  shape.moveTo(-o.notchShoulderX, shoulderY);
  shape.absarc(0, 0, o.radius, outerLeftAngle, outerRightAngle, true);
  shape.bezierCurveTo(
    o.notchShoulderX * o.notchBezierInset,
    notchApexY,
    -o.notchShoulderX * o.notchBezierInset,
    notchApexY,
    -o.notchShoulderX,
    shoulderY,
  );

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: o.thickness,
    bevelEnabled: false,
    curveSegments: o.curveSegments,
  });

  const [lidGroup, sideGroup] = geometry.groups;
  if (lidGroup && sideGroup) {
    const halfLidCount = lidGroup.count / 2;
    geometry.clearGroups();
    geometry.addGroup(lidGroup.start, halfLidCount, 0);
    geometry.addGroup(lidGroup.start + halfLidCount, halfLidCount, 1);
    geometry.addGroup(sideGroup.start, sideGroup.count, 2);
  }

  geometry.center();
  geometry.rotateX(Math.PI / 2);

  return geometry;
}
