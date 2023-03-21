import { createProgram, createShader } from './gl-utils.js';
import { createCanvas, degToRad, fetchImage, fetchTex, makeZToWMatrix, Mat4 } from './utils.js';

const canvas = createCanvas(600, 500, document.body);

const gl = canvas.getContext('webgl');

if (!gl) {
  alert('WebGL não suportado nesse navegador');
  throw new Error('WebGL não suportado nesse navegador');
}

const main = (vertexShaderSource, fragmentShaderSource, fTexture) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  const program = createProgram(gl, vertexShader, fragmentShader);

  const translation = [-150, 0, -360];
  const rotation = [degToRad(190), degToRad(40), degToRad(320)];
  const scale = [1, 1, 1];
  const fieldOfViewRadians = degToRad(60);
  
  // Compute the matrix
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 1;
  const zFar = 2000;


  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');
  const matrixLocation = gl.getUniformLocation(program, 'u_matrix');
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
  // Put geometry data into buffer
  setGeometry(gl);

  // Create a texture.
  const texture = gl.createTexture();
  // gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  //  new Uint8Array([0, 0, 255, 255]));

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, fTexture);
  gl.generateMipmap(gl.TEXTURE_2D);
  
  // Create a buffer for texcoords.
  const texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordLocation);

  // We'll supply texcoords as floats.
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Set Texcoords.
  setTexcoords(gl);

  let previousTimestamp = 0;

  function render(timestamp) {

    // convert to seconds
    timestamp *= 0.001;
    // Subtract the previous time from the current time
    const deltaTime = timestamp - previousTimestamp;
    // Remember the current time for the next frame.
    previousTimestamp = timestamp;

    // Faze de renderização
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Turn on culling. By default backfacing triangles
    // will be culled.
    gl.enable(gl.CULL_FACE);

    gl.enable(gl.DEPTH_TEST);

    // Animate the rotation
    rotation[0] += -0.7 * deltaTime;
    rotation[1] += -0.4 * deltaTime;

    // Limpa o canvas
    gl.clearColor(0, 0, 0, 0);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // Seta o nosso programa para execução
    gl.useProgram(program);

    // Compute the projection matrix
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const projectionMatrix =
        Mat4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    const cameraPosition = [0, 0, 2];
    const up = [0, 1, 0];
    const target = [0, 0, 0];

    // Compute the camera's matrix using look at.
    const cameraMatrix = Mat4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    const viewMatrix = Mat4.inverse(cameraMatrix);

    const viewProjectionMatrix = Mat4.multiply(projectionMatrix, viewMatrix);

    let matrix = Mat4.xRotate(viewProjectionMatrix, rotation[0]);
    matrix = Mat4.yRotate(matrix, rotation[1]);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);



    // Configura o atributo para saber como extrair dados do buffer array
    const size = 3;          // 3 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

    {
      const primitiveType = gl.TRIANGLES;
      const offset = 0;
      const count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
};

// Fill the buffer with the values that define a letter 'F'.
function setGeometry(gl) {
  const positions = new Float32Array([
    -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
    0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
    0.5,  0.5,  -0.5,
    0.5, -0.5,  -0.5,

    -0.5, -0.5,   0.5,
    0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
    -0.5,  0.5,   0.5,
    0.5, -0.5,   0.5,
    0.5,  0.5,   0.5,

    -0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
    0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
    0.5,   0.5,  0.5,
    0.5,   0.5, -0.5,

    -0.5,  -0.5, -0.5,
    0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,  -0.5,  0.5,
    0.5,  -0.5, -0.5,
    0.5,  -0.5,  0.5,

    -0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5,  0.5,
    -0.5,   0.5, -0.5,

    0.5,  -0.5, -0.5,
    0.5,   0.5, -0.5,
    0.5,  -0.5,  0.5,
    0.5,  -0.5,  0.5,
    0.5,   0.5, -0.5,
    0.5,   0.5,  0.5,
  ]);

  // Center the F around the origin and Flip it around. We do this because
  // we're in 3D now with and +Y is up where as before when we started with 2D
  // we had +Y as down.

  // We could do by changing all the values above but I'm lazy.
  // We could also do it with a matrix at draw time but you should
  // never do stuff at draw time if you can do it at init time.
  let matrix = Mat4.identity();// Mat4.xRotation(Math.PI);
  matrix = Mat4.translate(matrix, -50, -75, -15);

  for (let ii = 0; ii < positions.length; ii += 3) {
    const vector = [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]
    positions[ii + 0] = vector[0] * 1;
    positions[ii + 1] = vector[1] * 1;
    positions[ii + 2] = vector[2] * 1;
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer
// with texture coordinates for the letter 'F'.
function setTexcoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      // select the top left image
      0   , 0  ,
      0   , 0.5,
      0.25, 0  ,
      0   , 0.5,
      0.25, 0.5,
      0.25, 0  ,
      // select the top middle image
      0.25, 0  ,
      0.5 , 0  ,
      0.25, 0.5,
      0.25, 0.5,
      0.5 , 0  ,
      0.5 , 0.5,
      // select to top right image
      0.5 , 0  ,
      0.5 , 0.5,
      0.75, 0  ,
      0.5 , 0.5,
      0.75, 0.5,
      0.75, 0  ,
      // select the bottom left image
      0   , 0.5,
      0.25, 0.5,
      0   , 1  ,
      0   , 1  ,
      0.25, 0.5,
      0.25, 1  ,
      // select the bottom middle image
      0.25, 0.5,
      0.25, 1  ,
      0.5 , 0.5,
      0.25, 1  ,
      0.5 , 1  ,
      0.5 , 0.5,
      // select the bottom right image
      0.5 , 0.5,
      0.75, 0.5,
      0.5 , 1  ,
      0.5 , 1  ,
      0.75, 0.5,
      0.75, 1  ,
    ]),
    gl.STATIC_DRAW);
}

Promise.all([
  fetchTex('./vertex-shader.glsl'),
  fetchTex('./fragment-shader.glsl'),
  fetchImage('./noodles.jpg'),
]).then(([vertexShaderSource, fragmentShaderSource, texture]) => {
  main(vertexShaderSource, fragmentShaderSource, texture);
})

