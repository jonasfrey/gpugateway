import {
    f_v_s_type__from_value,
    f_v_s_type_from_array
} from "https://deno.land/x/handyhelpers@3.3/mod.js"


import { O_gpu_gateway, O_gpu_texture, O_gpu_texture_collection, O_gpu_texture_collection_item, O_shader_error, O_shader_info, O_texture } from "./classes.module.js";

import {
    o_webgl_info,
    s_context_webgl_version
} from './runtimedata.module.js'
// No need to delete o_can and o_ctx; they will be garbage collected if not referenced. 

let o_state = {
    a_o_gpu_data : []
};
let f_a_o_shader_error = function(
    s_code_shader,
    o_shader,
    o_ctx, 
    o_shader_info
){
    let a_o = [];
    if (!o_ctx.getShaderParameter(o_shader, o_ctx.COMPILE_STATUS)) {
        let s_shader_info_log = o_ctx.getShaderInfoLog(o_shader);
        let a_s_ignore = [
            '', 
            null, 
            undefined, 
            false, 
            '\u0000'
        ]
        if(a_s_ignore.includes(s_shader_info_log)){return []}
        a_o = s_shader_info_log
            ?.split('\n')
            ?.filter(s=>!a_s_ignore.includes(s))
            ?.map(s=>{
                let a_s_part = s.split(':').map(s=>s.trim());
                let s_error_prefix = a_s_part[0];
                let n_idx = parseInt(a_s_part[1]);
                let n_line = parseInt(a_s_part[2]);
                let s_code_content_with_error__quoted = a_s_part[3];
                // console.log(a_s_part)
                let s_code_content_with_error = s_code_content_with_error__quoted.substring(1, s_code_content_with_error__quoted.length-1)
                let s_error_type = a_s_part[4];
                let s_line_code_with_error = s_code_shader.split('\n')[n_line-1];
                // console.log(s)
                let n_idx_s_code = s_line_code_with_error.indexOf(s_code_content_with_error);
                let n_idx_s_code_second = s_line_code_with_error.indexOf(s_code_content_with_error, n_idx_s_code+1);
                let s_line_pointing_out_error = s
                if(n_idx_s_code_second != -1 || n_idx_s_code == -1){
                    let n_idx_first_non_whitespace = s_line_code_with_error.search(/\S/);
                    let n_remaining = s_line_code_with_error.length - n_idx_first_non_whitespace;
                    // we cannot be sure to find the exact match of the error 
                    // for example the 'd' is found firstly in voi'd', but the error is actually in void main() {'d'...
                    // void main() {d
                    //     ^undeclared identifier
                    s_line_pointing_out_error = `${' '.repeat(n_idx_first_non_whitespace)}${'-'.repeat(n_remaining)} ${s_error_type}`
                }else{
                    s_line_pointing_out_error = `${' '.repeat(n_idx_s_code)}${'^'.repeat(s_code_content_with_error.length)} ${s_error_type}`
                }
                let n_pad = (n_line.toString().length+1);
                let s_rustlike_error = [
                    `${s_error_prefix} ${s_code_content_with_error__quoted}`,
                    `${' '.repeat(n_pad)}|`,
                    `${n_line.toString().padEnd(n_pad, ' ')}|${s_line_code_with_error}`,
                    `${' '.repeat(n_pad)}|${s_line_pointing_out_error}`,
                ].join('\n')
                return new O_shader_error(
                    o_shader_info, 
                    s_error_prefix,
                    n_idx,
                    n_line,
                    s_code_content_with_error__quoted,
                    s_error_type,
                    s_line_code_with_error,
                    s_rustlike_error
                )
            });
    }

    return a_o;
}

let f_o_shader_info = function(
    s_type, 
    s_code_shader, 
    o_ctx
){
    let o_shader_info = new O_shader_info(
        s_type,
        s_code_shader,
        null,
        []
    )
    let a_s_type__allowed = ['vertex', 'fragment'];
    if(!a_s_type__allowed.includes(s_type)){
        throw Error(`s_type: ${s_type} is not allowed, allowed are ${JSON.stringify(a_s_type__allowed)}`);
    }
    o_shader_info.o_shader = o_ctx.createShader(o_ctx[`${s_type.toUpperCase()}_SHADER`])
    o_ctx.shaderSource(o_shader_info.o_shader, s_code_shader);
    o_shader_info.n_ts_ms_start_compile  = new Date().getTime()
    let n_ms = window.performance.now()
    o_ctx.compileShader(o_shader_info.o_shader);
    o_shader_info.n_ms_duration_compile = window.performance.now()-n_ms;
    o_shader_info.a_o_shader_error = f_a_o_shader_error(
        s_code_shader,
        o_shader_info.o_shader,
        o_ctx, 
        o_shader_info
    );
    if(o_shader_info.a_o_shader_error.length > 0){
        o_ctx.deleteShader(o_shader_info.o_shader);
    }
    return o_shader_info;
}

let f_o_gpu_gateway = function(
    o_canvas, 
    s_code_shader__vertex = '',
    s_code_shader__fragment = '', 
) {
    let o_ctx = o_canvas.getContext(
        s_context_webgl_version,
        {preserveDrawingBuffer: true} // o_canvas.getContext(...).readPixels(...) will return 0 without this
    );
    if (!o_ctx) {
        throw Error(`${s_context_webgl_version} is not supported or disabled in this browser.`);
    }

    // console.error('ERROR compiling fragment shader!', s_shader_info_log);
    let o_map = {
        'fragment': s_code_shader__fragment, 
        'vertex': s_code_shader__vertex
    }

    let a_o_shader_info = Object.keys(o_map).map(
        s=>{
            return f_o_shader_info(
                s, 
                o_map[s], 
                o_ctx
            )
        }
    ).flat();

    for(let o_shader_info of a_o_shader_info){
        if(o_shader_info.a_o_shader_error.length > 0){
            console.error(`shader with type '${o_shader_info.s_type}' could not compile, error(s):`)
            throw Error('\n'+o_shader_info.a_o_shader_error.map(o=>o.s_rustlike_error).join('\n\n')+'\n\n')
        }
    }

    // Create and use the program
    var o_shader__program = o_ctx.createProgram();
    for(let o_shader_info of a_o_shader_info){
        o_ctx.attachShader(o_shader__program, o_shader_info.o_shader);
    }
    o_ctx.linkProgram(o_shader__program);
    if (!o_ctx.getProgramParameter(o_shader__program, o_ctx.LINK_STATUS)) {
        console.error('ERROR linking o_shader__program!', o_ctx.getProgramInfoLog(o_shader__program));
        o_ctx.deleteProgram(o_shader__program);
        return;
    }
    o_ctx.useProgram(o_shader__program);
    



    // Additional setup for drawing (e.g., buffers, attributes)
    return new O_gpu_gateway(
        o_canvas, 
        o_ctx, 
        a_o_shader_info,
        o_shader__program
    )
}

let f_render_o_gpu_gateway = function(o_gpu_gateway){
        o_gpu_gateway.o_ctx = o_gpu_gateway.o_canvas.getContext(s_context_webgl_version)
        var o_buffer_position = o_gpu_gateway.o_ctx.createBuffer();
        o_gpu_gateway.o_ctx.bindBuffer(o_gpu_gateway.o_ctx.ARRAY_BUFFER, o_buffer_position);

        // Set the positions for a square.
        var a_o_vec_position_vertex = [
            //x    y     z    w 
            // v1
            -1.0, -1.0,  0., 1.0,
            // v2
            1.0, -1.0,  0., 1.0,
            // v3
            -1.0,  1.0,  0., 1.0,
            // v4
            1.0,  1.0,  0., 1.0,
        ];
        o_gpu_gateway.o_ctx.bufferData(o_gpu_gateway.o_ctx.ARRAY_BUFFER, new Float32Array(a_o_vec_position_vertex), o_gpu_gateway.o_ctx.STATIC_DRAW);

        // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
        var o_attribute_location__position = o_gpu_gateway.o_ctx.getAttribLocation(o_gpu_gateway.o_shader__program, "a_o_vec_position_vertex");
        o_gpu_gateway.o_ctx.enableVertexAttribArray(o_attribute_location__position);
        o_gpu_gateway.o_ctx.vertexAttribPointer(o_attribute_location__position, 4, o_gpu_gateway.o_ctx.FLOAT, false, 0, 0);

        // Draw the square
        o_gpu_gateway.o_ctx.drawArrays(o_gpu_gateway.o_ctx.TRIANGLE_STRIP, 0, 4);

}
let f_rescale_texture = function(o_gpu_gateway,o_gpu_texture_collection){
    o_gpu_gateway.a_o_gpu_texture_collection.at(-1)
}
let f_add_texture = function(a_o_gpu_texture_collection){

}
let f_remove_texture = function(a_o_gpu_texture_collection){

}

let a_o_texture = [];
let a_n_o_texture_n_idx__free = [0];
let f_recalculate_required_textures = function(
    o_gpu_gateway
){
    
    for(let o_gpu_texture_collection of o_gpu_gateway.a_o_gpu_texture_collection){
        // we assume that there really is only o_gpu_texture_collection per type combination, if not we have a problem
        o_gpu_texture_collection.a_o_gpu_texture_collection_item.sort(
            (o1, o2)=>{
                return o1.n_trn_y_on_vritual_infinit_texture - o2.n_trn_y_on_vritual_infinit_texture
            }
        )
        let o_gpu_texture_collection_item_last = o_gpu_texture_collection.at(-1);
        if(o_gpu_texture_collection_item_last){

            let n_textures_required = parseInt(o_gpu_texture_collection_item_last.n_trn_y_on_vritual_infinit_texture / o_webgl_info.o_MAX_TEXTURE_SIZE.v);
            
            let n_scl_y_last_texture = n_trn_y % o_webgl_info.o_MAX_TEXTURE_SIZE.v;
        
            let n_textures_to_add_or_remove = o_gpu_gateway.a_o_gpu_texture_collection.length - n_textures_required;
        
            if(n_textures_to_add_or_remove > 0){
                //add
                let n_scl_y = o_webgl_info.o_MAX_TEXTURE_SIZE.v
                for(let n = 0; n < n_textures_to_add_or_remove;n+=1){
                    if(n == n_textures_to_add_or_remove-1){
                        n_scl_y = n_scl_y_last_texture
                    }
                    let o_webgl_texture = o_ctx.createTexture();
                    let n_idx = a_n_o_texture_n_idx__free.shift();
                    if(a_n_o_texture_n_idx__free.length == 0){
                        a_n_o_texture_n_idx__free = [n_idx+1]
                    }
                    let o_texture = new O_texture(
                        o_webgl_texture, 
                        n_idx,
                        o_gpu_texture_collection
                    )
                    o_gpu_texture_collection.a_o_texture.push(o_texture);
    
                    o_ctx.activeTexture(o_ctx.TEXTURE0 + o_texture.n_idx);
                    o_ctx.bindTexture(o_ctx.TEXTURE_2D, o_texture.o_webgl_texture);
                    
                    var o_uniform_location = o_ctx.getUniformLocation(
                        o_gpu_gateway.o_shader__program,
                        [
                            'o_texture',
                            o_texture.n_idx,
                            o_gpu_texture_collection_item.n_datatype__webgl_srcType,
                            o_gpu_texture_collection_item.o_webgl_format__source_insidecpu.s_name,
                            o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu.s_name,
                        ].join('_')
                    );
                    
                    o_ctx.uniform1i(o_uniform_location, o_texture.n_idx); // Tell the shader we bound the texture to TEXTURE0
                    //textures scale sizes must be power of two
                    // otherwise use this 
                    o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_S, o_ctx.CLAMP_TO_EDGE);
                    o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_T, o_ctx.CLAMP_TO_EDGE);
                    o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_MIN_FILTER, o_ctx.LINEAR);
                    o_ctx.texImage2D(
                        // target, level, internalformat, width, height, border, format, type, offset
                        o_ctx.TEXTURE_2D,//target,
                        o_gpu_texture_collection.n_webgl_level, //level
                        o_gpu_texture_collection.o_webgl_format__internal_insidegpu.n_webgl_value,//internalformat 
                        o_gpu_texture_collection.n_scl_x_max,//width,
                        n_scl_y_last_texture,//height,
                        o_gpu_texture_collection.n_webgl_border,//border,,
                        o_gpu_texture_collection.o_webgl_format__source_insidecpu.n_webgl_value,//format,
                        o_gpu_texture_collection.n_datatype__webgl_srcType,//type,
                        new o_gpu_texture_collection_item.a_n__typed.constructor(
                            o_gpu_texture_collection.n_scl_x_max
                            * o_gpu_texture_collection.n_scl_y_max
                            * o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu.n_channels
                        )
                        //srcData
                        //srcOffset
                    );
                }
            }else{
                //remove
                let a_o_texture_to_delete = o_gpu_texture_collection.a_o_texture.slice(n_textures_to_add_or_remove);
                for(let o of a_o_texture_to_delete){
                    a_n_o_texture_n_idx__free.push(o.n_idx);
                    o_gpu_gateway.o_ctx.deleteTexture(o.o_webgl_texture);
                }
            }
            if(o_gpu_gateway.a_o_gpu_texture_collection.at(-1).n_scl_y != n_scl_y_last_texture){

                f_rescale_texture(o_gpu_gateway, o_gpu_gateway.a_o_gpu_texture_collection.at(-1));
            }
            
        } 
    }


}
let f_update_a_o_gpu_texture_collection_item = function(
    o_gpu_gateway,
    a_o_gpu_texture_collection_item,
    ){
    let b_recalculate_required_textures = false;
    // a_o_gpu_texture_collection_item.sort(...)
    for(let o_gpu_texture_collection_item of a_o_gpu_texture_collection_item){
        let n_idx = o_gpu_gateway.a_o_gpu_texture_collection_item.indexOf(o_gpu_texture_collection_item);

        if(
            o_gpu_texture_collection_item.n_len_a_n__typed__last != o_gpu_texture_collection_item.a_n__typed.length
        ){
            if(o_gpu_texture_collection_item.n_trn_y_on_vritual_infinit_texture > 0){
                o_gpu_texture_collection_item.n_trn_y_on_vritual_infinit_texture-= 
                    o_gpu_texture_collection_item.n_scl_x_on_texture
                    * o_gpu_texture_collection_item.n_scl_y_on_texture
            }
            console.warn(`texture size changes are not recommended!`)
            o_gpu_texture_collection_item.n_scl_x_on_texture = o_webgl_info.o_MAX_TEXTURE_SIZE.v;
            o_gpu_texture_collection_item.n_scl_y_on_texture = Math.ceil(
                o_gpu_texture_collection_item.a_n__typed.length
                    / o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu.n_channels
                    / o_gpu_texture_collection_item.n_scl_x_on_texture
            );
            o_gpu_texture_collection_item.a_n__typed__padded = new o_gpu_texture_collection_item.a_n__typed.constructor(
                o_gpu_texture_collection_item.n_scl_x_on_texture
                * o_gpu_texture_collection_item.n_scl_y_on_texture
                * o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu.n_channels
            );
            if(o_gpu_texture_collection_item.n_trn_y_on_vritual_infinit_texture > 0){
                o_gpu_texture_collection_item.n_trn_y_on_vritual_infinit_texture+= 
                    o_gpu_texture_collection_item.n_scl_y_on_texture
            }
            o_gpu_texture_collection_item.a_n__typed__padded.set(
                o_gpu_texture_collection_item.a_n__typed
            )
            let n_trn_y = o_gpu_texture_collection_item.n_trn_y_on_vritual_infinit_texture
            // since the data size has changed we have to re-calculate all the trn_y and also 
            // it may be the case the we have to delete/remove or create/add some new textures   
            for(let n_idx2 = n_idx; n_idx2 < o_gpu_gateway.a_o_gpu_texture_collection_item.length;n_idx2+=1){
                let o_gpu_texture_collection_item__other = o_gpu_gateway.a_o_gpu_texture_collection_item[n_idx2];
                if(
                    o_gpu_texture_collection_item__other.n_datatype__webgl_srcType != o_gpu_texture_collection_item.n_datatype__webgl_srcType
                    ||
                    o_gpu_texture_collection_item__other.o_webgl_format__source_insidecpu != o_gpu_texture_collection_item.o_webgl_format__source_insidecpu
                    ||
                    o_gpu_texture_collection_item__other.o_webgl_format__internal_insidegpu != o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu
                ){
                    //we are only interested in items of the same type
                    continue;
                }
                n_trn_y = n_trn_y + o_gpu_texture_collection_item__other.n_scl_y_on_texture;
                o_gpu_texture_collection_item__other.n_trn_y_on_vritual_infinit_texture = n_trn_y;

            }
            b_recalculate_required_textures = true;
        }
        // if the size has not changed we can simply update the texture portion

        // update the data 
        o_gpu_texture_collection_item
            .a_n__typed__padded
            .set(o_gpu_texture_collection_item.a_n__typed);
        
        // debugger
        o_ctx.bindTexture(
            o_ctx.TEXTURE_2D,
            o_gpu_texture_collection_item.o_texture
        );
        o_ctx.texSubImage2D(
            o_ctx.TEXTURE_2D,
            o_gpu_texture_collection.n_webgl_level,
            o_gpu_texture_collection.n_trn_x_on_texture,
            o_gpu_texture_collection.n_trn_y_on_texture,
            o_gpu_texture_collection_item.n_scl_x_on_texture,
            o_gpu_texture_collection_item.n_scl_y_on_texture,
            o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu.n_webgl_value,
            o_gpu_texture_collection_item.n_datatype__webgl_srcType,
            o_gpu_texture_collection_item
                .a_n__typed__padded
        );
    }
    if(b_recalculate_required_textures){
        f_recalculate_required_textures(o_gpu_gateway)
    }
}
let f_update_data_in_o_gpu_gateway = function(
    o_data, 
    o_gpu_gateway
){
    // const maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    // const maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
    // const maxVertexArrays = Math.floor(maxVertexUniformVectors / 25);
    // const maxFragmentArrays = Math.floor(maxFragmentUniformVectors / 25);
    // console.log('Max Vertex Arrays:', maxVertexArrays);
    // console.log('Max Fragment Arrays:', maxFragmentArrays);
    o_gpu_gateway.o_canvas.getContext(s_context_webgl_version);// WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost , can occur when the programmer uses different canvases or video or image elemnets
    let o_ctx = o_gpu_gateway.o_ctx;

    let n_scl_x_max_gpu_texture = o_webgl_info.o_MAX_TEXTURE_SIZE.v;
    let n_scl_y_max_gpu_texture = o_webgl_info.o_MAX_TEXTURE_SIZE.v;
    let a_o_gpu_texture_collection_item__for_update = []
    for(let s_prop in o_data){
        let v = o_data[s_prop];
        if(v instanceof O_gpu_texture_collection_item){
            // debugger
            //make sure a collection item for this collection item exists
            let o_gpu_texture_collection_item =  o_gpu_gateway.a_o_gpu_texture_collection_item.find(
                o=>o.s_prop == v.s_prop
            );
            if(!o_gpu_texture_collection_item){
                o_gpu_texture_collection_item = v;
                o_gpu_texture_collection_item.s_prop = s_prop;
                o_gpu_gateway.a_o_gpu_texture_collection_item.push(
                    o_gpu_texture_collection_item
                );
            }
            
            let o_gpu_texture_collection = o_gpu_gateway.a_o_gpu_texture_collection.find(
                o=>{
                    return o.n_datatype__webgl_srcType == o_gpu_texture_collection_item.n_datatype__webgl_srcType
                        && o.o_webgl_format__source_insidecpu.n_webgl_value == o_gpu_texture_collection_item.o_webgl_format__source_insidecpu.n_webgl_value
                        && o.o_webgl_format__internal_insidegpu.n_webgl_value == o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu.n_webgl_value
                        && o.n_scl_y - o.n_trn_y_after_last_item >= o_gpu_texture_collection_item.n_scl_y_on_texture
                }
            );

            // make sure a collection for this item exists
            if(!o_gpu_texture_collection){
                o_gpu_texture_collection = new O_gpu_texture_collection(
                    null, 
                    o_webgl_info.o_MAX_TEXTURE_SIZE.v, 
                    o_webgl_info.o_MAX_TEXTURE_SIZE.v, 
                    n_scl_x_max_gpu_texture, 
                    n_scl_y_max_gpu_texture, 
                    o_gpu_texture_collection_item.n_datatype__webgl_srcType,
                    o_gpu_texture_collection_item.o_webgl_format__source_insidecpu,
                    o_gpu_texture_collection_item.o_webgl_format__internal_insidegpu,
                );
            }
            o_gpu_texture_collection_item.o_gpu_texture_collection = o_gpu_texture_collection
            if(o_gpu_texture_collection.a_o_gpu_texture_collection_item.indexOf(o_gpu_texture_collection_item)==-1){
                o_gpu_texture_collection.a_o_gpu_texture_collection_item.push(o_gpu_texture_collection_item)
            }
            a_o_gpu_texture_collection_item__for_update.push(o_gpu_texture_collection_item)
            continue;
        }
        if(v instanceof O_gpu_texture){
            v.s_name_in_shader = s_prop
            let n_idx_o_gpu_texture = -1;
            let o_gpu_texture = o_gpu_gateway.a_o_gpu_texture.find((o, n_idx)=>{
                let b = o.s_name_in_shader == v.s_name_in_shader
                if(b){
                    n_idx_o_gpu_texture = n_idx
                }
                return b
            });

            // the order of the called ctx functions is important!!!!
            if(!o_gpu_texture){
                const maxTextureImageUnits = o_ctx.getParameter(o_ctx.MAX_TEXTURE_IMAGE_UNITS);
                console.log('Maximum texture image units:', maxTextureImageUnits);
                if(o_gpu_gateway.a_o_gpu_texture.length > o_ctx.MAX_TEXTURE_IMAGE_UNITS){
                    throw Error(`your gpu cannot hold more textures the limit of o_ctx.MAX_TEXTURE_IMAGE_UNITS: ${o_ctx.MAX_TEXTURE_IMAGE_UNITS} is reached`)
                }
                o_gpu_gateway.a_o_gpu_texture.push(v);
                n_idx_o_gpu_texture = o_gpu_gateway.a_o_gpu_texture.length-1;
            }
            o_gpu_gateway.a_o_gpu_texture[n_idx_o_gpu_texture] = v;
            o_gpu_texture = v

            o_gpu_texture.o_texture = o_ctx.createTexture();

            console.log({n_idx_o_gpu_texture, s_prop, o_gpu_texture})

            o_ctx.activeTexture(o_ctx.TEXTURE0 + n_idx_o_gpu_texture);
            o_ctx.bindTexture(o_ctx.TEXTURE_2D, o_gpu_texture.o_texture);
            var o_uniform_location = o_ctx.getUniformLocation(o_gpu_gateway.o_shader__program, s_prop);
            o_ctx.uniform1i(o_uniform_location, n_idx_o_gpu_texture); // Tell the shader we bound the texture to TEXTURE0
            //textures scale sizes must be power of two
            // otherwise use this 
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_S, o_ctx.CLAMP_TO_EDGE);
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_T, o_ctx.CLAMP_TO_EDGE);
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_MIN_FILTER, o_ctx.LINEAR);

            if(
                o_gpu_texture.v_o_instance_of_supported_pixels_data
            ){
                o_ctx.texImage2D(
                    o_ctx.TEXTURE_2D, //target,
                    0,//level,
                    o_ctx.RGBA, //internalformat,
                    o_ctx.RGBA,//format
                    o_ctx.UNSIGNED_BYTE,//type
                    o_gpu_texture.v_o_instance_of_supported_pixels_data //pixels
                );
            }else{
                o_ctx.texImage2D(
                    // target, level, internalformat, width, height, border, format, type, offset
                    o_ctx.TEXTURE_2D,//target,
                    o_gpu_texture.n_webgl_level, //level
                    o_gpu_texture.n_channel_layout_ingpu__webgl_internalFormat,//internalformat 
                    o_gpu_texture.n_scl_x,//width,
                    o_gpu_texture.n_scl_y,//height,
                    o_gpu_texture.n_webgl_border,//border,,
                    o_gpu_texture.n_channel_layout_input__webgl_srcFormat,//format,
                    o_gpu_texture.n_datatype__webgl_srcType,//type,
                    o_gpu_texture.a_n__typed//srcData
                    //srcOffset
                );
            }
            
            // set texture parameters 
            // o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_S, o_ctx.CLAMP_TO_EDGE);
            // o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_T, o_ctx.CLAMP_TO_EDGE);
            // o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_MIN_FILTER, o_ctx.LINEAR);
            continue
        }

        // if(v instanceof O_gpu_array_data){
            
        //     let o_gpu_data
        //     debugger
        //     continue
        // }

        let v_s_type = f_v_s_type__from_value(v);
        if(typeof v == 'number'){
            let s_name_function = `uniform1${(s_prop.startsWith('n_i_')?'i':'f')}`

            o_ctx[s_name_function](o_ctx.getUniformLocation(o_gpu_gateway.o_shader__program, s_prop), v);
            console.log(s_name_function)
            continue
        }
        let v_s_type_array = f_v_s_type_from_array(v);
        let a_s_type_array_vector_allowed = ['a_n_f64'];
        if(v_s_type_array){
            if(!a_s_type_array_vector_allowed.includes(v_s_type_array)){
                throw Error(`cannot pass the array as a vector, array type of ${v_s_type_array} is not allowed, allowed types are ${a_s_type_array_vector_allowed}`)
            }
            if(Array.isArray(v)){
                if(v.length <= 4){
                    let s_name_function = `uniform${v.length}${(v_s_type_array?.includes('f')?'f':'i')}v`
                    o_ctx[s_name_function](o_ctx.getUniformLocation(o_gpu_gateway.o_shader__program, s_prop), v);
                    continue
                }
                throw Error(`cannot pass a non typed array with more values than 4 (4dvector) to the shader`)

            }
            //here a typed array is expected!

            if(!v_s_type_array){
                throw Error(`cannot pass variable of type ${v_s_type} and value ${v} to shader`)
            }

            // Assume 'o_ctx' is your WebGL context
            const a_n__typed = v//new Float32Array([/* your data here */]);
            const n_components = 1; // example for vec3
            let o_map = {
                'a_n_i8': o_ctx.BYTE, //  //: 'Int8Array',
                'a_n_u8': o_ctx.UNSIGNED_BYTE, //  //: 'Uint8Array',
                'a_n_i16': o_ctx.SHORT, //  //: 'Int16Array',
                'a_n_u16': o_ctx.UNSIGNED_SHORT, //  //: 'Uint16Array',
                'a_n_i32': o_ctx.INT, //  //: 'Int32Array',
                'a_n_u32': o_ctx.UNSIGNED_INT, //  //: 'Uint32Array',
                'a_n_f32': o_ctx.FLOAT, //  //: 'Float32Array',
                // WebGL does not support the following types
                'a_n_f64': null, // Float64Array is not supported
                'a_n_i64': null, // BigInt64Array is not supported
                'a_n_u64': null, // BigUint64Array is not supported
            } 
            const n_type_array_value_gl = o_map[v_s_type_array];
            if(!n_type_array_value_gl){
                throw Error(`sorry , wegbl 2.0 does not support the type: ${v_s_type_array} of this typed array ${v}`)
            }
            // debugger
            
            // const b_normalize = false; // don't normalize the data
            // const n_stride = 0;        // 0 = move forward size * sizeof(n_type_array_value) each iteration to get the next position
            // const n_offset = 0;        // start at the beginning of the buffer
            // // Create a buffer
            // const v_buffer = o_ctx.createBuffer();
            // // Bind it to the ARRAY_BUFFER target
            // o_ctx.bindBuffer(o_ctx.ARRAY_BUFFER, v_buffer);
            // // Copy the data to the buffer
            // o_ctx.bufferData(o_ctx.ARRAY_BUFFER, a_n__typed, o_ctx.STATIC_DRAW);
            // const o_attribute_location = o_ctx.getAttribLocation(o_program, s_prop);
            // // Assume 'location' is the location of the attribute in your shader
            // o_ctx.enableVertexAttribArray(o_attribute_location);
            // // Describe the attribute data layout in the buffer
            // o_ctx.vertexAttribPointer(o_attribute_location, n_components, n_type_array_value_gl, b_normalize, n_stride, n_offset);

            // const maxVertexUniformVectors = o_ctx.getParameter(o_ctx.MAX_VERTEX_UNIFORM_VECTORS);
            // const maxFragmentUniformVectors = o_ctx.getParameter(o_ctx.MAX_FRAGMENT_UNIFORM_VECTORS);
            // debugger

            // // Create and bind the buffer for your array
            // const buffer = o_ctx.createBuffer();
            // o_ctx.bindBuffer(o_ctx.ARRAY_BUFFER, buffer);
            // o_ctx.bufferData(o_ctx.ARRAY_BUFFER, v, o_ctx.STATIC_DRAW);
            // // Get the location of the uniform in the fragment shader
            // const uniformLocation = o_ctx.getUniformLocation(o_program, s_prop);
            // // You may need to use a different method to pass the array depending on its size and type
            // o_ctx.uniform1fv(uniformLocation, v);


            // let n_dimensions_per_texture = 2
            // let n_bytes_max_texture_size_per_dimension = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            // let n_textures = gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
            // let n_bytes_ram_computed = Math.pow(n_bytes_max_texture_size_per_dimension, n_dimensions_per_texture)*n_textures 
            
            // Create a texture
            const texture = o_ctx.createTexture();
            o_ctx.bindTexture(o_ctx.TEXTURE_2D, texture);

            // Assume 'v' is your float data array
            const textureData = new Float32Array(v.length * 4); // for RGBA
            for (let i = 0; i < v.length; i++) {
                textureData[i * 4] = v[i]; // Store each float in the red channel, for example
            }
            // Load the texture data
            o_ctx.texImage2D(o_ctx.TEXTURE_2D, 0, o_ctx.RGBA32F, v.length, 1, 0, o_ctx.RGBA, o_ctx.FLOAT, textureData);

            // Set texture parameters
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_S, o_ctx.CLAMP_TO_EDGE);
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_WRAP_T, o_ctx.CLAMP_TO_EDGE);
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_MIN_FILTER, o_ctx.NEAREST);
            o_ctx.texParameteri(o_ctx.TEXTURE_2D, o_ctx.TEXTURE_MAG_FILTER, o_ctx.NEAREST);

        }

    }
    f_update_a_o_gpu_texture_collection_item(o_gpu_gateway, a_o_gpu_texture_collection_item__for_update)
}
let f_s_autogenerated_accessor_functions = function(o_data){
    let n_ts = new Date().getTime()
    for(let s_prop in o_data){
        let v = o_data[s_prop];
        if(v instanceof O_gpu_texture_collection_item){
            // debugger
            let o_gpu_texture_collection_item =  o_gpu_gateway.a_o_gpu_texture_collection_item.find(
                o=>o.s_prop == v.s_prop
            );
            let s_accessor_function = `
            //autogenerated_accessor_function_start__${s_prop}_${n_ts}
            vec4 f_o_${s_prop}(vec2 o_trn_nor){return vec4(0)};
            //autogenerated_accessor_function_end__${s_prop}_${n_ts}
            `
            if(o_gpu_texture_collection_item.s_accessor_function)
        }
    }
}
let f_o_gpu_gateway__from_simple_fragment_shader = function(
    s_code_shader__fragment, 
    n_scl_x = 500, 
    n_scl_y = 500
){
    let o_canvas2 = document.createElement('canvas');
    o_canvas2.width = n_scl_x
    o_canvas2.height = n_scl_y
    let o_gpu_gateway2 = f_o_gpu_gateway(
        o_canvas2, 
        `#version 300 es
        in vec4 a_o_vec_position_vertex;
        out vec2 o_trn_nor_pixel;
        void main() {
            gl_Position = a_o_vec_position_vertex;
            o_trn_nor_pixel = (a_o_vec_position_vertex.xy + 1.0) / 2.0; // Convert from clip space to texture coordinates
        }`,
        s_code_shader__fragment
    )
    f_render_o_gpu_gateway(
        o_gpu_gateway2
    );
    return o_gpu_gateway2;
}

let f_o_gpu_texture__from_o_web_api_object = function(o_web_api_object){

    let a_s_class_allowed = [
        'ImageData',
        'HTMLImageElement',
        'HTMLCanvasElement',
        'HTMLVideoElement',
        'ImageBitmap'
    ];
    if(!a_s_class_allowed.includes(o_web_api_object?.constructor?.name)){
        throw Error(`o_web_api_object must be an instance of one of the following web api classes ${a_s_class_allowed}`)
    }
    let o_gpu_texture = new O_gpu_texture()
    o_gpu_texture.v_o_instance_of_supported_pixels_data = o_web_api_object;
    return o_gpu_texture
}
export {
    f_o_gpu_gateway,
    f_render_o_gpu_gateway, 
    o_state,
    f_update_data_in_o_gpu_gateway,
    f_o_gpu_texture__from_o_web_api_object,
    f_s_autogenerated_accessor_functions,


    // 'presets', aka i am lazy as fuck functions
    f_o_gpu_gateway__from_simple_fragment_shader
}