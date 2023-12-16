class O_gpu_data{ 
    // i really dont want to call this texture or image because just because webgl screwed up with having a option to pass 1d arrays to the gpu
    constructor(
        o_scl, // we actually would only need the scl_x (width)
        s_type,
        a_n__typed 
    ){
        this.o_scl = o_scl
        this.s_type = s_type
        this.a_n__typed = a_n__typed 
    }
}

class O_gpu_gateway{ 
    constructor(
        o_canvas, 
        o_ctx,
        o_shader__vertex,
        o_shader__fragment,
        o_shader__program
    ){
        this.o_canvas = o_canvas
        this.o_ctx = o_ctx
        this.o_shader__vertex = o_shader__vertex
        this.o_shader__fragment = o_shader__fragment
        this.o_shader__program = o_shader__program
    }
}

export {
    O_gpu_data, 
    O_gpu_gateway
}