'use client';
import { useEffect, useRef } from 'react';
const shader = `
  // Heavily adapted from Inigo Quilez (https://iquilezles.org/)
  const float D_MAX = 5.0;  // max marching distance
  #define AA 1  // number of anti-aliasing passes
  #define PI 3.1416
  // Simplex 3D Noise by Ian McEwan, Ashima Arts
  ////////////////////////////////////
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //  x0 = x0 - 0. + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

    // Permutations
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients
    // ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0/7.0; // N=7
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 0.5*((42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) )) + 1.0);
  }

  ///////////////////////////////
  // SDFs

float sdSphere( vec3 p, float s ) {
  return length(p)-s;
}

// Scene SDF
float sceneSDF(vec3 p) {    
  // return sdSphere(samplePoint, 0.5);
  float d1 = sdSphere(p, 0.4);

  float d2 = 0.2*snoise(2.0*(p + 0.2*iTime));

  return d1 - d2;
}

// Calculates surface normal
vec3 calcNormal( in vec3 pos ) {
  vec2 e = vec2(1.0,-1.0)*0.5773;
  const float eps = 0.0005;  // small increment epsilon
  return normalize( e.xyy*sceneSDF( pos + e.xyy*eps ) + 
          e.yyx*sceneSDF( pos + e.yyx*eps ) + 
          e.yxy*sceneSDF( pos + e.yxy*eps ) + 
          e.xxx*sceneSDF( pos + e.xxx*eps ) );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

  // camera movement	
	float angle = 0.25 * PI * iTime + 0.75 * PI;
	vec3 eye = vec3( 1.2*cos(angle), 0.4, 1.2*sin(angle) );
  vec3 center = vec3( 0.0, 0.0, 0.0 );
	// vec3 eye = vec3( 1., 0.4, -1.);
  // vec3 center = vec3( 0., 0., 0.);
  // camera matrix
  vec3 ww = normalize( center - eye );  // vect from center to eye
  vec3 uu = normalize( cross(ww, vec3(0.0,1.0,0.0)) );  // cross with up
  vec3 vv = normalize( cross(uu, ww) );

  vec3 tot = vec3(0.0);
  
  #if AA>1  // anti-aliasing passes
  for( int m=0; m<AA; m++ )
  for( int n=0; n<AA; n++ ) {
    // pixel coordinates
    vec2 offset = vec2(float(m),float(n)) / float(AA) - 0.5;  // offset for anti-aliasing passes
    vec2 p = (-iResolution.xy + 2.0*(fragCoord.xy+offset))/iResolution.y;
    #else    
    vec2 p = (-iResolution.xy + 2.0*fragCoord.xy)/iResolution.y;
    #endif

    // create view ray
    vec3 ray = normalize( p.x*uu + p.y*vv + 1.5*ww );

    // raymarch
    float dTot = 0.0;
    for( int i=0; i<256; i++ ) {
      vec3 pos = eye + dTot*ray;
      float d = sceneSDF(pos);
      if( d < 0.0001 || dTot > D_MAX ) break;
      dTot += d;
    }
    // shading/lighting
    vec3 color = vec3(0.0);
    if( dTot < D_MAX ) {
      vec3 pos = eye + dTot * ray;  // position of point on surface
      vec3 normal = calcNormal(pos);  // surface normal
      float diffuse = clamp( dot(normal, vec3(0.6)), 0.0, 1.0 );
      float ambient = 0.5 + 0.5 * dot(normal, vec3(0.0,1.0,0.0));
      color = vec3(0.5882, 0.302, 0.302) * ambient + vec3(0.098, 0.1843, 0.5882) * diffuse;
    }

    // gamma
    color = sqrt( color );
    tot += color;
    #if AA>1
  }
  tot /= float(AA*AA);  // take mean if multiple anti-aliasing passes
  #endif

      if( tot == vec3( 0.0 ) ) {
    fragColor = vec4( tot, 0.0 );
    } else {
      fragColor = vec4( tot, 1.0 );}
  }
`;

export const Shadertoy = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<any>(null);
  const vp_size = useRef([255, 255]);
  const shaderProgram = useRef<{
    inPos: number[];
    iTime: number;
    iMouse: number[];
    iResolution: number[];
  }>(null);
  const bufObj = useRef<{ inx: number[]; pos: number[] }>([]);
  const mousepos = useRef([0, 0]);

  function initScene() {
    if (!canvas.current) {
      return;
    }

    glRef.current = canvas.current.getContext('experimental-webgl');

    if (!glRef.current) {
      return;
    }

    canvas.current.addEventListener('mousemove', (e) => {
      mousepos.current = [e.clientX, e.clientY];
    });

    shaderProgram.current = glRef.current.createProgram();
    if (!shaderProgram.current) {
      return;
    }

    let status = null;

    let vertexSource = `
        attribute vec2 inPos;

        void main() {
            gl_Position = vec4(inPos, 0.0, 1.0);
        }
    `;

    let vertexShaderObj = glRef.current.createShader(glRef.current.VERTEX_SHADER);
    glRef.current.shaderSource(vertexShaderObj, vertexSource);
    glRef.current.compileShader(vertexShaderObj);

    status = glRef.current.getShaderParameter(
      vertexShaderObj,
      glRef.current.COMPILE_STATUS,
    );
    if (!status) console.error(glRef.current.getShaderInfoLog(vertexShaderObj));

    glRef.current.attachShader(shaderProgram.current, vertexShaderObj);
    glRef.current.linkProgram(shaderProgram.current);

    let fragmentSource = `
        precision mediump float;
        uniform vec2 iResolution;
        uniform vec2 iMouse;
        uniform float iTime;

        ${shader}

        void main() {
            mainImage( gl_FragColor, gl_FragCoord.xy );
        }
    `;

    let fragmentShaderObj = glRef.current.createShader(glRef.current.FRAGMENT_SHADER);
    glRef.current.shaderSource(fragmentShaderObj, fragmentSource);
    glRef.current.compileShader(fragmentShaderObj);

    status = glRef.current.getShaderParameter(
      fragmentShaderObj,
      glRef.current.COMPILE_STATUS,
    );
    if (!status) console.error(glRef.current.getShaderInfoLog(fragmentShaderObj));

    glRef.current.attachShader(shaderProgram.current, fragmentShaderObj);
    glRef.current.linkProgram(shaderProgram.current);

    status = glRef.current.getProgramParameter(
      shaderProgram.current,
      glRef.current.LINK_STATUS,
    );
    if (!status) console.error(glRef.current.getProgramInfoLog(shaderProgram.current));

    shaderProgram.current.inPos = glRef.current.getAttribLocation(
      shaderProgram.current,
      'inPos',
    );
    shaderProgram.current.iTime = glRef.current.getUniformLocation(
      shaderProgram.current,
      'iTime',
    );
    shaderProgram.current.iMouse = glRef.current.getUniformLocation(
      shaderProgram.current,
      'iMouse',
    );
    shaderProgram.current.iResolution = glRef.current.getUniformLocation(
      shaderProgram.current,
      'iResolution',
    );

    glRef.current.useProgram(shaderProgram.current);

    var pos = [-1, -1, 1, -1, 1, 1, -1, 1];
    var inx = [0, 1, 2, 0, 2, 3];
    bufObj.current.pos = glRef.current.createBuffer();
    glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, bufObj.current.pos);
    glRef.current.bufferData(
      glRef.current.ARRAY_BUFFER,
      new Float32Array(pos),
      glRef.current.STATIC_DRAW,
    );
    bufObj.current.inx = glRef.current.createBuffer();
    bufObj.current.inx.len = inx.length;
    glRef.current.bindBuffer(glRef.current.ELEMENT_ARRAY_BUFFER, bufObj.current.inx);
    glRef.current.bufferData(
      glRef.current.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(inx),
      glRef.current.STATIC_DRAW,
    );
    glRef.current.enableVertexAttribArray(shaderProgram.current.inPos);
    glRef.current.vertexAttribPointer(
      shaderProgram.current.inPos,
      2,
      glRef.current.FLOAT,
      false,
      0,
      0,
    );
    glRef.current.enable(glRef.current.DEPTH_TEST);
    glRef.current.clearColor(0.0, 0.0, 0.0, 1.0);

    window.onresize = resize;
    resize();
    requestAnimationFrame(render);
  }

  function resize() {
    if (!canvas.current) {
      return;
    }

    vp_size.current = [window.innerWidth, window.innerHeight]; // [256, 256]
    canvas.current.width = vp_size.current[0];
    canvas.current.height = vp_size.current[1];
  }

  function render(deltaMS: number) {
    const gl = glRef.current;

    if (!gl || !canvas.current || !shaderProgram.current) {
      return;
    }

    glRef.current.viewport(0, 0, canvas.current.width, canvas.current.height);
    glRef.current.clear(glRef.current.COLOR_BUFFER_BIT | glRef.current.DEPTH_BUFFER_BIT);
    glRef.current.uniform1f(shaderProgram.current.iTime, deltaMS / 1000.0);
    glRef.current.uniform2f(
      shaderProgram.current.iResolution,
      canvas.current.width,
      canvas.current.height,
    );
    glRef.current.uniform2f(
      shaderProgram.current.iMouse,
      mousepos.current[0],
      mousepos.current[1],
    );
    glRef.current.drawElements(
      glRef.current.TRIANGLES,
      bufObj.current.inx.len,
      glRef.current.UNSIGNED_SHORT,
      0,
    );

    requestAnimationFrame(render);
  }

  useEffect(() => {
    initScene();
  }, []);

  return (
    <canvas
      style={{
        border: 'none',
        position: 'fixed',
        top: 50,
        right: 50,
        // bottom: 0,
        // left: '50%',
        zIndex: 10,
        width: 100,
        height: 100,
        // transform: 'translate3d(-50%, -50%,0)'
      }}
      ref={canvas}
    />
  );
};
