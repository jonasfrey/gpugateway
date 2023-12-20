import {
    O_webgl_format
} from "./classes.module.js"
let f_get_possible_channel_layouts = function(){
    //on https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D?retiredLocale=de
    let a_o = Array.from(document.querySelectorAll('.table-container')[1].querySelectorAll('tr')).map((o,n_idx)=>{
        if(n_idx==0){return false}
        let o2 = {

            s_name: o.querySelectorAll('td')[0].innerText,
            s_base_format: o.querySelectorAll('td')[1].innerText,
            a_s_bits_channel:[
                o.querySelectorAll('td')[2].innerText.replace('s', 'snor'),
                o.querySelectorAll('td')[3].innerText.replace('s', 'snor'),
                o.querySelectorAll('td')[4].innerText.replace('s', 'snor'),
                o.querySelectorAll('td')[5].innerText.replace('s', 'snor'),
            ].filter(s=>s.trim()!=''),
            n_shared_bits: o.querySelectorAll('td')[6].innerText,
            b_color_renderable: o.querySelectorAll('td')[7].innerText.trim() != '',
            b_texture_filterable: o.querySelectorAll('td')[8].innerText.trim()!='',
        }
        o2.b_gamma_corrected = o2.s_name.startsWith('S');
        o2.n_channels = o2.a_s_bits_channel.length
        o2.s_name_short = `${o2.a_s_bits_channel.join('_')}${((o2.b_gamma_corrected)? '_gamma_corrected' : '')}`
        return o2
    }).filter(v=>v)
    let f_s = (o)=>{return `o_wf_${o.s_name_short}`}
    let s = `
    let o_canvas = document.createElement('canvas');
    let o_ctx = o_canvas.getContext("webgl2");
    ${
    a_o.map(o=>{
        return `
            let ${f_s(o)} = new O_webgl_format(...${  
                    JSON.stringify([
                        o.s_name,
                        o.s_base_format,
                        o.a_s_bits_channel,
                        o.n_channels,
                        0,
                        o.n_shared_bits,
                        o.b_color_renderable,
                        o.b_texture_filterable,
                        o.b_gamma_corrected
                    ])
                });${f_s(o)}.n_webgl_value = o_ctx.${o.s_name};
        `.trim()
        
    }).join('\n')
    }
    
    export {
        ${a_o.map(o=>f_s(o)).join(',\n')}
    }
`
    console.log(s)
    // JSON.stringify(a_o)
}




let s_context_webgl_version = 'webgl2';
let o_can = document.createElement('canvas');
let o_ctx2 = o_can.getContext(s_context_webgl_version);
let o_webgl_info = {
    ...Object.assign({},

            ...[
                [
                    "The maximum number of texture image units that can be used to access texture maps from the vertex shader.",
                    "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
                ],
                [
                    "The maximum size (width and height) of a texture that WebGL can handle.",
                    "MAX_TEXTURE_SIZE",
                ],
                [
                    "The maximum size of each side of a cube map texture.",
                    "MAX_CUBE_MAP_TEXTURE_SIZE",
                ],
                [
                    "The maximum size for the width and height of a renderbuffer.",
                    "MAX_RENDERBUFFER_SIZE",
                ],
                [
                    "The maximum number of vertex attributes that can be used by a WebGL program.",
                    "MAX_VERTEX_ATTRIBS",
                ],
                [
                    "The maximum number of varying vectors that can be used by a WebGL program.",
                    "MAX_VARYING_VECTORS",
                ],
                [
                    "The maximum number of 4-vectors that may be held in vertex shader uniform variables.",
                    "MAX_VERTEX_UNIFORM_VECTORS",
                ],
                [
                    "The maximum number of 4-vectors that may be held in fragment shader uniform variables.",
                    "MAX_FRAGMENT_UNIFORM_VECTORS",
                ],
                [
                    "The maximum supported dimensions for the viewport.",
                    "MAX_VIEWPORT_DIMS",
                ],
                [
                    "The total number of texture image units accessible from both the vertex and fragment shaders.",
                    "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
                ],
                [
                    "(WebGL2 only) The maximum number of color attachments that can be used to render to simultaneously in the fragment shader.",
                    "MAX_DRAW_BUFFERS"
                ], 
                [
                    "the maximum layers for a texture arrray, (a texture can include multiple textures)",
                    "MAX_ARRAY_TEXTURE_LAYERS"
                ]

        ].map(a_s=>{
            let s_desc = a_s[0];
            let s_prop = a_s[1];
            const v = o_ctx2.getParameter(o_ctx2[s_prop]);
            return {
                [`o_${s_prop}`]: {
                    s_prop,
                    v: v,
                    s_description: s_desc
                }
            }

        })
    
    )
};
export{
    o_webgl_info
}
console.log(o_webgl_info);

let o_canvas = document.createElement('canvas');
let o_ctx = o_canvas.getContext("webgl2");
let o_wf_8 = new O_webgl_format(...["R8","RED",["8"],1,0,"",true,true,false]);o_wf_8.n_webgl_value = o_ctx.R8;
let o_wf_snor8 = new O_webgl_format(...["R8_SNORM","RED",["snor8"],1,0,"",false,true,false]);o_wf_snor8.n_webgl_value = o_ctx.R8_SNORM;
let o_wf_8_8 = new O_webgl_format(...["RG8","RG",["8","8"],2,0,"",true,true,false]);o_wf_8_8.n_webgl_value = o_ctx.RG8;
let o_wf_snor8_snor8 = new O_webgl_format(...["RG8_SNORM","RG",["snor8","snor8"],2,0,"",false,true,false]);o_wf_snor8_snor8.n_webgl_value = o_ctx.RG8_SNORM;
let o_wf_8_8_8 = new O_webgl_format(...["RGB8","RGB",["8","8","8"],3,0,"",true,true,false]);o_wf_8_8_8.n_webgl_value = o_ctx.RGB8;
let o_wf_snor8_snor8_snor8 = new O_webgl_format(...["RGB8_SNORM","RGB",["snor8","snor8","snor8"],3,0,"",false,true,false]);o_wf_snor8_snor8_snor8.n_webgl_value = o_ctx.RGB8_SNORM;
let o_wf_5_6_5 = new O_webgl_format(...["RGB565","RGB",["5","6","5"],3,0,"",true,true,false]);o_wf_5_6_5.n_webgl_value = o_ctx.RGB565;
let o_wf_4_4_4_4 = new O_webgl_format(...["RGBA4","RGBA",["4","4","4","4"],4,0,"",true,true,false]);o_wf_4_4_4_4.n_webgl_value = o_ctx.RGBA4;
let o_wf_5_5_5_1 = new O_webgl_format(...["RGB5_A1","RGBA",["5","5","5","1"],4,0,"",true,true,false]);o_wf_5_5_5_1.n_webgl_value = o_ctx.RGB5_A1;
let o_wf_8_8_8_8 = new O_webgl_format(...["RGBA8","RGBA",["8","8","8","8"],4,0,"",true,true,false]);o_wf_8_8_8_8.n_webgl_value = o_ctx.RGBA8;
let o_wf_snor8_snor8_snor8_snor8 = new O_webgl_format(...["RGBA8_SNORM","RGBA",["snor8","snor8","snor8","snor8"],4,0,"",false,true,false]);o_wf_snor8_snor8_snor8_snor8.n_webgl_value = o_ctx.RGBA8_SNORM;
let o_wf_10_10_10_2 = new O_webgl_format(...["RGB10_A2","RGBA",["10","10","10","2"],4,0,"",true,true,false]);o_wf_10_10_10_2.n_webgl_value = o_ctx.RGB10_A2;
let o_wf_ui10_ui10_ui10_ui2 = new O_webgl_format(...["RGB10_A2UI","RGBA",["ui10","ui10","ui10","ui2"],4,0,"",true,false,false]);o_wf_ui10_ui10_ui10_ui2.n_webgl_value = o_ctx.RGB10_A2UI;
let o_wf_8_8_8_gamma_corrected = new O_webgl_format(...["SRGB8","RGB",["8","8","8"],3,0,"",false,true,true]);o_wf_8_8_8_gamma_corrected.n_webgl_value = o_ctx.SRGB8;
let o_wf_8_8_8_8_gamma_corrected = new O_webgl_format(...["SRGB8_ALPHA8","RGBA",["8","8","8","8"],4,0,"",true,true,true]);o_wf_8_8_8_8_gamma_corrected.n_webgl_value = o_ctx.SRGB8_ALPHA8;
let o_wf_f16 = new O_webgl_format(...["R16F","RED",["f16"],1,0,"",false,true,false]);o_wf_f16.n_webgl_value = o_ctx.R16F;
let o_wf_f16_f16 = new O_webgl_format(...["RG16F","RG",["f16","f16"],2,0,"",false,true,false]);o_wf_f16_f16.n_webgl_value = o_ctx.RG16F;
let o_wf_f16_f16_f16 = new O_webgl_format(...["RGB16F","RGB",["f16","f16","f16"],3,0,"",false,true,false]);o_wf_f16_f16_f16.n_webgl_value = o_ctx.RGB16F;
let o_wf_f16_f16_f16_f16 = new O_webgl_format(...["RGBA16F","RGBA",["f16","f16","f16","f16"],4,0,"",false,true,false]);o_wf_f16_f16_f16_f16.n_webgl_value = o_ctx.RGBA16F;
let o_wf_f32 = new O_webgl_format(...["R32F","RED",["f32"],1,0,"",false,false,false]);o_wf_f32.n_webgl_value = o_ctx.R32F;
let o_wf_f32_f32 = new O_webgl_format(...["RG32F","RG",["f32","f32"],2,0,"",false,false,false]);o_wf_f32_f32.n_webgl_value = o_ctx.RG32F;
let o_wf_f32_f32_f32 = new O_webgl_format(...["RGB32F","RGB",["f32","f32","f32"],3,0,"",false,false,false]);o_wf_f32_f32_f32.n_webgl_value = o_ctx.RGB32F;
let o_wf_f32_f32_f32_f32 = new O_webgl_format(...["RGBA32F","RGBA",["f32","f32","f32","f32"],4,0,"",false,false,false]);o_wf_f32_f32_f32_f32.n_webgl_value = o_ctx.RGBA32F;
let o_wf_f11_f11_f10 = new O_webgl_format(...["R11F_G11F_B10F","RGB",["f11","f11","f10"],3,0,"",false,true,false]);o_wf_f11_f11_f10.n_webgl_value = o_ctx.R11F_G11F_B10F;
let o_wf_9_9_9 = new O_webgl_format(...["RGB9_E5","RGB",["9","9","9"],3,0,"5",false,true,false]);o_wf_9_9_9.n_webgl_value = o_ctx.RGB9_E5;
let o_wf_i8 = new O_webgl_format(...["R8I","RED",["i8"],1,0,"",true,false,false]);o_wf_i8.n_webgl_value = o_ctx.R8I;
let o_wf_ui8 = new O_webgl_format(...["R8UI","RED",["ui8"],1,0,"",true,false,false]);o_wf_ui8.n_webgl_value = o_ctx.R8UI;
let o_wf_i16 = new O_webgl_format(...["R16I","RED",["i16"],1,0,"",true,false,false]);o_wf_i16.n_webgl_value = o_ctx.R16I;
let o_wf_ui16 = new O_webgl_format(...["R16UI","RED",["ui16"],1,0,"",true,false,false]);o_wf_ui16.n_webgl_value = o_ctx.R16UI;
let o_wf_i32 = new O_webgl_format(...["R32I","RED",["i32"],1,0,"",true,false,false]);o_wf_i32.n_webgl_value = o_ctx.R32I;
let o_wf_ui32 = new O_webgl_format(...["R32UI","RED",["ui32"],1,0,"",true,false,false]);o_wf_ui32.n_webgl_value = o_ctx.R32UI;
let o_wf_i8_i8 = new O_webgl_format(...["RG8I","RG",["i8","i8"],2,0,"",true,false,false]);o_wf_i8_i8.n_webgl_value = o_ctx.RG8I;
let o_wf_ui8_ui8 = new O_webgl_format(...["RG8UI","RG",["ui8","ui8"],2,0,"",true,false,false]);o_wf_ui8_ui8.n_webgl_value = o_ctx.RG8UI;
let o_wf_i16_i16 = new O_webgl_format(...["RG16I","RG",["i16","i16"],2,0,"",true,false,false]);o_wf_i16_i16.n_webgl_value = o_ctx.RG16I;
let o_wf_ui16_ui16 = new O_webgl_format(...["RG16UI","RG",["ui16","ui16"],2,0,"",true,false,false]);o_wf_ui16_ui16.n_webgl_value = o_ctx.RG16UI;
let o_wf_i32_i32 = new O_webgl_format(...["RG32I","RG",["i32","i32"],2,0,"",true,false,false]);o_wf_i32_i32.n_webgl_value = o_ctx.RG32I;
let o_wf_ui32_ui32 = new O_webgl_format(...["RG32UI","RG",["ui32","ui32"],2,0,"",true,false,false]);o_wf_ui32_ui32.n_webgl_value = o_ctx.RG32UI;
let o_wf_i8_i8_i8 = new O_webgl_format(...["RGB8I","RGB",["i8","i8","i8"],3,0,"",false,false,false]);o_wf_i8_i8_i8.n_webgl_value = o_ctx.RGB8I;
let o_wf_ui8_ui8_ui8 = new O_webgl_format(...["RGB8UI","RGB",["ui8","ui8","ui8"],3,0,"",false,false,false]);o_wf_ui8_ui8_ui8.n_webgl_value = o_ctx.RGB8UI;
let o_wf_i16_i16_i16 = new O_webgl_format(...["RGB16I","RGB",["i16","i16","i16"],3,0,"",false,false,false]);o_wf_i16_i16_i16.n_webgl_value = o_ctx.RGB16I;
let o_wf_ui16_ui16_ui16 = new O_webgl_format(...["RGB16UI","RGB",["ui16","ui16","ui16"],3,0,"",false,false,false]);o_wf_ui16_ui16_ui16.n_webgl_value = o_ctx.RGB16UI;
let o_wf_i32_i32_i32 = new O_webgl_format(...["RGB32I","RGB",["i32","i32","i32"],3,0,"",false,false,false]);o_wf_i32_i32_i32.n_webgl_value = o_ctx.RGB32I;
let o_wf_ui32_ui32_ui32 = new O_webgl_format(...["RGB32UI","RGB",["ui32","ui32","ui32"],3,0,"",false,false,false]);o_wf_ui32_ui32_ui32.n_webgl_value = o_ctx.RGB32UI;
let o_wf_i8_i8_i8_i8 = new O_webgl_format(...["RGBA8I","RGBA",["i8","i8","i8","i8"],4,0,"",true,false,false]);o_wf_i8_i8_i8_i8.n_webgl_value = o_ctx.RGBA8I;
let o_wf_ui8_ui8_ui8_ui8 = new O_webgl_format(...["RGBA8UI","RGBA",["ui8","ui8","ui8","ui8"],4,0,"",true,false,false]);o_wf_ui8_ui8_ui8_ui8.n_webgl_value = o_ctx.RGBA8UI;
let o_wf_i16_i16_i16_i16 = new O_webgl_format(...["RGBA16I","RGBA",["i16","i16","i16","i16"],4,0,"",true,false,false]);o_wf_i16_i16_i16_i16.n_webgl_value = o_ctx.RGBA16I;
let o_wf_ui16_ui16_ui16_ui16 = new O_webgl_format(...["RGBA16UI","RGBA",["ui16","ui16","ui16","ui16"],4,0,"",true,false,false]);o_wf_ui16_ui16_ui16_ui16.n_webgl_value = o_ctx.RGBA16UI;
let o_wf_i32_i32_i32_i32 = new O_webgl_format(...["RGBA32I","RGBA",["i32","i32","i32","i32"],4,0,"",true,false,false]);o_wf_i32_i32_i32_i32.n_webgl_value = o_ctx.RGBA32I;
let o_wf_ui32_ui32_ui32_ui32 = new O_webgl_format(...["RGBA32UI","RGBA",["ui32","ui32","ui32","ui32"],4,0,"",true,false,false]);o_wf_ui32_ui32_ui32_ui32.n_webgl_value = o_ctx.RGBA32UI;


export {
    o_wf_8,
o_wf_snor8,
o_wf_8_8,
o_wf_snor8_snor8,
o_wf_8_8_8,
o_wf_snor8_snor8_snor8,
o_wf_5_6_5,
o_wf_4_4_4_4,
o_wf_5_5_5_1,
o_wf_8_8_8_8,
o_wf_snor8_snor8_snor8_snor8,
o_wf_10_10_10_2,
o_wf_ui10_ui10_ui10_ui2,
o_wf_8_8_8_gamma_corrected,
o_wf_8_8_8_8_gamma_corrected,
o_wf_f16,
o_wf_f16_f16,
o_wf_f16_f16_f16,
o_wf_f16_f16_f16_f16,
o_wf_f32,
o_wf_f32_f32,
o_wf_f32_f32_f32,
o_wf_f32_f32_f32_f32,
o_wf_f11_f11_f10,
o_wf_9_9_9,
o_wf_i8,
o_wf_ui8,
o_wf_i16,
o_wf_ui16,
o_wf_i32,
o_wf_ui32,
o_wf_i8_i8,
o_wf_ui8_ui8,
o_wf_i16_i16,
o_wf_ui16_ui16,
o_wf_i32_i32,
o_wf_ui32_ui32,
o_wf_i8_i8_i8,
o_wf_ui8_ui8_ui8,
o_wf_i16_i16_i16,
o_wf_ui16_ui16_ui16,
o_wf_i32_i32_i32,
o_wf_ui32_ui32_ui32,
o_wf_i8_i8_i8_i8,
o_wf_ui8_ui8_ui8_ui8,
o_wf_i16_i16_i16_i16,
o_wf_ui16_ui16_ui16_ui16,
o_wf_i32_i32_i32_i32,
o_wf_ui32_ui32_ui32_ui32
}

// manually 
let o_wf_RGBA               = new O_webgl_format("RGBA", "RGBA", ['8','8','8','8'],4,o_ctx.RGBA, null, null, null, null)//type UNSIGNED_BYTE
let o_wf_RGB                = new O_webgl_format("RGB", "RGB", ['8','8','8'],3,o_ctx.RGB, null, null, null, null)//type UNSIGNED_BYTE
let o_wf_RGBA_4_4_4_4       = new O_webgl_format("RGBA", "RGBA", ['4','4','4','4'],4,o_ctx.RGBA, null, null, null, null)//type UNSIGNED_SHORT_4_4_4_4
let o_wf_RGBA_5_5_5_1       = new O_webgl_format("RGBA", "RGBA", ['5','5','5','1'],4,o_ctx.RGBA, null, null, null, null)//type UNSIGNED_SHORT_5_5_5_1
let o_wf_RGB_5_6_5          = new O_webgl_format("RGB", "RGB", ['5','6','5'],3,o_ctx.RGB, null, null, null, null)//type UNSIGNED_SHORT_5_6_5
let o_wf_LUMINANCE_ALPHA    = new O_webgl_format("LUMINANCE_ALPHA", "LUMINANCE_ALPHA", ['8','8'],2,o_ctx.LUMINANCE_ALPHA, null, null, null, null)//type UNSIGNED_BYTE
let o_wf_LUMINANCE          = new O_webgl_format("LUMINANCE", "LUMINANCE", ['8'],1,o_ctx.LUMINANCE, null, null, null, null)//type UNSIGNED_BYTE
let o_wf_ALPHA              = new O_webgl_format("ALPHA", "ALPHA", ['8'],1,o_ctx.ALPHA, null, null, null, null)//type UNSIGNED_BYTE
export {
    o_wf_RGBA,
    o_wf_RGB,
    o_wf_RGBA_4_4_4_4,
    o_wf_RGBA_5_5_5_1,
    o_wf_RGB_5_6_5,
    o_wf_LUMINANCE_ALPHA,
    o_wf_LUMINANCE,
    o_wf_ALPHA,
}

//possible combinations 
let f = ()=>{
    // herer https://registry.khronos.org/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
    let a_o = Array.from(document.querySelectorAll('#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE tr')).map(o=>{
        return {
            internal_format: o.querySelectorAll('td')?.[0]?.innerText,
            format: o.querySelectorAll('td')?.[1]?.innerText,
            a_s_type: o.querySelectorAll('td')?.[2]?.innerText.split('\n'),
        }
        });
        console.log(`
        ${a_o.map(o=>{
            return `
                { internal_format: "${o.internal_format}", format: "${o.format}", a_s_type: ${JSON.stringify(o.a_s_type)} }
        `.trim()
        }).join(',\n')}
        `)
        // JSON.stringify(a_o)
}


let a_o_possible_combination = [
    { internal_format: "undefined", format: "undefined", a_s_type: undefined },
    { internal_format: "RGB", format: "RGB", a_s_type: ["UNSIGNED_BYTE","UNSIGNED_SHORT_5_6_5"] },
    { internal_format: "RGBA", format: "RGBA", a_s_type: ["UNSIGNED_BYTE,","UNSIGNED_SHORT_4_4_4_4","UNSIGNED_SHORT_5_5_5_1"] },
    { internal_format: "LUMINANCE_ALPHA", format: "LUMINANCE_ALPHA", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "LUMINANCE", format: "LUMINANCE", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "ALPHA", format: "ALPHA", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "R8", format: "RED", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "R16F", format: "RED", a_s_type: ["HALF_FLOAT","FLOAT"] },
    { internal_format: "R32F", format: "RED", a_s_type: ["FLOAT"] },
    { internal_format: "R8UI", format: "RED_INTEGER", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "RG8", format: "RG", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "RG16F", format: "RG", a_s_type: ["HALF_FLOAT","FLOAT"] },
    { internal_format: "RG32F", format: "RG", a_s_type: ["FLOAT"] },
    { internal_format: "RG8UI", format: "RG_INTEGER", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "RGB8", format: "RGB", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "SRGB8", format: "RGB", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "RGB565", format: "RGB", a_s_type: ["UNSIGNED_BYTE","UNSIGNED_SHORT_5_6_5"] },
    { internal_format: "R11F_G11F_B10F", format: "RGB", a_s_type: ["UNSIGNED_INT_10F_11F_11F_REV","HALF_FLOAT","FLOAT"] },
    { internal_format: "RGB9_E5", format: "RGB", a_s_type: ["HALF_FLOAT","FLOAT"] },
    { internal_format: "RGB16F", format: "RGB", a_s_type: ["HALF_FLOAT","FLOAT"] },
    { internal_format: "RGB32F", format: "RGB", a_s_type: ["FLOAT"] },
    { internal_format: "RGB8UI", format: "RGB_INTEGER", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "RGBA8", format: "RGBA", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "SRGB8_ALPHA8", format: "RGBA", a_s_type: ["UNSIGNED_BYTE"] },
    { internal_format: "RGB5_A1", format: "RGBA", a_s_type: ["UNSIGNED_BYTE","UNSIGNED_SHORT_5_5_5_1"] },
    { internal_format: "RGB10_A2", format: "RGBA", a_s_type: ["UNSIGNED_INT_2_10_10_10_REV"] },
    { internal_format: "RGBA4", format: "RGBA", a_s_type: ["UNSIGNED_BYTE","UNSIGNED_SHORT_4_4_4_4"] },
    { internal_format: "RGBA16F", format: "RGBA", a_s_type: ["HALF_FLOAT","FLOAT"] },
    { internal_format: "RGBA32F", format: "RGBA", a_s_type: ["FLOAT"] },
    { internal_format: "RGBA8UI", format: "RGBA_INTEGER", a_s_type: ["UNSIGNED_BYTE"] }
]
export{
    s_context_webgl_version
}