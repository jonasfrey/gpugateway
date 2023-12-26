// manual  so called 'texture atlas' approach
// class O_gpu_array_data{ 
//     // i really dont want to call this texture or image because just because webgl screwed up with having a option to pass 1d arrays to the gpu
//     constructor(
//         n_scl_x, // we actually would only need the scl_x (width)
//         s_type,
//         a_n__typed
//     ){
//         this.n_scl_x = n_scl_x
//         this.s_type = s_type
//         this.a_n__typed = a_n__typed
//         this.s_prop_name = null 
//         this.o_gpu_texture = null
//     }
// }
class O_gpu_texture_collection{
    // there can be multiple textures per collection 
    // a texture can contain data of multiple collection_item
    constructor(
        a_n__typed,
        n_scl_x,
        n_scl_y,
        n_scl_x_max = 0,
        n_scl_y_max = 0,
        n_datatype__webgl_srcType = 0,
        o_webgl_format__source_insidecpu = null, 
        o_webgl_format__internal_insidegpu = null, 
        n_webgl_level = 0, 
        n_webgl_border = 0, 
    ){
        
        this.n_datatype__webgl_srcType = n_datatype__webgl_srcType,
        this.o_webgl_format__source_insidecpu = o_webgl_format__source_insidecpu,
        this.o_webgl_format__internal_insidegpu = o_webgl_format__internal_insidegpu, 
        this.n_webgl_level = n_webgl_level
        this.n_webgl_border = n_webgl_border
        this.n_scl_x = n_scl_x
        this.n_scl_y = n_scl_y
        this.n_scl_x_max = n_scl_x_max
        this.n_scl_y_max = n_scl_y_max
        this.a_n__typed = a_n__typed
        this.a_o_texture = []
        this.s_name_in_shader = null;
        this.n_idx = null;
        this.n_trn_y_after_last_item = 0
        this.a_o_gpu_texture_collection_item = []
    }
}

class O_gpu_texture_collection_item{
    constructor(
        a_n__typed,
        n_scl_x, 
        n_datatype__webgl_srcType,
        o_webgl_format__source_insidecpu = null, 
        o_webgl_format__internal_insidegpu = null, 
    ){
        this.a_n__typed = a_n__typed
        this.n_len_a_n__typed__last = a_n__typed.length;
        this.n_scl_x = n_scl_x
        this.n_scl_x_on_texture = 0;
        this.n_scl_y_on_texture = 0;
        this.n_trn_x_on_texture = 0;
        this.n_trn_y_on_texture = 0;
        this.n_trn_y_on_vritual_infinit_texture = 0;

        this.n_datatype__webgl_srcType = n_datatype__webgl_srcType,
        this.o_webgl_format__source_insidecpu = o_webgl_format__source_insidecpu,
        this.o_webgl_format__internal_insidegpu = o_webgl_format__internal_insidegpu, 
        this.o_gpu_texture = null;
        this.s_prop = null;
        this.o_gpu_texture_collection = null;
        // since there are no absolute basic modular neccessary functions to update the array data of a texture BY INDEX!!!!
        // there are multiple array operations necessary to  update the data of a nD array embedded and represented as a part of a 1d array
        // therefore i have decided to padd the data to the width of the texture which is the maxwidth
        this.a_n__typed__padded = null;
    }
}
class O_texture{
    constructor(
        o_webgl_texture, 
        n_idx, 
        o_gpu_texture_collection
    ){
        this.o_webgl_texture = o_webgl_texture, 
        this.n_idx = n_idx
        this.o_gpu_texture_collection = o_gpu_texture_collection
    }
}
class O_gpu_texture{
    constructor(
        a_n__typed,
        n_scl_x,
        n_scl_y,
        n_datatype__webgl_srcType = 0,
        n_channel_layout_input__webgl_srcFormat = 0, 
        n_channel_layout_ingpu__webgl_internalFormat = null, 
        n_webgl_level = 0, 
        n_webgl_border = 0, 

        // const level = 0;
        // const internalFormat = gl.RGBA;
        // const width = 1;
        // const height = 1;
        // const border = 0;
        // const srcFormat = gl.RGBA;
        // const srcType = gl.UNSIGNED_BYTE;
        // const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue

    ){
        this.a_n__typed = a_n__typed
        this.n_scl_x = n_scl_x, 
        this.n_scl_y = n_scl_y, 

        this.v_o_instance_of_supported_pixels_data = null; //ImageData , HTMLImageElement , HTMLCanvasElement , HTMLVideoElement , ImageBitmap
        this.o_texture = null, 
        this.n_datatype__webgl_srcType = n_datatype__webgl_srcType
        this.n_channel_layout_input__webgl_srcFormat = n_channel_layout_input__webgl_srcFormat
        this.n_channel_layout_ingpu__webgl_internalFormat = (n_channel_layout_ingpu__webgl_internalFormat) ? n_channel_layout_ingpu__webgl_internalFormat : n_channel_layout_input__webgl_srcFormat 
        this.n_webgl_level = n_webgl_level
        this.n_webgl_border = n_webgl_border
        this.s_name_in_shader = null;
        this.n_idx = null;
    }
}

class O_gpu_gateway{ 
    constructor(
        o_canvas, 
        o_ctx,
        a_o_shader_info,
        o_shader__program, 
    ){
        this.o_canvas = o_canvas
        this.o_ctx = o_ctx
        this.a_o_shader_info = a_o_shader_info
        this.o_shader__program = o_shader__program
        this.a_o_gpu_texture = []
        this.a_o_gpu_texture_collection = []
        this.a_o_gpu_texture_collection_item = []
    }
}
class O_gpu_gateway_webgpu_dataitem{
    constructor(
        o_gpu_gateway_webgpu,
        s_prop,
        a_n__typed,
        n_bytes_per_array_element,
        n_idx__group,
        n_idx__binding,
        o_webgpu_buffer = null,
        o_webgpu_texture = null
    ){
        this.o_gpu_gateway_webgpu = o_gpu_gateway_webgpu,
        this.s_prop = s_prop, 
        this.a_n__typed = a_n__typed
        this.n_bytes_per_array_element = n_bytes_per_array_element
        this.n_idx__group = n_idx__group
        this.n_idx__binding = n_idx__binding
        this.o_webgpu_buffer = o_webgpu_buffer
        this.o_webgpu_texture = o_webgpu_texture
        
        // theese are all possible types of data that can be passed to the gpu 
        // Uniform Buffers:
        //     Used to pass small amounts of data that remain constant for a draw call or the entire render/compute pass, such as transformation matrices, material properties, or lighting parameters.
        //     They have relatively small size limits compared to other types of GPU resources.

        // Storage Buffers:
        //     Used for larger, structured data that can be read and written by the GPU, such as particle systems, complex compute data, or large arrays.
        //     Offer more flexibility and larger size limits than uniform buffers.

        // Textures:
        //     Used to pass image data for sampling in shaders. Textures are optimized for 2D and 3D data access and support various types of filtering and addressing modes.
        //     Include sampled textures, storage textures, and depth/stencil textures.

        // Vertex Buffers:
        //     Used to pass per-vertex data, such as positions, normals, texture coordinates, and colors.
        //     Essential for 3D rendering and typically used in vertex shaders.

        // Index Buffers:
        //     Used in combination with vertex buffers to define the order in which vertices are rendered, allowing the reuse of vertex data for multiple primitives.
        //     Efficient for rendering complex geometries.

        // Indirect Buffers:
        //     Used for indirect draw or dispatch commands, where draw call parameters are stored in a buffer.
        //     Allow the GPU to determine the number of vertices or instances to render, or the number of compute shader invocations, based on data generated in previous GPU operations.

        // Query Sets:
        //     Used for obtaining information about rendering and compute operations, such as the number of primitives rendered or the duration of a set of operations.
        //  Useful for performance measurements and conditional rendering based on previous GPU tasks.

    }
}

class O_webgpu_texture {
    constructor(
        n_scl_x, 
        n_scl_y, 
        n_channels, 
        o_texture_from_device
    ){
        this.a_n__typed = a_n__typed, 
        this.n_scl_x = n_scl_x, 
        this.n_scl_y = n_scl_y
        this.n_channels = n_channels
        this.o_texture_from_device = o_texture_from_device
    }
}
class O_webgpu_buffer{
    constructor(
        s_wgsl_type,
        s_access_qualifier,
        b_uniform, 
        o_buffer_from_device
    ){
        this.s_wgsl_type = s_wgsl_type
        this.s_access_qualifier = s_access_qualifier
        this.b_uniform = b_uniform
        this.o_buffer_from_device = o_buffer_from_device
    }
}
class O_gpu_gateway_webgpu{
    constructor(
        o_gpu,
        o_adapter,
        o_device,
        o_canvas, 
        o_ctx, 
        o_pipeline, 
        a_o_gpu_gateway_webgpu_dataitem,
        a_o_bindgroup
    ){
        this.o_gpu = o_gpu
        this.o_adapter = o_adapter
        this.o_device = o_device
        this.o_canvas = o_canvas 
        this.o_ctx = o_ctx 
        this.o_pipeline = o_pipeline
        this.a_o_gpu_gateway_webgpu_dataitem = a_o_gpu_gateway_webgpu_dataitem
        this.a_o_bindgroup = a_o_bindgroup
    }
}

class O_shader_info{
    constructor(
        s_type,
        s_code_shader,
        o_shader, 
        a_o_shader_error, 
        n_ts_ms_start_compile, 
        n_ms_duration_compile
    ){
        this.s_type = s_type
        this.s_code_shader = s_code_shader  ,
        this.o_shader = o_shader  , 
        this.a_o_shader_error = a_o_shader_error,
        this.n_ts_ms_start_compile = n_ts_ms_start_compile, 
        this.n_ms_duration_compile = n_ms_duration_compile  
    }
}
class O_shader_error{
    constructor(
        o_shader_info, 
        s_error_prefix,
        n_idx,
        n_line,
        s_code_content_with_error__quoted,
        s_error_type,
        s_line_code_with_error,
        s_rustlike_error
    ){
        this.o_shader_info = o_shader_info, 
        this.s_error_prefix = s_error_prefix,
        this.n_idx = n_idx,
        this.n_line = n_line,
        this.s_code_content_with_error__quoted = s_code_content_with_error__quoted,
        this.s_error_type = s_error_type,
        this.s_line_code_with_error = s_line_code_with_error,
        this.s_rustlike_error = s_rustlike_error
    }
}
class O_webgl_format{
    constructor(
        s_name,
        s_base_format,
        a_s_bits_channel,
        n_channels, 
        n_webgl_value,
        n_shared_bits,
        b_color_renderable,
        b_texture_filterable, 
        b_gamma_corrected
    ){
        this.s_name = s_name,
        this.s_base_format = s_base_format,
        this.a_s_bits_channel = a_s_bits_channel
        this.n_channels = n_channels
        this.n_webgl_value = n_webgl_value
        this.n_shared_bits = n_shared_bits,
        this.b_color_renderable = b_color_renderable,
        this.b_texture_filterable = b_texture_filterable, 
        this.b_gamma_corrected = b_gamma_corrected
    }
}


export {
    // O_gpu_array_data, 
    O_gpu_gateway,
    O_shader_info, 
    O_shader_error, 
    O_gpu_texture, 
    O_webgl_format, 
    O_gpu_texture_collection,
    O_gpu_texture_collection_item, 
    O_texture,
    O_gpu_gateway_webgpu, 
    O_gpu_gateway_webgpu_dataitem, 
    O_webgpu_texture,
    O_webgpu_buffer,
}