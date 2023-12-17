import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.0/mod.js"

//readme.md:start

//md: ![./logo_wide.png](./logo_wide.png)
//md: ## 1. import
import {
    f_o_gpu_gateway, 
    f_o_gpu_gateway__from_simple_fragment_shader,
    f_o_gpu_texture__from_s_url,
    f_render_o_gpu_gateway,
    f_update_data_in_o_gpu_gateway
}
from './client.module.js'
//readme.md:end

let a_o_test = [
    f_o_test(
        "simple_shader", 
        async ()=>{

            //readme.md:start
            //md: ## 2. create a canvas
            let o_canvas = document.createElement('canvas');
            o_canvas.width = 300
            o_canvas.height = 300
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
                // data passed from javascript 
                uniform float n_ms_time;
                uniform vec2 o_trn_nor_mouse;
                void main() {
                    float n = length(o_trn_nor_pixel-o_trn_nor_mouse);
                    n = sin(n*33.+n_ms_time*0.002);
                    fragColor = vec4(
                        vec3(n),
                        1
                    );
                }
                `,
            )
            //md: ## 4. render the gpu gateway
            f_render_o_gpu_gateway(
                o_gpu_gateway
            );
            //readme.md:end
        }
    ), 
    f_o_test(
        'passing_data_to_shader_and_re_render', 
        async ()=>{
            //md: ## 5. pass data to the gpu and render continiously
            //md: of course it only gets real fun when we pass data to the gpu and render it frequently
            window.setInterval(function(){
                // we can update the data we want, its more performant to update only the data that changes
                f_update_data_in_o_gpu_gateway(
                    {
                        n_ms_time: window.performance.now()
                    },
                    o_gpu_gateway
                );
                // we have to render to see the result
                f_render_o_gpu_gateway(
                    o_gpu_gateway
                );
            },1000/60)
            //md: as i said its more performant to update the data only if it has changed, so we can use for example 
            //md: a mousemove event wich only triggers when the mouse is moved
            o_gpu_gateway.o_canvas?.addEventListener('mousemove', function(o_e){
                let o_bounding_rect = o_e.target.getBoundingClientRect();
                let n_nor__x = (o_e.clientX - o_bounding_rect.left)/o_bounding_rect.width;
                let n_nor__y = (o_e.clientY - o_bounding_rect.top)/o_bounding_rect.height;
                f_update_data_in_o_gpu_gateway(
                    {
                        o_trn_nor_mouse: [n_nor__x, 1.-n_nor__y]
                    },
                    o_gpu_gateway
                );
            });
        }
    ), 
    f_o_test(
        "passing_texture_to_shader", 
        async ()=>{
            //md: ## 6. data types...
            //md: when working with the cpu and gpu communicating with each other it is a bit difficult with datatypes
            //md: the following shows what is possible and what should be used

            //md: ## 2. create a canvas
            let o_canvas2 = document.createElement('canvas');
            o_canvas2.width = 300
            o_canvas2.height = 300
            document.body.appendChild(o_canvas2);



            let o_data_for_gpu = {
                logo_image_texture: await f_o_gpu_texture__from_s_url('./logo.jpg'),
                // a simple number value will be unifrom float n_t; in shader
                n_t: window.performance.now(), 
                n_id_frame: 0,
                // normal arrays can only contain up to 4 values
                // will be of type vec2 , vec3 or vec4
                o_scl : [o_canvas2.width,o_canvas2.height],
                o_trn_nor_mouse : [0,0],
                // 'n_i' variable starting with this prefix will be numbers integers to be specific
                // n_i_b the b here only indicates that it should be interpreted as a boolean 
                n_i_b_pointer_down: 0, 
                n_i_b_mouse_moved_since_last_frame: 0,

            }

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

                // // -------------------------------- this will be dynamically generated
                // uniform sampler2D a_o_vec4_0;

                // int f_n_idx_from_o_trn(ivec2 o_trn, ivec2 o_scl){
                //     return (o_trn.y*o_scl.x)+o_trn.x;
                // }
                // vec4 f_vec4_last_frame(vec2 o_trn_nor){
                //     ivec2 o_scl = vec2(300,300);//will be dynamically known
                //     int n_idx_start_last_frame = 2132;// will be dynamically known
                //     int n_idx = f_n_idx_from_o_trn(
                //         ivec2(o_trn_nor)*o_scl, o_scl
                //     )+n_idx_start_last_frame;
                //     vec2 o_scl_big_texture = vec2(4096);
                    
                //     vec2 o_trn_on_big_texture = vec2(
                //         mod(n_idx, o_scl_big_texture.x), 
                //         float(int(n_idx/o_scl_big_texture.x))
                //     );
                //     return texture(a_o_vec4_0, o_trn_on_big_texture/o_scl_big_texture);
                // }
                // // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ this will be dynamically generated



                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                uniform float n_ms_time;
                uniform vec2 o_trn_nor_mouse;
                uniform sampler2D logo_image_texture; 

                void main() {
                    vec4 o_pixel_value = texture(logo_image_texture, o_trn_nor_pixel); 
                    fragColor = vec4(
                        vec3(o_pixel_value.r),
                        1
                    );
                }
                `,
            )
            f_update_data_in_o_gpu_gateway(
                {
                    logo_image_texture: await f_o_gpu_texture__from_s_url('./logo.jpg'),
                }, 
                o_gpu_gateway2,
            )
            f_render_o_gpu_gateway(
                o_gpu_gateway2
            );

        }
    ), 
    f_o_test(
        "helper_function_to_quickly_create_shader", 
        async ()=>{

            //md: ### IALAF (i am lazy as f$#@) functions
            //md: this is one of the shortest way to get a shader!
            let o = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision mediump float;
                in vec2 o_trn_nor_pixel;
                out vec4 fragColor;
                uniform float n_ms_time;
                void main() {
                    float n = length(
                        o_trn_nor_pixel-.5
                    ); 
                    fragColor = vec4(
                        vec3(sin(n*33.+n_ms_time*.001)),
                        1
                    );
                }
                `,
                500, 
                500
            )
            window.setInterval(()=>{
                f_update_data_in_o_gpu_gateway({n_ms_time: window.performance.now()},o);
                f_render_o_gpu_gateway(o);
            })
            document.body.appendChild(o.o_canvas)
        }
    ), 
    f_o_test(
        "error_messages", 
        async ()=>{

            //md: ### errors, 
            //md: upon an error you will get a rustlike error output
            //md: for example in the following we have multiple errors
            let o = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision mediump float;
                in vec2 o_trn_nor_pixel;
                out vec4 fragColor;
                void main() {
                    float n = length(
                        o_trn_nor_pixel-vec3(.5) // we cannot subtract a vec3 from vec2
                    ); 
                    fragColor = vec4(
                        vec3(sin(n_min*33.)), // use of undeclared identifier
                        1
                    );
                }}
                `,
                500, 
                500
            );
            document.body.appendChild(o.o_canvas);

            // //md: the output will be like 
            // // ERROR '-'
            // //   |
            // // 7 |            o_trn_nor_pixel-vec3(.5) // we cannot subtract a vec3 from vec2
            // //   |                           ^ wrong operand types - no operation '-' exists that takes a left-hand operand of type 'in mediump 2-component vector of float' and a right operand of type 'const 3-component vector of float' (or there is no acceptable conversion)

            // // ERROR 'n_min'
            // //    |
            // // 10 |            vec3(sin(n_min*33.)), // use of undeclared identifier
            // //    |                     ^^^^^ undeclared identifier

            // // ERROR '}'
            // //    |
            // // 13 |    }}
            // //    |    -- syntax error

        }
    )
]


f_display_test_selection_or_run_selected_test_and_print_summary(
    a_o_test
)

// //readme.md:end