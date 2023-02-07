import { createProgram, createShader } from './gl-utils.js';
import { createCanvas, fetchTex } from './utils.js';

const canvas = createCanvas(600, 500, document.body);

const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL não suportado nesse navegador');
  throw new Error('WebGL não suportado nesse navegador');
}

const main = (vertexShaderSource, fragmentShaderSource) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
};

Promise.all([
  fetchTex('./vertex-shader.glsl'),
  fetchTex('./fragment-shader.glsl')
]).then(([vertexShaderSource, fragmentShaderSource]) => {
  main(vertexShaderSource, fragmentShaderSource);
})

