/* Earth Exports · home scene — photoreal Earth arc (NASA imagery) ⇄ UFO reveal
   three.js vendored locally (js/vendor). Earth imagery: NASA Blue Marble / Black Marble.
   Only the two tabs change html[data-side]; this module just follows it. */
import * as THREE from "./vendor/three.module.min.js";

const section = document.querySelector(".scene");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const CAPTURE = /[?&]capture=1/.test(location.search);

function webglOK() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); }
  catch (e) { return false; }
}

if (section && !reduce && webglOK()) boot();

function boot() {
  const D2R = Math.PI / 180;
  const CROP = [-175 * D2R, -15 * D2R, 5 * D2R, 80 * D2R];
  const R = 1050, EARTH_CY = -1050;
  const TILT = 25 * D2R, SPIN_DAY = 83 * D2R, SPIN_NIGHT = 101 * D2R;
  const SUN_DAY = new THREE.Vector3(0.45, 0.62, 0.64).normalize();
  const SUN_NIGHT = new THREE.Vector3(0.32, 0.28, -0.9).normalize();
  const SUNPOS_DAY = new THREE.Vector2(160, -20), SUNPOS_NIGHT = new THREE.Vector2(200, -95);
  const DURATION = 2.8;

  const canvas = document.createElement("canvas");
  canvas.className = "scene-gl";
  canvas.setAttribute("aria-hidden", "true");
  section.insertBefore(canvas, section.firstChild);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: "high-performance", preserveDrawingBuffer: CAPTURE });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-720, 720, 300, -240, 1, 8000);
  camera.position.set(0, 0, 4000);

  /* ---------- Earth (ray-traced sphere in a full-frame quad) ---------- */
  const U = {
    dayTex: { value: null }, nightTex: { value: null }, cloudTex: { value: null },
    crop: { value: new THREE.Vector4(...CROP) },
    planetRot: { value: new THREE.Matrix3() },
    sunDir: { value: SUN_DAY.clone() },
    center: { value: new THREE.Vector2(0, EARTH_CY) },
    radius: { value: R },
    sunPos: { value: SUNPOS_DAY.clone() },
    sunI: { value: 1 }, lightsBoost: { value: 1 }, earthFade: { value: 1 },
    cloudShift: { value: 0 }, frustum: { value: new THREE.Vector4(-720, 720, -240, 300) },
  };
  const earthMat = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    vertexShader: `
      uniform vec4 frustum; varying vec2 vWorld;
      void main(){ vec2 t = position.xy*0.5+0.5; vWorld = vec2(mix(frustum.x,frustum.y,t.x), mix(frustum.z,frustum.w,t.y)); gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: `
      precision highp float;
      varying vec2 vWorld;
      uniform sampler2D dayTex, nightTex, cloudTex;
      uniform vec4 crop; uniform mat3 planetRot; uniform vec3 sunDir;
      uniform vec2 center; uniform float radius; uniform vec2 sunPos;
      uniform float sunI, lightsBoost, earthFade, cloudShift;
      vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.); }
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*vnoise(p); p*=2.07; a*=.5; } return v; }
      void main(){
        vec2 d = vWorld - center; float dist = length(d);
        vec3 col = vec3(0.); float alpha = 0.;
        const vec3 RAY = vec3(0.16,0.40,1.0);
        if (dist < radius + 1.0) {
          float z = sqrt(max(radius*radius - dist*dist, 0.));
          vec3 n = vec3(d, z) / radius;
          vec3 pn = planetRot * n;
          float lat = asin(clamp(pn.y,-1.,1.)); float lon = atan(pn.x, pn.z);
          vec2 uv = vec2((lon-crop.x)/(crop.y-crop.x), (lat-crop.z)/(crop.w-crop.z));
          vec3 day = texture2D(dayTex, uv).rgb;
          vec3 night = texture2D(nightTex, uv).rgb;
          vec2 cuv = uv + vec2(cloudShift, 0.);
          vec2 tx = vec2(1.6/1920., 1.6/900.);
          float c0 = texture2D(cloudTex, cuv).r;
          float cb = 0.25*(texture2D(cloudTex, cuv+vec2(tx.x,0.)).r + texture2D(cloudTex, cuv-vec2(tx.x,0.)).r
                         + texture2D(cloudTex, cuv+vec2(0.,tx.y)).r + texture2D(cloudTex, cuv-vec2(0.,tx.y)).r);
          float cl = clamp(c0 + 1.35*(c0 - cb), 0., 1.);
          float det = fbm(uv*vec2(1100., 515.) + vec2(cloudShift*700., 0.));
          float det2 = vnoise(uv*vec2(3200., 1500.));
          cl = smoothstep(0.28, 0.80, cl*(0.68 + 0.48*det + 0.06*det2));
          float mu = dot(n, sunDir);
          float nv = max(n.z, 0.0);
          float dayMask = smoothstep(-0.10, 0.20, mu);
          vec3 surf = mix(day*1.15, vec3(0.93,0.95,0.98), cl*0.92);
          vec3 sunTint = mix(vec3(1.0,0.5,0.25), vec3(1.0,0.97,0.93), smoothstep(0.0,0.3,mu));
          vec3 lit = surf * sunTint * max(mu,0.) * 1.75;
          float water = smoothstep(0.01, 0.05, day.b - max(day.r, day.g)*0.85) * (1.0 - cl);
          vec3 H = normalize(sunDir + vec3(0.,0.,1.));
          float ndh = max(dot(n,H),0.);
          lit += vec3(1.0,0.9,0.75) * (pow(ndh,120.)*2.2 + pow(ndh,14.)*0.10) * water * dayMask;
          float lum = dot(night, vec3(0.3,0.5,0.2));
          float cities = smoothstep(0.10, 0.9, lum); cities *= cities;
          vec3 cityCol = mix(vec3(1.0,0.55,0.22), vec3(1.0,0.84,0.58), smoothstep(0.5,0.95,lum)) * cities;
          float nightMask = 1.0 - smoothstep(-0.22, 0.06, mu);
          vec3 lights = cityCol * nightMask * (1.0 - cl*0.75) * lightsBoost * 1.6;
          float airmass = 1.0/(nv + 0.10);
          float atmoLit = smoothstep(-0.2, 0.55, mu);
          float haze = 1.0 - exp(-airmass*0.10);
          col = lit + lights;
          col = mix(col, RAY*atmoLit*1.2, haze*0.6*atmoLit) + RAY*haze*atmoLit*0.18;
          float fres = pow(1.0 - nv, 6.0);
          col += RAY * fres * (atmoLit*1.8 + 0.02);
          alpha = smoothstep(radius, radius-1.5, dist);
          col *= alpha;
        }
        float hd = dist - radius;
        if (hd > -3.0) {
          vec3 ln = vec3(d/dist, 0.);
          float l = dot(ln, sunDir);
          float litH = smoothstep(-0.3, 0.6, l);
          float fs = exp(-length(vWorld - sunPos)/170.0) * sunI;
          float th = max(hd, 0.);
          float glow = exp(-th/8.0)*0.95 + exp(-th/26.0)*0.32;
          vec3 g = vec3(0.32,0.62,1.0) * glow * (0.03 + litH*1.05 + fs*3.2);
          col += g;
          alpha = max(alpha, clamp(max(g.b, g.g)*0.85, 0., 1.));
        }
        vec2 sd = vWorld - sunPos; float sdist = length(sd);
        float occl = dist < radius ? 0.0 : 1.0;
        float core = smoothstep(23., 19., sdist) * occl * 9.0;
        float glowS = (exp(-sdist/22.)*2.4 + exp(-sdist/60.)*0.26) * mix(0.18, 1.0, occl);
        float streak = (exp(-abs(sd.y)/1.6)*exp(-abs(sd.x)/260.)*0.9 + exp(-abs(sd.y)/9.)*exp(-abs(sd.x)/120.)*0.35) * sunI;
        float ang = atan(sd.y, sd.x);
        float rays = pow(abs(cos(ang*3.0+0.4)), 90.) * exp(-sdist/38.) * 0.5 * occl;
        vec3 sunTerm = vec3(1.0,0.9,0.76) * (core + glowS + streak + rays) * sunI;
        col += sunTerm;
        alpha = max(alpha, clamp(sunTerm.r*0.55, 0., 1.));
        col = aces(col);
        col = pow(col, vec3(1.0/2.2));
        col *= earthFade; alpha *= earthFade;
        gl_FragColor = vec4(col, alpha);
      }`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), earthMat);
  quad.frustumCulled = false; quad.renderOrder = -10;
  scene.add(quad);

  /* ---------- Environment for PBR saucer: same world (blue earthshine below, sun, black space) ---------- */
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 64, 32), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying vec3 vDir; void main(){
      float down = smoothstep(0.05, -0.6, vDir.y);
      vec3 c = mix(vec3(0.004,0.005,0.01), vec3(0.08,0.22,0.5), down);
      c += vec3(0.9,0.5,0.25) * smoothstep(0.02,-0.02,abs(vDir.y+0.02)) * 0.35;
      float sun = pow(max(dot(normalize(vDir), normalize(vec3(0.5,0.35,-0.8))),0.), 400.);
      c += vec3(12.0,10.0,8.0) * sun;
      float strip = smoothstep(0.985,1.0, max(dot(vDir, normalize(vec3(-0.6,0.5,0.6))),0.));
      c += vec3(0.6) * strip;
      c += vec3(0.07,0.085,0.12) * smoothstep(0.1, 1.0, vDir.y);
      float box1 = smoothstep(0.93,0.99, max(dot(vDir, normalize(vec3(0.2,0.9,0.4))),0.));
      float box2 = smoothstep(0.96,0.995, max(dot(vDir, normalize(vec3(0.8,0.4,0.45))),0.));
      c += vec3(0.85,0.9,1.0)*box1*1.3 + vec3(0.92,0.95,1.0)*box2*1.1;
      float band = smoothstep(0.035,0.0,abs(vDir.y-0.10)) * 1.4 + smoothstep(0.02,0.0,abs(vDir.y-0.32))*0.6;
      c += vec3(0.8,0.88,1.0) * band;
      c += vec3(1.0,0.6,0.2) * smoothstep(0.12,0.0,abs(vDir.y+0.05)) * 0.02;
      gl_FragColor = vec4(c,1.); }`,
  })));
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(envScene, 0.02).texture;

  /* ---------- Saucer (procedural PBR) ---------- */
  function brushedCanvas() {
    const c = document.createElement("canvas"); c.width = 64; c.height = 1024;
    const g = c.getContext("2d");
    for (let y = 0; y < 1024; y++) { const v = 120 + Math.random() * 70; g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(0, y, 64, 1); }
    for (let i = 0; i < 7; i++) { const y = 150 + i * 120 + Math.random() * 20; g.fillStyle = "rgb(20,20,20)"; g.fillRect(0, y, 64, 2); }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  function seamsCanvas() {
    const c = document.createElement("canvas"); c.width = 2048; c.height = 256;
    const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, 2048, 256);
    g.fillStyle = "#555"; for (let i = 0; i < 24; i++) g.fillRect(i * 2048 / 24, 0, 3, 256);
    g.fillStyle = "#777"; for (let r = 0; r < 4; r++) g.fillRect(0, 40 + r * 55, 2048, 2);
    return new THREE.CanvasTexture(c);
  }
  const brushed = brushedCanvas(), seams = seamsCanvas();
  const hullMat = new THREE.MeshPhysicalMaterial({
    color: 0xf2f4f8, metalness: 1.0, roughness: 0.1, roughnessMap: brushed, bumpMap: seams, bumpScale: 0.6,
    clearcoat: 0.6, clearcoatRoughness: 0.05, envMap: envTex, envMapIntensity: 1.0, transparent: true, opacity: 0,
  });
  const underMat = new THREE.MeshStandardMaterial({ color: 0xb8c0cc, metalness: 1.0, roughness: 0.22, envMap: envTex, transparent: true, opacity: 0 });
  const ufo = new THREE.Group(); scene.add(ufo);
  const body = new THREE.Group(); ufo.add(body);
  body.rotation.x = 0.17;
  const top = [[0, 0.175], [0.34, 0.17], [0.5, 0.15], [0.72, 0.10], [0.92, 0.045], [1.0, 0.012], [1.0, 0.0]].reverse().map(p => new THREE.Vector2(p[0], p[1]));
  const bot = [[1.0, 0.0], [1.0, -0.012], [0.9, -0.045], [0.7, -0.10], [0.42, -0.165], [0.2, -0.19], [0, -0.195]].map(p => new THREE.Vector2(p[0], p[1]));
  const hullTop = new THREE.Mesh(new THREE.LatheGeometry(top, 192), hullMat);
  const hullBot = new THREE.Mesh(new THREE.LatheGeometry(bot.slice().reverse(), 192), underMat);
  body.add(hullTop, hullBot);
  const rimBand = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.016, 12, 192), new THREE.MeshStandardMaterial({ color: 0x1c2331, metalness: 0.8, roughness: 0.35, envMap: envTex, transparent: true, opacity: 0 }));
  rimBand.rotation.x = Math.PI / 2; body.add(rimBand);
  const domeMat = new THREE.MeshPhysicalMaterial({ color: 0x0c1020, metalness: 0.1, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, envMap: envTex, envMapIntensity: 3.2, transparent: true, opacity: 0, depthWrite: false, emissive: 0x241a66, emissiveIntensity: 0.25 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
  dome.position.y = 0.165; dome.renderOrder = 3; body.add(dome);
  const crystalMat = new THREE.MeshBasicMaterial({ color: 0xb9a6ff, transparent: true, opacity: 0, toneMapped: false });
  [[-0.07, 0.05, 0.9], [0, 0.08, 1.3], [0.07, 0.05, 0.8]].forEach(([x, h, s]) => {
    const m = new THREE.Mesh(new THREE.OctahedronGeometry(0.035 * s), crystalMat); m.position.set(x, 0.2 + h * 0.5, 0.02); m.scale.y = 2.2; body.add(m);
  });
  const underGlow = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 12, 96), new THREE.MeshBasicMaterial({ color: 0x9d86ff, transparent: true, opacity: 0, toneMapped: false }));
  underGlow.rotation.x = Math.PI / 2; underGlow.position.y = -0.18; body.add(underGlow);

  function glowSprite(hex, size) {
    const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.2, "rgba(255,255,255,.6)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color: hex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false, opacity: 0 }));
    s.scale.set(size, size, 1); return s;
  }
  const RIM_N = 20, rimLights = [];
  const rimCols = [0xffb000, 0x1bc4b0, 0xff8f1f, 0xffd27a];
  for (let i = 0; i < RIM_N; i++) {
    const a = (i / RIM_N) * Math.PI * 2;
    const g = new THREE.Group(); g.position.set(Math.cos(a) * 1.004, 0, Math.sin(a) * 1.004);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 8), new THREE.MeshBasicMaterial({ color: rimCols[i % 4], transparent: true, opacity: 0, toneMapped: false }));
    const halo = glowSprite(rimCols[i % 4], 0.16);
    g.add(bulb, halo); body.add(g);
    rimLights.push({ g, bulb, halo, a });
  }
  const bellyGlow = glowSprite(0x9d86ff, 1.3); bellyGlow.position.set(0, -0.2, 0); bellyGlow.scale.set(1.5, 0.35, 1); body.add(bellyGlow);

  const beamMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false,
    uniforms: { uA: { value: 0 }, uT: { value: 0 } },
    vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv=uv; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `uniform float uA, uT; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
      void main(){ float edge = pow(1.0-abs(dot(normalize(vN), vec3(0.,0.,1.))), 1.6);
        float along = smoothstep(0.0, 0.85, vUv.y);
        float bands = 0.85 + 0.15*sin(vUv.y*40.0 - uT*6.0);
        vec3 c = mix(vec3(0.1,0.75,0.7), vec3(0.62,0.52,1.0), vUv.y);
        float a = (0.25 + 0.75*edge) * along * bands * uA;
        gl_FragColor = vec4(c*a, a); }`,
  });
  const beamLen = 0.44;
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.62, beamLen, 64, 1, true), beamMat);
  beam.position.y = -0.19 - beamLen / 2; ufo.add(beam);

  const key = new THREE.DirectionalLight(0xf2f6ff, 0); key.position.set(0.5, 0.6, 0.6); scene.add(key);
  const fill = new THREE.HemisphereLight(0x223355, 0x3a78c8, 0); scene.add(fill);
  const rimPL = [];
  for (let i = 0; i < 4; i++) { const pl = new THREE.PointLight(0xffd6a0, 0, 900, 1.6); scene.add(pl); rimPL.push(pl); }

  /* ---------- City-light particles ---------- */
  const PN = RIM_N * 3;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PN * 3), pAlpha = new Float32Array(PN), pSize = new Float32Array(PN);
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("aAlpha", new THREE.BufferAttribute(pAlpha, 1));
  pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSize, 1));
  const pMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false,
    uniforms: { uPR: { value: 1 } },
    vertexShader: `attribute float aAlpha; attribute float aSize; uniform float uPR; varying float vA;
      void main(){ vA=aAlpha; gl_PointSize = aSize*uPR; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `varying float vA; void main(){ vec2 c=gl_PointCoord-0.5; float r=length(c)*2.0;
      float a = (exp(-r*r*5.0) + 0.6*exp(-r*r*40.0)) * vA; gl_FragColor = vec4(vec3(1.0,0.82,0.55)*a, a); }`,
  });
  const points = new THREE.Points(pGeo, pMat); points.frustumCulled = false; points.renderOrder = 5; scene.add(points);
  const pStart = [], pCtrl = [], pSeed = [];

  /* ---------- helpers ---------- */
  const clamp01 = x => Math.min(1, Math.max(0, x));
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  function planetMatrix(spin) {
    return new THREE.Matrix4().makeRotationX(-TILT).multiply(new THREE.Matrix4().makeRotationY(spin));
  }
  let mobile = false, ufoBase = new THREE.Vector3(0, -95, 0), ufoScale = 330;

  function layout() {
    const w = section.clientWidth, h = section.clientHeight;
    mobile = window.matchMedia("(max-width: 640px)").matches;
    const bw = mobile ? 780 : 1440, bh = mobile ? 880 : 540;
    const s = h / bh; // height-fit: wide screens reveal more space, never zoom into the title
    const vw = w / s, vh = h / s;
    camera.left = -vw / 2; camera.right = vw / 2; camera.bottom = -240; camera.top = -240 + vh;
    camera.updateProjectionMatrix();
    U.frustum.value.set(camera.left, camera.right, camera.bottom, camera.top);
    const pr = Math.min(window.devicePixelRatio || 1, 1.75, 2800 / Math.max(w, 1));
    renderer.setPixelRatio(CAPTURE ? 2 : pr);
    renderer.setSize(w, h, false);
    pMat.uniforms.uPR.value = renderer.getPixelRatio() * s;
    ufoScale = mobile ? 212 : 232;
    ufoBase.set(0, mobile ? -84 : -72, 0);
    ufo.scale.setScalar(ufoScale);
  }

  /* sample real city lights (Black Marble) as particle launch points */
  function sampleCities(img) {
    const W = 480, H = 225, c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d"); g.drawImage(img, 0, 0, W, H);
    const data = g.getImageData(0, 0, W, H).data;
    const M = planetMatrix(SPIN_NIGHT);
    const cand = [];
    for (let y = 0; y < H; y += 1) for (let x = 0; x < W; x += 1) {
      const i = (y * W + x) * 4; const lum = data[i] * 0.3 + data[i + 1] * 0.5 + data[i + 2] * 0.2;
      if (lum < 120) continue;
      const lon = lerp(CROP[0], CROP[1], (x + 0.5) / W), lat = lerp(CROP[3], CROP[2], (y + 0.5) / H);
      const pn = new THREE.Vector3(Math.sin(lon) * Math.cos(lat), Math.sin(lat), Math.cos(lon) * Math.cos(lat));
      const n = pn.applyMatrix4(M);
      if (n.z < 0.12) continue;
      const sx = n.x * R, sy = EARTH_CY + n.y * R;
      if (sy > -8 || sy < -236 || Math.abs(sx) > 560) continue;
      cand.push([sx, sy, lum]);
    }
    cand.sort((a, b) => b[2] - a[2]);
    const pick = [];
    for (const cnd of cand) { if (pick.length >= PN) break; if (pick.every(p => Math.hypot(p[0] - cnd[0], p[1] - cnd[1]) > 14)) pick.push(cnd); }
    while (pick.length < PN) { const x = (Math.random() - 0.5) * 900; pick.push([x, EARTH_CY + Math.sqrt(R * R - x * x) - 20 - Math.random() * 90, 150]); }
    pick.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < PN; i++) { pStart[i] = new THREE.Vector2(pick[i][0], pick[i][1]); pSeed[i] = Math.random(); }
  }

  /* ---------- state ---------- */
  let p = document.documentElement.getAttribute("data-side") === "ufo" ? 1 : 0;
  let target = p, time = 0, last = performance.now(), running = false, ready = false, forced = null;
  const tmpV = new THREE.Vector3();

  function apply() {
    const P = forced != null ? forced : p;
    const a = smooth(0.0, 0.45, P);
    const spin = lerp(SPIN_DAY, SPIN_NIGHT, a);
    U.planetRot.value.setFromMatrix4(planetMatrix(spin)).transpose();
    U.sunDir.value.copy(SUN_DAY).lerp(SUN_NIGHT, a).normalize();
    U.sunPos.value.copy(SUNPOS_DAY).lerp(SUNPOS_NIGHT, smooth(0.05, 0.45, P));
    U.sunI.value = lerp(1, 0.0, smooth(0.0, 0.45, P));
    const glowUp = smooth(0.28, 0.5, P), lift = smooth(0.48, 0.72, P);
    const pulse = glowUp * (1 - lift) * (0.5 + 0.5 * Math.sin(time * 9));
    U.lightsBoost.value = (1 + 1.4 * glowUp + 0.7 * pulse) * (1 - 0.8 * lift);
    const fade = smooth(0.62, 0.92, P);
    U.earthFade.value = 1 - fade;
    U.center.value.set(0, EARTH_CY - 90 * smooth(0.6, 1.0, P));
    U.cloudShift.value = time * 0.0004;

    const reveal = smooth(0.66, 0.96, P);
    const bob = Math.sin(time * 1.7) * 6 * reveal;
    ufo.position.set(ufoBase.x, ufoBase.y + bob - 30 * (1 - reveal), 0);
    body.rotation.z = Math.sin(time * 1.2) * 0.02 * reveal;
    ufo.visible = P > 0.5;
    const op = smooth(0.0, 0.35, reveal);
    hullMat.opacity = underMat.opacity = rimBand.material.opacity = op;
    hullMat.envMapIntensity = 0.2 + 1.5 * reveal;
    domeMat.opacity = 0.82 * smooth(0.3, 0.8, reveal);
    crystalMat.opacity = smooth(0.5, 0.9, reveal);
    underGlow.material.opacity = smooth(0.4, 1, reveal) * 0.9;
    bellyGlow.material.opacity = smooth(0.4, 1, reveal) * 0.55;
    key.intensity = 3.4 * reveal; fill.intensity = 1.2 * reveal;
    const rimOn = smooth(0.70, 0.80, P);
    ufo.updateMatrixWorld(true);
    rimLights.forEach((r, i) => {
      const chase = 0.55 + 0.45 * Math.sin(time * 5 - i * 0.62);
      const front = r.g.getWorldPosition(tmpV).z > 0 ? 1 : 0.35;
      r.bulb.material.opacity = rimOn;
      r.halo.material.opacity = rimOn * chase * front;
    });
    rimPL.forEach((pl, i) => {
      const a2 = i / 4 * Math.PI * 2 + time * 0.8;
      pl.position.set(ufo.position.x + Math.cos(a2) * ufoScale * 1.1, ufo.position.y - 10, Math.sin(a2) * ufoScale * 1.1 + 200);
      pl.intensity = 0.7e5 * rimOn * reveal;
    });
    beamMat.uniforms.uA.value = smooth(0.84, 1.0, P) * (0.8 + 0.2 * Math.sin(time * 3));
    beamMat.uniforms.uT.value = time;

    // particles: city lights lift off the night side and converge into the rim ring
    const show = smooth(0.36, 0.46, P) * (1 - smooth(0.76, 0.84, P));
    points.visible = show > 0.001 && pStart.length === PN;
    if (points.visible) {
      const c = smooth(0.46, 0.76, P);
      for (let i = 0; i < PN; i++) {
        const r = rimLights[i % RIM_N];
        r.g.getWorldPosition(tmpV);
        const s = pStart[i];
        const midX = lerp(s.x, tmpV.x, 0.35), midY = Math.max(s.y, tmpV.y) + 40 + 30 * pSeed[i];
        const e = c * c * (3 - 2 * c);
        const u = 1 - e;
        pPos[i * 3] = u * u * s.x + 2 * u * e * midX + e * e * tmpV.x;
        pPos[i * 3 + 1] = u * u * s.y + 2 * u * e * midY + e * e * tmpV.y;
        pPos[i * 3 + 2] = 500;
        const tw = 0.7 + 0.3 * Math.sin(time * 11 + pSeed[i] * 30);
        pAlpha[i] = show * tw * (0.7 + 0.3 * pSeed[i]);
        pSize[i] = (10 + 8 * pSeed[i]) * (1 + 0.6 * c);
      }
      pGeo.attributes.position.needsUpdate = pGeo.attributes.aAlpha.needsUpdate = pGeo.attributes.aSize.needsUpdate = true;
    }
  }

  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now; time += dt;
    if (p !== target) { const step = dt / DURATION; p = target > p ? Math.min(target, p + step) : Math.max(target, p - step); }
    apply();
    renderer.render(scene, camera);
  }
  function start() { if (!running && ready) { running = true; last = performance.now(); renderer.setAnimationLoop(frame); } }
  function stop() { if (running) { running = false; renderer.setAnimationLoop(null); } }

  let onScreen = true;
  new IntersectionObserver(es => { onScreen = es[0].isIntersecting; onScreen && !document.hidden ? start() : stop(); }).observe(section);
  document.addEventListener("visibilitychange", () => { document.hidden ? stop() : onScreen && start(); });
  new MutationObserver(() => { target = document.documentElement.getAttribute("data-side") === "ufo" ? 1 : 0; }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-side"] });
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { layout(); if (!running && ready) { apply(); renderer.render(scene, camera); } }, 80); });

  layout();

  /* lazy-load textures after first paint */
  function loadAll() {
    const loader = new THREE.TextureLoader();
    const get = (src, srgb) => new Promise((res, rej) => loader.load(src, t => {
      t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
      t.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
      t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
      res(t);
    }, undefined, rej));
    Promise.all([get("assets/earth/earth-day.jpg", true), get("assets/earth/earth-night.jpg", true), get("assets/earth/earth-clouds.jpg", false)])
      .then(([day, night, clouds]) => {
        clouds.wrapS = THREE.RepeatWrapping;
        U.dayTex.value = day; U.nightTex.value = night; U.cloudTex.value = clouds;
        try { sampleCities(night.image); } catch (e) { /* particles fall back to arc */ }
        ready = true; apply(); renderer.render(scene, camera);
        requestAnimationFrame(() => section.classList.add("gl-ready"));
        if (onScreen && !document.hidden) start();
      })
      .catch(() => { canvas.remove(); });
  }
  if (document.readyState === "complete") setTimeout(loadAll, 30); else window.addEventListener("load", () => setTimeout(loadAll, 30));

  /* capture / QA hook */
  window.__eeScene = {
    set(v) { forced = v; apply(); renderer.render(scene, camera); },
    release() { forced = null; },
    ready: () => ready,
    png: () => canvas.toDataURL("image/png"),
    get progress() { return p; },
  };
}
