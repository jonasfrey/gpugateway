import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test
} from "https://deno.land/x/deno_test_server_and_client_side@1.1/mod.js"

//readme.md:start

//md: ![./logo_wide.png](./logo_wide.png)
//md: ## 1. import
import {
    f_o_gpu_gateway, 
    f_o_gpu_gateway__from_simple_fragment_shader,
    f_o_gpu_texture__from_o_web_api_object,
    f_render_o_gpu_gateway,
    f_update_data_in_o_gpu_gateway,

}
from './client.module.js'
import { O_gpu_texture, O_gpu_texture_collection_item } from "./classes.module.js";
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
        'passing_simple_data_to_shader_and_re_render', 
        async ()=>{
            //md: ## 5. pass data to the gpu and render continiously
            //md: of course it only gets real fun when we pass data to the gpu and render it frequently
            window.setInterval(function(){
                // we can update the data we want, its more performant to update only the data that changes
                f_update_data_in_o_gpu_gateway(
                    {
                        // in this object                       //inside shader/glsl
                        // ------------------------------------------------------------------
                        n_ms_time: window.performance.now(),    // "uniform float n_ms_time"
                        o_scl : [
                            o_canvas2.width,
                            o_canvas2.height
                        ],                                      // "uniform vec2 o_scl"
                        o_pos : [0,-25, 89.122],                // "uniform vec3 o_pos"
                        a_n_data : [0,-25, 89.122],             // "uniform vec4 a_n_data"

                        //'n_i...' prefix will be converted to int
                        n_i_b_pointer_down: 0,                  // "uniform int n_i_b_pointer_down" , 

                        // data like longer arrays that 4 values, or strings are 'not supported'
                        // it can be passed as typed arrays 
                        a_v: [1,2,3,4,4,5,1,23,3,4,51,1],// not supported!
                        s_name: 'hans'//not supported! 

                    },
                    o_gpu_gateway
                );
                // we have to render to see the result
                f_render_o_gpu_gateway(
                    o_gpu_gateway
                );
            },1000/60)

            o_gpu_gateway.o_canvas?.addEventListener('pointerdown', ()=>{
                f_update_data_in_o_gpu_gateway({n_i_b_pointer_down: 1});
            });
            o_gpu_gateway.o_canvas?.addEventListener('pointerup', ()=>{
                f_update_data_in_o_gpu_gateway({n_i_b_pointer_down: 0});
            });
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
            
            let o_video = document.createElement('video');
            o_video.controls = true;
            document.body.appendChild(o_video)
            // o_video.src = 'https://www.w3schools.com/tags/mov_bbb.mp4';//may not work because of tainted cross data
            o_video.src = './mov_bbb.mp4';

            //md: ## 6. data types...
            //md: when working with the cpu and gpu communicating with each other it is a bit difficult with datatypes
            //md: the following shows what is possible and what should be used

            //md: ## 2. create a canvas
            let o_canvas2 = document.createElement('canvas');
            o_canvas2.width = 300
            o_canvas2.height = 300
            document.body.appendChild(o_canvas2);
            let o_data = {
                // texture from image
                logo_image_texture: f_o_gpu_texture__from_o_web_api_object(
                    await(async ()=>{
                        let o_mod_handyhelpers = await import('https://deno.land/x/handyhelpers@3.4/mod.js');
                        return await o_mod_handyhelpers.f_o_image_data_from_s_url(
                            './logo.jpg'
                        )
                    })()
                ),
                //also available
                // texture_from_ImageData: f_o_gpu_texture__from_o_web_api_object(
                //     o_instance_of_ImageData
                // ),
                // texture_from_HTMLImageElement: f_o_gpu_texture__from_o_web_api_object(
                //     o_instance_of_HTMLImageElement
                // ),
                // texture_from_HTMLCanvasElement: f_o_gpu_texture__from_o_web_api_object(
                //     o_instance_of_HTMLCanvasElement
                // ),
                // texture_from_HTMLVideoElement: f_o_gpu_texture__from_o_web_api_object(
                //     o_instance_of_HTMLVideoElement
                // ),
                // texture_from_ImageBitmap: f_o_gpu_texture__from_o_web_api_object(
                //     o_instance_of_ImageBitmap
                // )

                // ...Object.assign({},
                //     new Array(100).fill(0).map(v,n=>{
                //         return {
                //             [`auto_rand_texture${n}`]: 
                //         }        
                //     })
                // )
                // simple_texture: new O_gpu_texture(
                //     new Uint8Array([
                //         0,1,0,1,
                //         1,1,1,0,
                //         0,1,0,1,
                //         1,1,1,1,
                //     ].map(n=>parseInt(n*255))),
                //     4,
                //     4,
                //     o_gpu_gateway2.o_ctx.UNSIGNED_BYTE,
                //     o_gpu_gateway2.o_ctx.LUMINANCE,
                //     o_gpu_gateway2.o_ctx.LUMINANCE,
                //     0,
                //     0
                // )
            }
            console.log(o_data)
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

                // vec4 o_pixel_value_simple_texture = texture(simple_texture, o_trn_nor_pixel); 
                // vec4 a_o_color[] = vec4[](
                //     o_pixel_value_logo_image_texture, 
                //     o_pixel_value_simple_texture
                // );

                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                uniform sampler2D logo_image_texture; 
                // uniform sampler2D small_texture; 
                // uniform sampler2D simple_texture; 
                uniform sampler2D image_from_video;

                void main() {
                    vec4 o_pixel_value_logo_image_texture = texture(logo_image_texture, o_trn_nor_pixel); 
                    // vec4 o_pixel_value_small_texture = texture(small_texture, o_trn_nor_pixel); 
                    // vec4 o_pixel_value_simple_texture = texture(simple_texture, o_trn_nor_pixel); 
                    vec4 o_pixel_value_image_from_video = texture(image_from_video, o_trn_nor_pixel); 

                    fragColor = vec4(
                        o_pixel_value_image_from_video.rgb,
                        // vec3(o_pixel_value_image_from_video.r),
                        // vec3(1.),
                        1.0
                    );
                }
                `,
            )
            f_update_data_in_o_gpu_gateway(
                o_data,
                o_gpu_gateway2,
            )
            f_render_o_gpu_gateway(
                o_gpu_gateway2
            );
            o_video.addEventListener('canplaythrough', function() {
                // Now the video is ready to be used as a texture
                window.setInterval(()=>{
                    f_update_data_in_o_gpu_gateway(
                        {image_from_video: f_o_gpu_texture__from_o_web_api_object(o_video)},
                        o_gpu_gateway2,
                    )
                    f_render_o_gpu_gateway(
                        o_gpu_gateway2
                    );
                },10)
            }, false);


            let o = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision mediump float;
                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                uniform sampler2D image_from_video;
                void main() {
                    vec4 o_pixel_value_image_from_video = texture(image_from_video, o_trn_nor_pixel); 
                    fragColor = vec4(
                        o_pixel_value_image_from_video.gbr,
                        1.0
                    );
                }
                `,
                1000, 
                1000
            );
            document.body.appendChild(o.o_canvas);
            window.setInterval(
                ()=>{
                    f_update_data_in_o_gpu_gateway(
                        {image_from_video: f_o_gpu_texture__from_o_web_api_object(o_video)},
                        o,
                    )
                    f_render_o_gpu_gateway(o)
                },
                33
            )
        }
    ), 
    f_o_test(
        "checking_if_when_i_pass_a_texture_to_one_shader_if_the_other_shader_also_has_the_data", 
        async ()=>{
            
            let o_video = document.createElement('video');
            o_video.controls = true;
            document.body.appendChild(o_video)
            // o_video.src = 'https://www.w3schools.com/tags/mov_bbb.mp4';//may not work because of tainted cross data
            o_video.src = './mov_bbb.mp4';

            let o_gg1 = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision mediump float;
                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                uniform sampler2D image_from_video;
                void main() {
                    vec4 o_pixel_value_image_from_video = texture(image_from_video, o_trn_nor_pixel); 
                    fragColor = vec4(
                        1.-o_pixel_value_image_from_video.rgb,
                        1.0
                    );
                }
                `,
                100, 
                100
            );
            document.body.appendChild(o_gg1.o_canvas);

            window.setInterval(
                ()=>{
                    f_update_data_in_o_gpu_gateway(
                        {image_from_video: f_o_gpu_texture__from_o_web_api_object(o_video)},
                        o_gg1,
                    )
                    f_render_o_gpu_gateway(o_gg1)
                },
                33
            )

            let o_gg2 = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision mediump float;
                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                uniform sampler2D image_from_video;
                void main() {
                    vec4 o_pixel_value_image_from_video = texture(image_from_video, o_trn_nor_pixel); 
                    fragColor = vec4(
                        o_pixel_value_image_from_video.gbr,
                        1.0
                    );
                }
                `,
                1000, 
                1000
            );
            document.body.appendChild(o_gg2.o_canvas);
            window.setInterval(
                ()=>{
                    // the data unfortunately is not available in the second shader, we also have to update it
                    f_update_data_in_o_gpu_gateway(
                        {image_from_video: f_o_gpu_texture__from_o_web_api_object(o_video)},
                        o_gg2,
                    )
                    f_render_o_gpu_gateway(o_gg2)
                },
                33
            )
        }
    ), 
    f_o_test(
        "webcam_test_with_multiple_textures", 
        async ()=>{
            
            let o_video = document.createElement('video');
            document.body.appendChild(o_video)
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                o_video.srcObject = stream;
            } catch (err) {
                console.error('Error accessing webcam:', err);
            }

            let n_len_a_o_image_data = 32;
            let n_idx_a_o_image_data = 0;
            let a_o_image_data = new Array(n_len_a_o_image_data).fill(null);
            // we have to wait a bit otherwise we get webgl2 context lost
            let f_s_name_texture_from_n_idx = (n_idx) =>{return `image_${n_idx}`}
            window.setTimeout(function(){
                let o_gg1 = f_o_gpu_gateway__from_simple_fragment_shader(
                    `#version 300 es
                    precision mediump float;
                    // incoming variables
                    in vec2 o_trn_nor_pixel;
                    // outgoing variables
                    out vec4 fragColor;
                    // data passed from javascript 
                    ${new Array(n_len_a_o_image_data).fill(0).map((v,n_idx)=>{
                        return `uniform sampler2D ${f_s_name_texture_from_n_idx(n_idx)};`
                    }).join('\n')}
                    uniform sampler2D image_from_video;
                    uniform float n_idx_newest_texture;
                    void main() {
                        vec2 o_trn_flipped = vec2(
                            o_trn_nor_pixel.x, 
                            1.-o_trn_nor_pixel.y
                        );
                        vec4 a_o_pixel[] = vec4[](
                            ${new Array(n_len_a_o_image_data).fill(0).map((v,n_idx)=>{
                                return `texture(${f_s_name_texture_from_n_idx(n_idx)}, o_trn_flipped)`
                            }).join('\n,')}
                        );
                        float n_idx = o_trn_nor_pixel.x*${n_len_a_o_image_data}.;
                        n_idx = mod(n_idx+n_idx_newest_texture, ${n_len_a_o_image_data}.);
                        // if(n_idx == n_idx_newest_texture){
                            fragColor = vec4(
                                a_o_pixel[int(n_idx)].rgb,
                                // a_o_pixel[0].rgb,
                                1.0
                            );
                        // }
                        // fragColor = vec4(n_idx_newest_texture/32.);
                    }
                    `,
                    500, 
                    500
                );
                document.body.appendChild(o_gg1.o_canvas);
                window.setInterval(
                    ()=>{
                        if(o_video.HAVE_CURRENT_DATA){
                            let o_can = document.createElement('canvas');
                            o_can.width = o_video.videoWidth
                            o_can.height = o_video.videoHeight
                            let o_ctx2 = o_can.getContext('2d')
                            o_ctx2.drawImage(o_video, 0, 0, o_can.width, o_can.height);
                            const o_img_data = o_ctx2.getImageData(0, 0, o_can.width, o_can.height);
                            a_o_image_data[n_idx_a_o_image_data] = o_img_data
                            f_update_data_in_o_gpu_gateway(
                                {
                                    n_idx_newest_texture: n_idx_a_o_image_data,
                                    [`image_${n_idx_a_o_image_data}`]: 
                                        f_o_gpu_texture__from_o_web_api_object(o_img_data)
                                },
                                o_gg1,
                            )
                            f_render_o_gpu_gateway(o_gg1)
                            n_idx_a_o_image_data = (n_idx_a_o_image_data+1)%n_len_a_o_image_data

                        }
                    },
                    16
                )
                // Now the video is ready to be used as a texture
                // updateTexture();
            },2000)


            o_video.autoplay = true

            // http://localhost:8080/test_webbrowser.html#webcam_test_with_multiple_textures
        }
    ), 
    f_o_test(
        "type_test", 
        async ()=>{
            // now since there are only 32 textures that can be passed on my gpu , 
            // we have to have multiple 1d, 2d, 3d, 4d, nd, arrays per texture 
            let o_mod_handyhelpers = await import('https://deno.land/x/handyhelpers@3.4/mod.js');
            let o_image_data = await o_mod_handyhelpers.f_o_image_data_from_s_url(
                './logo.jpg'
            )
            console.log(o_image_data);

            let o_gg1 = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision highp usampler2D;
                precision mediump float;
                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 

                // uniform usampler2D logo_image_texture;
                uniform sampler2D logo_image_texture;
                void main() {
                    vec2 o_trn_flipped = vec2(
                        o_trn_nor_pixel.x, 
                        1.-o_trn_nor_pixel.y
                    );//* (1./4.);
                    // uvec4 o = (texture(logo_image_texture, o_trn_flipped));
                    // fragColor = vec4(float(o.g)/255.);

                    vec4 o = (texture(logo_image_texture, o_trn_flipped));
                    fragColor = vec4(o);

                }
                `,
                500, 
                500
            );
            let o_data = {
                logo_image_texture: new O_gpu_texture(
                    o_image_data.data, 
                    o_image_data.width, 
                    o_image_data.height,
                    // data as normalized float 0.0, to 1.0
                    // o_gg1.o_ctx.UNSIGNED_BYTE, //source type
                    // o_gg1.o_ctx.RGBA,//source format
                    // o_gg1.o_ctx.RGBA,//internalFormat

                    // data as u8 inside shader
                    o_gg1.o_ctx.UNSIGNED_BYTE, //source type
                    o_gg1.o_ctx.RGBA_INTEGER,//source format
                    o_gg1.o_ctx.RGBA8UI,//internalFormat
                )
            }
            
            document.body.appendChild(o_gg1.o_canvas);
            f_update_data_in_o_gpu_gateway(o_data, o_gg1)
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            f_render_o_gpu_gateway(o_gg1)

        }
    ), 
    f_o_test(
        "webgl_array_textures", 
        async ()=>{
            // now since there are only 32 textures that can be passed on my gpu , 
            // we have to have multiple 1d, 2d, 3d, 4d, nd, arrays per texture 
            let o_mod_handyhelpers = await import('https://deno.land/x/handyhelpers@3.4/mod.js');
            let o_image_data_logo = await o_mod_handyhelpers.f_o_image_data_from_s_url(
                './logo.jpg'
            )
            let o_image_data_small = await o_mod_handyhelpers.f_o_image_data_from_s_url(
                './small.jpg'
            )

            let o_gg1 = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision highp usampler2D;
                precision mediump float;
                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                // autogenerated -------------------------------------
                // uniform sampler2DArray texture_array0_RGBA;
                // uniform n_idx_texture_array0_RGBA_logo;
                // uniform n_idx_texture_array0_RGBA_small;

                vec4 f_o_logo(vec2 o_trn){
                    return texture(texture_array0_RGBA, vec3(o_trn, 0));
                }
                vec4 f_o_logo(vec2 o_trn){
                    return texture(texture_array0_RGBA, vec3(o_trn, 1));
                }
                ...
                // END autogenerated -------------------------------------


                void main() {
                    vec2 o_trn_flipped = vec2(
                        o_trn_nor_pixel.x, 
                        1.-o_trn_nor_pixel.y
                    );//* (1./4.);
                    //
                    vec4 o_color_logo = f_o_logo(o_trn_flipped);

                    fragColor = vec4(
                        o_color_logo.r,
                        o_color_small.gba
                    );

                }
                `,
                500, 
                500
            );
            let o_data = {
                logo: new O_gpu_texture_collection_item(
                    o_image_data_logo.data, 
                    o_image_data_logo.width, 
                    o_gg1.o_ctx.UNSIGNED_BYTE, //source type
                    o_gg1.o_ctx.RGBA,//source format
                    o_gg1.o_ctx.RGBA,//internalFormat
                ), 
                small: new O_gpu_texture_collection_item(
                    o_image_data_small.data, 
                    o_image_data_small.width,
                    o_gg1.o_ctx.UNSIGNED_BYTE, //source type
                    o_gg1.o_ctx.RGBA,//source format
                    o_gg1.o_ctx.RGBA,//internalFormat
                )
            }
            
            document.body.appendChild(o_gg1.o_canvas);
            f_update_data_in_o_gpu_gateway(o_data, o_gg1)
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            console.log(o_gg1.o_ctx.getError());
            f_render_o_gpu_gateway(o_gg1)

        }
    ), 
    f_o_test(
        "biggest_possible_texture", 
        async ()=>{
            // now since there are only 32 textures that can be passed on my gpu , 
            // we have to have multiple 1d, 2d, 3d, 4d, nd, arrays per texture 
            let o_mod_handyhelpers = await import('https://deno.land/x/handyhelpers@3.4/mod.js');


            let o_gg1 = f_o_gpu_gateway__from_simple_fragment_shader(
                `#version 300 es
                precision highp sampler2D;
                precision mediump float;
                // incoming variables
                in vec2 o_trn_nor_pixel;
                // outgoing variables
                out vec4 fragColor;
                // data passed from javascript 
                // autogenerated -------------------------------------

                uniform sampler2D biggest_possible_texture;

                void main() {
                    vec2 o_trn_flipped = vec2(
                        o_trn_nor_pixel.x, 
                        1.-o_trn_nor_pixel.y
                    );
                    vec4 o_color = texture(biggest_possible_texture, o_trn_flipped);

                    fragColor = vec4(
                        o_color
                    );

                }
                `,
                500, 
                500
            );

            document.body.appendChild(o_gg1.o_canvas);

            let gl = o_gg1?.o_ctx;


            const ext = gl.getExtension('OES_texture_float_linear');
            console.log(
                `gl.getSupportedExtensions(): ${gl.getSupportedExtensions()}`
            )
            console.log(
                `gl.getExtension('OES_texture_float_linear') ${gl.getExtension('OES_texture_float_linear')}`
            )
            if (!ext) {
              // Floating-point textures not supported; handle gracefully
              console.error('Floating-point textures are not supported on this device. (gl.getExtension("OES_texture_float")) ');
              // You can provide a fallback, use another texture format, or display an error message to the user.
            } else {
              // Floating-point textures are supported; you can proceed with your code.
            }
            // Query the maximum texture size
            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

            console.log('Maximum texture size:', maxTextureSize);

            // Attempt to create a texture of maximum size
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            const width = 10000;//11000//maxTextureSize;//16384;;
            const height = 10000;//11000//maxTextureSize;//16384;;

            // Generate random data for the texture
            let n_bytes_per_channel = 4;
            let n_pixels = width * height;
            let n_channels_per_pixel = 4;
            const n_bytes = n_pixels * n_bytes_per_channel * n_channels_per_pixel; // Assuming RGBA format
            const maxArraySize = Math.floor(Number.MAX_SAFE_INTEGER / 4); // Divide by 4 for 4-byte integers (32 bits per element)
            // JavaScript arrays are zero-based and use 32-bit indexes: the index of the first element is 0, and the highest possible index is 4294967294 (232−2), for a maximum array size of 4,294,967,295 elements.
            console.log('Maximum js array size:', maxArraySize);
            console.log(
                {
                    s: 'biggest_possible_texture', 
                    width, 
                    height,
                    n_pixels,
                    n_channels_per_pixel,
                    n_bytes_per_channel,
                    n_bytes,
                }
            )
            let b_float_texture = true;
            let n_internal_format;
            let n_format;
            let n_type;
            let randomData;

            if(b_float_texture){

                let n_bytes_per_element = 4;
                let n_len_array = n_bytes/n_bytes_per_element;
                randomData = new Float32Array(n_len_array);
                for (let i = 0; i < n_len_array; i++) {
                    randomData[i] = (Math.random()); 
                }
                n_internal_format = gl.RGBA32F
                n_format = gl.RGBA
                n_type = gl.FLOAT
            }else{
                let n_bytes_per_element = 1;
                let n_len_array = n_bytes/n_bytes_per_element;
                randomData = new Uint8Array(n_len_array);
    
                for (let i = 0; i < n_len_array; i++) {
                    randomData[i] = Math.ceil(Math.random()*256); 
                }
                n_internal_format = gl.RGBA
                n_format = gl.RGBA
                n_type = gl.UNSIGNED_BYTE
            }

            console.log({randomData})
            gl.activeTexture(gl.TEXTURE0 + 0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            var o_uniform_location = gl.getUniformLocation(o_gg1.o_shader__program, 'biggest_possible_texture');
            gl.uniform1i(o_uniform_location, 0); // Tell the shader we bound the texture to TEXTURE0

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            // Set the texture data
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                n_internal_format,//internalformat
                width,
                height,
                0,
                n_format,//format
                n_type,//gl.FLOAT, //type
                randomData
            );

            // Check for errors
            const error = gl.getError();
            if (error !== gl.NO_ERROR) {
                console.error('Error creating texture:', error);
            } else {
                console.log('Texture created successfully.');
            }

            let n_ms = 0;
            
            console.log('update data the old way')

            // example of how we can update a region of the texture 
            // Bind the texture you want to update
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Define the sub-region you want to update
            var xoffset = 0;
            var yoffset = height/2;
            var width2 = width;
            var height2 = 1000;
            let n_idx_start= yoffset*width
            let n_length = width2 * height2 * 4;
            let pixels;

            if(b_float_texture){

                randomData.set(new Float32Array(n_length))

                pixels = new Float32Array(width2 * height2 * 4); // or your pixel source
            }else{
                pixels = new Uint8Array(width2 * height2 * 4); // or your pixel source
                randomData.set(new Uint8Array(n_length))
            }
            let n_data_sub_array_not_copied_to_update = randomData.subarray(
                n_idx_start,
                n_idx_start+n_length
            );
            // console.log(n_data_sub_array_not_copied_to_update)
            var format = n_format;
            var type = n_type;


            // Update the texture
            gl.texSubImage2D(gl.TEXTURE_2D, 0, xoffset, yoffset, width2, height2, format, type, pixels);

            // Unbind the texture
            // gl.bindTexture(gl.TEXTURE_2D, null);

            // f_update_data_in_o_gpu_gateway({}, o_gg1)
            f_render_o_gpu_gateway(o_gg1)

        }
    ), 
    // f_o_test(
    //     "pass_more_arrays", 
    //     async ()=>{
    //         // now since there are only 32 textures that can be passed on my gpu , 
    //         // we have to have multiple 1d, 2d, 3d, 4d, nd, arrays per texture 
    //         let o_data = {
    //             a_n_f32__my_custom_array: new O_gpu_array_data(
    //                 100000,

    //             )
    //             new Float32Array(
    //                 new Array(100000).fill(0).map(
    //                     (n)=>{
    //                         return (Math.random()-.5)*123456
    //                     }
    //                 )
    //             )
    //         }
            
    //         let o_gg1 = f_o_gpu_gateway__from_simple_fragment_shader(
    //             `#version 300 es
    //             precision mediump float;
    //             // incoming variables
    //             in vec2 o_trn_nor_pixel;
    //             // outgoing variables
    //             out vec4 fragColor;
    //             // data passed from javascript 

    //             uniform sampler2D image_from_video;
    //             uniform float n_idx_newest_texture;
    //             void main() {
    //                 vec2 o_trn_flipped = vec2(
    //                     o_trn_nor_pixel.x, 
    //                     1.-o_trn_nor_pixel.y
    //                 );
    //                 vec4 a_o_pixel[] = vec4[](
    //                     ${new Array(n_len_a_o_image_data).fill(0).map((v,n_idx)=>{
    //                         return `texture(${f_s_name_texture_from_n_idx(n_idx)}, o_trn_flipped)`
    //                     }).join('\n,')}
    //                 );
    //                 float n_idx = o_trn_nor_pixel.x*${n_len_a_o_image_data}.;
    //                 n_idx = mod(n_idx+n_idx_newest_texture, ${n_len_a_o_image_data}.);
    //                 // if(n_idx == n_idx_newest_texture){
    //                     fragColor = vec4(
    //                         a_o_pixel[int(n_idx)].rgb,
    //                         // a_o_pixel[0].rgb,
    //                         1.0
    //                     );
    //                 // }
    //                 // fragColor = vec4(n_idx_newest_texture/32.);
    //             }
    //             `,
    //             500, 
    //             500
    //         );
    //         document.body.appendChild(o_gg1.o_canvas);
    //         window.setInterval(
    //             ()=>{
    //                 if(o_video.HAVE_CURRENT_DATA){
    //                     let o_can = document.createElement('canvas');
    //                     o_can.width = o_video.videoWidth
    //                     o_can.height = o_video.videoHeight
    //                     let o_ctx2 = o_can.getContext('2d')
    //                     o_ctx2.drawImage(o_video, 0, 0, o_can.width, o_can.height);
    //                     const o_img_data = o_ctx2.getImageData(0, 0, o_can.width, o_can.height);
    //                     a_o_image_data[n_idx_a_o_image_data] = o_img_data
    //                     f_update_data_in_o_gpu_gateway(
    //                         {
    //                             n_idx_newest_texture: n_idx_a_o_image_data,
    //                             [`image_${n_idx_a_o_image_data}`]: 
    //                                 f_o_gpu_texture__from_o_web_api_object(o_img_data)
    //                         },
    //                         o_gg1,
    //                     )
    //                     f_render_o_gpu_gateway(o_gg1)
    //                     n_idx_a_o_image_data = (n_idx_a_o_image_data+1)%n_len_a_o_image_data

    //                 }
    //             },
    //             16
    //         )

    //     }
    // ), 
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