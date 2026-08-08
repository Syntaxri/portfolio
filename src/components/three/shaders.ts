import * as THREE from 'three'

/**
 * Procedural aurora shader — a soft violet nebula plane that
 * drifts with time and bends toward the pointer. Pure GLSL.
 */
export const auroraVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const auroraFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uProgress;
  uniform float uDetail;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    int iters = uDetail > 0.5 ? 4 : 3;
    for (int i = 0; i < 4; i++) {
      if (i >= iters) break;
      v += amp * noise(p);
      p = rot * p * 2.03 + vec2(1.7, 9.2) + uTime * 0.012;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    uv.x *= 1.6;

    vec2 mouseOffset = (uMouse - 0.5) * 0.22;
    vec2 p = uv + mouseOffset;

    float t = uTime * 0.05;
    float q = fbm(p * 2.6 + t);
    float r = fbm(p * 2.6 - t);

    float mask = smoothstep(0.92, 0.18, distance(uv, vec2(0.5)));
    mask = mix(mask, mask + (1.0 - mask) * 0.35, uProgress);

    float a = smoothstep(0.14, 0.92, q * 0.6 + 0.5);
    float b = smoothstep(0.2, 0.9, r * 0.7 + 0.3);

    vec3 col = mix(uColorA, uColorB, b * 0.8);
    col *= a * 0.75 + b * 0.35;

    float fade = smoothstep(0.15, 0.0, abs(uv.x - 0.5) * 0.4);
    float alpha = mask * a * 0.9 * (1.0 - 0.6 * b) * fade;

    gl_FragColor = vec4(col * alpha, alpha);
  }
`

export function createAuroraUniforms() {
  return {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColorA: { value: new THREE.Color('#8b5cf6') },
    uColorB: { value: new THREE.Color('#241248') },
    uProgress: { value: 0 },
    uDetail: { value: 1 },
  }
}
