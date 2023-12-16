//readme.md:start

//md: #gpugateway
//md: how to: 
//md: ## 1. import
import {
    f_o_gpu_gateway, f_render_o_gpu_gateway
}
from './client.module.js'


//md: ## 2. create a canvas
let o_canvas = document.createElement('canvas');
o_canvas.width = window.innerWidth
o_canvas.height = window.innerHeight
document.body.appendChild(o_canvas);

//md: ## 3. create the gpu gateway 
let o_gpu_gateway = f_o_gpu_gateway(
    o_canvas, 
    `#version 300 es
    in vec4 a_o_vec_position_vertex;
    out vec2 o_trn_nor_pixel;
    void main() {
        gl_Position = a_o_vec_position_vertex;
        o_trn_nor_pixel = (a_o_vec_position_vertex.xy + 1.0) / 2.0; // Convert from clip space to texture coordinates
    }`,
    `#version 300 es
    precision mediump float;
    // incoming variables
    in vec2 o_trn_nor_pixel;
    // outgoing variables
    out vec4 fragColor;
    void main() {
        fragColor = vec4(
            vec3(length(o_trn_nor_pixel)),
            1
        );
    }
    `,
)

//md: ## 4. render the gpu gateway
f_render_o_gpu_gateway(
    o_gpu_gateway
);


//md: ## 2. create a canvas
let o_canvas2 = document.createElement('canvas');
o_canvas2.width = window.innerWidth
o_canvas2.height = window.innerHeight
document.body.appendChild(o_canvas2);

//md: ## 3. create the gpu gateway 
let o_gpu_gateway2 = f_o_gpu_gateway(
    o_canvas2, 
    `#version 300 es
    in vec4 a_o_vec_position_vertex;
    out vec2 o_trn_nor_pixel;
    void main() {
        gl_Position = a_o_vec_position_vertex;
        o_trn_nor_pixel = (a_o_vec_position_vertex.xy + 1.0) / 2.0; // Convert from clip space to texture coordinates
    }`,
    `#version 300 es
    precision mediump float;
    // incoming variables
    in vec2 o_trn_nor_pixel;
    // outgoing variables
    out vec4 fragColor;
    void main() {d
        fragColor = vec4(
            vec3(length(o_trn_nor_pixel)),
            1
        );
    }
    `,
)

//md: ## 4. render the gpu gateway
f_render_o_gpu_gateway(
    o_gpu_gateway2
);


//readme.md:end