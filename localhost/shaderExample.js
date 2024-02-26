// Get WebGL context
const canvas = document.getElementById('webglCanvas');
const gl = canvas.getContext('webgl2');
if (!gl) {
    alert('WebGL 2 not supported');
}

// Vertex shader program
let vsSource = `#version 300 es
layout(std140) uniform ExampleBlock {
    float scale;
    vec3 color;
} example;

out vec3 vColor;

void main(void) {
    gl_Position = vec4(0.5, 0.0, 0.0, 1.0); // Simple point at center
    gl_PointSize = 10.0 * example.scale; // Use scale from uniform block
    vColor = example.color; // Pass color to fragment shader
    // vColor = vec3(1.,0.,0.);        
}
`;

// Fragment shader program
let fsSource = `#version 300 es
precision mediump float;
in vec3 vColor;
out vec4 fragColor;


void main(void) {
    fragColor = vec4(vColor, 1.0);
}
`;


function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(shaderProgram);
console.log({
    gl_get_error: gl.getError()
})

const blockIndex = gl.getUniformBlockIndex(shaderProgram, 'ExampleBlock');
gl.uniformBlockBinding(shaderProgram, blockIndex, 0); // 0 is the binding point
console.log({
    gl_get_error: gl.getError()
})
// Create a uniform buffer object and bind it to the uniform block
const blockSize = 32; // This size may need adjustment depending on the layout and padding
const uniformBuffer = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
gl.bufferData(gl.UNIFORM_BUFFER, blockSize, gl.DYNAMIC_DRAW);
// gl.bindBufferBase(gl.UNIFORM_BUFFER, blockIndex, uniformBuffer);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffer); // Binding point 0
console.log({
    gl_get_error: gl.getError()
})

const dataSize = gl.getBufferParameter(gl.UNIFORM_BUFFER, gl.BUFFER_SIZE);
console.log("Data size:", dataSize);
console.log({
    gl_get_error: gl.getError()
})

// Fill the buffer with data
// Assuming the block size might need to account for padding, though in this simple case it might not be necessary
const data = new Float32Array([
    1.5, 0.0, 0.0, 0.0, // scale (float)
//  ^sclae
//       ^  ^  ^ padding 

    1.0, 0.0, 1.0, 0.0
//                 ^ padding
    
// ^ color (vec3)
                               // Potential padding if needed for alignment
                              ]);
gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data);

console.log({
    gl_get_error: gl.getError()
})
// Draw
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(shaderProgram);
// Assuming you've already bound the uniform buffer and set the data
gl.drawArrays(gl.POINTS, 0, 1);
console.log({
    gl_get_error: gl.getError()
})