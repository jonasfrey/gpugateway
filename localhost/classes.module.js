class O_gpu_array_data{ 
    // i really dont want to call this texture or image because just because webgl screwed up with having a option to pass 1d arrays to the gpu
    constructor(
        o_scl, // we actually would only need the scl_x (width)
        s_type,
        a_n__typed
    ){
        this.o_scl = o_scl
        this.s_type = s_type
        this.a_n__typed = a_n__typed
        this.s_prop_name = null 
    }
}
class O_gpu_texture{
    constructor(
        a_n__typed,
        n_scl_x,
        n_scl_y,
        n_datatype__webgl_srcType = 0,
        n_channel_layout_ingpu__webgl_internalFormat = 0, 
        n_channel_layout_input__webgl_srcFormat = 0, 
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
        this.n_channel_layout_ingpu__webgl_internalFormat = n_channel_layout_ingpu__webgl_internalFormat
        this.n_channel_layout_input__webgl_srcFormat = n_channel_layout_input__webgl_srcFormat
        this.n_webgl_level = n_webgl_level
        this.n_webgl_border = n_webgl_border
        this.s_name_in_shader = null;
    }
}

class O_gpu_gateway{ 
    constructor(
        o_canvas, 
        o_ctx,
        a_o_shader_info,
        o_shader__program
    ){
        this.o_canvas = o_canvas
        this.o_ctx = o_ctx
        this.a_o_shader_info = a_o_shader_info
        this.o_shader__program = o_shader__program
        this.a_o_gpu_texture = []
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

export {
    O_gpu_array_data, 
    O_gpu_gateway,
    O_shader_info, 
    O_shader_error, 
    O_gpu_texture
}