import { O_channel_layout } from "./classes.module"

let f_get_possible_channel_layouts = function(){
    //on https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D?retiredLocale=de
    let a_o = Array.from(document.querySelectorAll('.table-container.t1 tr')).map((o,n_idx)=>{
        if(n_idx==0){return false}
        let o2 = {

            s_name: o.querySelectorAll('td')[0].innerText,
            s_base_format: o.querySelectorAll('td')[1].innerText,
            s_bits_channel_0: o.querySelectorAll('td')[2].innerText,
            s_bits_channel_1: o.querySelectorAll('td')[3].innerText,
            s_bits_channel_2: o.querySelectorAll('td')[4].innerText,
            s_bits_channel_3: o.querySelectorAll('td')[5].innerText,
            n_shared_bits: o.querySelectorAll('td')[6].innerText,
            b_color_renderable: o.querySelectorAll('td')[7].innerText.trim() != '',
            b_texture_filterable: o.querySelectorAll('td')[8].innerText.trim()!='',
        }
        o2.s_name_short = `${[
            o2.s_bits_channel_0.replace('s', 'snor'),
            o2.s_bits_channel_1.replace('s', 'snor'),
            o2.s_bits_channel_2.replace('s', 'snor'),
            o2.s_bits_channel_3.replace('s', 'snor')
        ].filter(s=>s.trim()!='').join('_')}${((o2.s_name.startsWith('S'))? '_gamma_corrected' : '')}`
        return o2
    }).filter(v=>v)
    let f_s = (o)=>{return `o_channel_layout__${o.s_name_short}`}
    let s = `${
    a_o.map(o=>{
        return `
            let ${f_s(o)} = new O_channel_layout(
                '${o.s_name}',
                '${o.s_base_format}',
                '${o.s_bits_channel_0}',
                '${o.s_bits_channel_1}',
                '${o.s_bits_channel_2}',
                '${o.s_bits_channel_3}',
                ${(o.n_shared_bits) ? o.n_shared_bits : 0},
                ${o.b_color_renderable},
                ${o.b_texture_filterable}
            );
        `
        
    }).join('\n')
    }
    
    export {
        ${a_o.map(o=>f_s(o)).join('\n,')}
    }
`
    console.log(s)
    // JSON.stringify(a_o)
}




let s_context_webgl_version = 'webgl2';
let o_can = document.createElement('canvas');
let o_ctx = o_can.getContext(s_context_webgl_version);
let n_webgl_type__u8 = o_ctx.UNSIGNED_BYTE // : Represents an unsigned 8-bit integer.
let n_webgl_type__i8 = o_ctx.BYTE // : Represents a signed 8-bit integer.
let n_webgl_type__u16 = o_ctx.UNSIGNED_SHORT // : Represents an unsigned 16-bit integer.
let n_webgl_type__i16 = o_ctx.SHORT // : Represents a signed 16-bit integer.
let n_webgl_type__u32 = o_ctx.UNSIGNED_INT // : Represents an unsigned 32-bit integer (only available with WebGL 2).
let n_webgl_type__i32 = o_ctx.INT // : Represents a signed 32-bit integer.
let n_webgl_type__f32 = o_ctx.FLOAT // : Represents a 32-bit floating-point number.

let n_webgl_vec4_RGB = o_ctx.RGB
let n_webgl_vec4_RGBA = o_ctx.RGBA
let n_webgl_vec4_LUMINANCE_ALPHA = o_ctx.LUMINANCE_ALPHA
let n_webgl_vec4_LUMINANCE = o_ctx.LUMINANCE
let n_webgl_vec4_ALPHA = o_ctx.ALPHA

let n_webgl_vec4_R8_SNORM = o_ctx.R8_SNORM
let n_webgl_vec4_RG8 = o_ctx.RG8
let n_webgl_vec4_RG8_SNORM = o_ctx.RG8_SNORM
let n_webgl_vec4_RGB8 = o_ctx.RGB8
let n_webgl_vec4_RGB8_SNORM = o_ctx.RGB8_SNORM
let n_webgl_vec4_RGB565 = o_ctx.RGB565
let n_webgl_vec4_RGBA4 = o_ctx.RGBA4
let n_webgl_vec4_RGB5_A1 = o_ctx.RGB5_A1
let n_webgl_vec4_RGBA8 = o_ctx.RGBA8
let n_webgl_vec4_RGBA8_SNORM = o_ctx.RGBA8_SNORM
let n_webgl_vec4_RGB10_A2 = o_ctx.RGB10_A2
let n_webgl_vec4_RGB10_A2UI = o_ctx.RGB10_A2UI
let n_webgl_vec4_SRGB8 = o_ctx.SRGB8
let n_webgl_vec4_SRGB8_ALPHA8 = o_ctx.SRGB8_ALPHA8
let n_webgl_vec4_R16F = o_ctx.R16F
let n_webgl_vec4_RG16F = o_ctx.RG16F
let n_webgl_vec4_RGB16F = o_ctx.RGB16F
let n_webgl_vec4_RGBA16F = o_ctx.RGBA16F
let n_webgl_vec4_R32F = o_ctx.R32F
let n_webgl_vec4_RG32F = o_ctx.RG32F
let n_webgl_vec4_RGB32F = o_ctx.RGB32F
let n_webgl_vec4_RGBA32F = o_ctx.RGBA32F
let n_webgl_vec4_R11F_G11F_B10F = o_ctx.R11F_G11F_B10F
let n_webgl_vec4_RGB9_E5 = o_ctx.RGB9_E5
let n_webgl_vec4_R8I = o_ctx.R8I
let n_webgl_vec4_R8UI = o_ctx.R8UI
let n_webgl_vec4_R16I = o_ctx.R16I
let n_webgl_vec4_R16UI = o_ctx.R16UI
let n_webgl_vec4_R32I = o_ctx.R32I
let n_webgl_vec4_R32UI = o_ctx.R32UI
let n_webgl_vec4_RG8I = o_ctx.RG8I
let n_webgl_vec4_RG8UI = o_ctx.RG8UI
let n_webgl_vec4_RG16I = o_ctx.RG16I
let n_webgl_vec4_RG16UI = o_ctx.RG16UI
let n_webgl_vec4_RG32I = o_ctx.RG32I
let n_webgl_vec4_RG32UI = o_ctx.RG32UI
let n_webgl_vec4_RGB8I = o_ctx.RGB8I
let n_webgl_vec4_RGB8UI = o_ctx.RGB8UI
let n_webgl_vec4_RGB16I = o_ctx.RGB16I
let n_webgl_vec4_RGB16UI = o_ctx.RGB16UI
let n_webgl_vec4_RGB32I = o_ctx.RGB32I
let n_webgl_vec4_RGB32UI = o_ctx.RGB32UI
let n_webgl_vec4_RGBA8I = o_ctx.RGBA8I
let n_webgl_vec4_RGBA8UI = o_ctx.RGBA8UI
let n_webgl_vec4_RGBA16I = o_ctx.RGBA16I
let n_webgl_vec4_RGBA16UI = o_ctx.RGBA16UI
let n_webgl_vec4_RGBA32I = o_ctx.RGBA32I
let n_webgl_vec4_RGBA32UI = o_ctx.RGBA32UI

let o_webgl_info = {
    ...Object.assign({},
        ...[
            [
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
                ]

        ].map(a_s=>{
            let s_desc = a_s[0];
            let s_prop = a_s[1];
            const v = o_ctx.getParameter(o_ctx[s_prop]);
            return {
                [`o_${s_prop}`]: {
                    s_prop,
                    v: v,
                    s_description: s_desc
                }
            }

        })
    ]
    )
};
console.log(o_webgl_info);




let o_channel_layout__8 = new O_channel_layout(
    'R8',
    'RED',
    '8',
    '',
    '',
    '',
    0,
    true,
    true
);


let o_channel_layout__snor8 = new O_channel_layout(
    'R8_SNORM',
    'RED',
    's8',
    '',
    '',
    '',
    0,
    false,
    true
);


let o_channel_layout__8_8 = new O_channel_layout(
    'RG8',
    'RG',
    '8',
    '8',
    '',
    '',
    0,
    true,
    true
);


let o_channel_layout__snor8_snor8 = new O_channel_layout(
    'RG8_SNORM',
    'RG',
    's8',
    's8',
    '',
    '',
    0,
    false,
    true
);


let o_channel_layout__8_8_8 = new O_channel_layout(
    'RGB8',
    'RGB',
    '8',
    '8',
    '8',
    '',
    0,
    true,
    true
);


let o_channel_layout__snor8_snor8_snor8 = new O_channel_layout(
    'RGB8_SNORM',
    'RGB',
    's8',
    's8',
    's8',
    '',
    0,
    false,
    true
);


let o_channel_layout__5_6_5 = new O_channel_layout(
    'RGB565',
    'RGB',
    '5',
    '6',
    '5',
    '',
    0,
    true,
    true
);


let o_channel_layout__4_4_4_4 = new O_channel_layout(
    'RGBA4',
    'RGBA',
    '4',
    '4',
    '4',
    '4',
    0,
    true,
    true
);


let o_channel_layout__5_5_5_1 = new O_channel_layout(
    'RGB5_A1',
    'RGBA',
    '5',
    '5',
    '5',
    '1',
    0,
    true,
    true
);


let o_channel_layout__8_8_8_8 = new O_channel_layout(
    'RGBA8',
    'RGBA',
    '8',
    '8',
    '8',
    '8',
    0,
    true,
    true
);


let o_channel_layout__snor8_snor8_snor8_snor8 = new O_channel_layout(
    'RGBA8_SNORM',
    'RGBA',
    's8',
    's8',
    's8',
    's8',
    0,
    false,
    true
);


let o_channel_layout__10_10_10_2 = new O_channel_layout(
    'RGB10_A2',
    'RGBA',
    '10',
    '10',
    '10',
    '2',
    0,
    true,
    true
);


let o_channel_layout__ui10_ui10_ui10_ui2 = new O_channel_layout(
    'RGB10_A2UI',
    'RGBA',
    'ui10',
    'ui10',
    'ui10',
    'ui2',
    0,
    true,
    false
);


let o_channel_layout__8_8_8_gamma_corrected = new O_channel_layout(
    'SRGB8',
    'RGB',
    '8',
    '8',
    '8',
    '',
    0,
    false,
    true
);


let o_channel_layout__8_8_8_8_gamma_corrected = new O_channel_layout(
    'SRGB8_ALPHA8',
    'RGBA',
    '8',
    '8',
    '8',
    '8',
    0,
    true,
    true
);


let o_channel_layout__f16 = new O_channel_layout(
    'R16F',
    'RED',
    'f16',
    '',
    '',
    '',
    0,
    false,
    true
);


let o_channel_layout__f16_f16 = new O_channel_layout(
    'RG16F',
    'RG',
    'f16',
    'f16',
    '',
    '',
    0,
    false,
    true
);


let o_channel_layout__f16_f16_f16 = new O_channel_layout(
    'RGB16F',
    'RGB',
    'f16',
    'f16',
    'f16',
    '',
    0,
    false,
    true
);


let o_channel_layout__f16_f16_f16_f16 = new O_channel_layout(
    'RGBA16F',
    'RGBA',
    'f16',
    'f16',
    'f16',
    'f16',
    0,
    false,
    true
);


let o_channel_layout__f32 = new O_channel_layout(
    'R32F',
    'RED',
    'f32',
    '',
    '',
    '',
    0,
    false,
    false
);


let o_channel_layout__f32_f32 = new O_channel_layout(
    'RG32F',
    'RG',
    'f32',
    'f32',
    '',
    '',
    0,
    false,
    false
);


let o_channel_layout__f32_f32_f32 = new O_channel_layout(
    'RGB32F',
    'RGB',
    'f32',
    'f32',
    'f32',
    '',
    0,
    false,
    false
);


let o_channel_layout__f32_f32_f32_f32 = new O_channel_layout(
    'RGBA32F',
    'RGBA',
    'f32',
    'f32',
    'f32',
    'f32',
    0,
    false,
    false
);


let o_channel_layout__f11_f11_f10 = new O_channel_layout(
    'R11F_G11F_B10F',
    'RGB',
    'f11',
    'f11',
    'f10',
    '',
    0,
    false,
    true
);


let o_channel_layout__9_9_9 = new O_channel_layout(
    'RGB9_E5',
    'RGB',
    '9',
    '9',
    '9',
    '',
    5,
    false,
    true
);


let o_channel_layout__i8 = new O_channel_layout(
    'R8I',
    'RED',
    'i8',
    '',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__ui8 = new O_channel_layout(
    'R8UI',
    'RED',
    'ui8',
    '',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__i16 = new O_channel_layout(
    'R16I',
    'RED',
    'i16',
    '',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__ui16 = new O_channel_layout(
    'R16UI',
    'RED',
    'ui16',
    '',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__i32 = new O_channel_layout(
    'R32I',
    'RED',
    'i32',
    '',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__ui32 = new O_channel_layout(
    'R32UI',
    'RED',
    'ui32',
    '',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__i8_i8 = new O_channel_layout(
    'RG8I',
    'RG',
    'i8',
    'i8',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__ui8_ui8 = new O_channel_layout(
    'RG8UI',
    'RG',
    'ui8',
    'ui8',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__i16_i16 = new O_channel_layout(
    'RG16I',
    'RG',
    'i16',
    'i16',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__ui16_ui16 = new O_channel_layout(
    'RG16UI',
    'RG',
    'ui16',
    'ui16',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__i32_i32 = new O_channel_layout(
    'RG32I',
    'RG',
    'i32',
    'i32',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__ui32_ui32 = new O_channel_layout(
    'RG32UI',
    'RG',
    'ui32',
    'ui32',
    '',
    '',
    0,
    true,
    false
);


let o_channel_layout__i8_i8_i8 = new O_channel_layout(
    'RGB8I',
    'RGB',
    'i8',
    'i8',
    'i8',
    '',
    0,
    false,
    false
);


let o_channel_layout__ui8_ui8_ui8 = new O_channel_layout(
    'RGB8UI',
    'RGB',
    'ui8',
    'ui8',
    'ui8',
    '',
    0,
    false,
    false
);


let o_channel_layout__i16_i16_i16 = new O_channel_layout(
    'RGB16I',
    'RGB',
    'i16',
    'i16',
    'i16',
    '',
    0,
    false,
    false
);


let o_channel_layout__ui16_ui16_ui16 = new O_channel_layout(
    'RGB16UI',
    'RGB',
    'ui16',
    'ui16',
    'ui16',
    '',
    0,
    false,
    false
);


let o_channel_layout__i32_i32_i32 = new O_channel_layout(
    'RGB32I',
    'RGB',
    'i32',
    'i32',
    'i32',
    '',
    0,
    false,
    false
);


let o_channel_layout__ui32_ui32_ui32 = new O_channel_layout(
    'RGB32UI',
    'RGB',
    'ui32',
    'ui32',
    'ui32',
    '',
    0,
    false,
    false
);


let o_channel_layout__i8_i8_i8_i8 = new O_channel_layout(
    'RGBA8I',
    'RGBA',
    'i8',
    'i8',
    'i8',
    'i8',
    0,
    true,
    false
);


let o_channel_layout__ui8_ui8_ui8_ui8 = new O_channel_layout(
    'RGBA8UI',
    'RGBA',
    'ui8',
    'ui8',
    'ui8',
    'ui8',
    0,
    true,
    false
);


let o_channel_layout__i16_i16_i16_i16 = new O_channel_layout(
    'RGBA16I',
    'RGBA',
    'i16',
    'i16',
    'i16',
    'i16',
    0,
    true,
    false
);


let o_channel_layout__ui16_ui16_ui16_ui16 = new O_channel_layout(
    'RGBA16UI',
    'RGBA',
    'ui16',
    'ui16',
    'ui16',
    'ui16',
    0,
    true,
    false
);


let o_channel_layout__i32_i32_i32_i32 = new O_channel_layout(
    'RGBA32I',
    'RGBA',
    'i32',
    'i32',
    'i32',
    'i32',
    0,
    true,
    false
);


let o_channel_layout__ui32_ui32_ui32_ui32 = new O_channel_layout(
    'RGBA32UI',
    'RGBA',
    'ui32',
    'ui32',
    'ui32',
    'ui32',
    0,
    true,
    false
);


export {
o_channel_layout__8
,o_channel_layout__snor8
,o_channel_layout__8_8
,o_channel_layout__snor8_snor8
,o_channel_layout__8_8_8
,o_channel_layout__snor8_snor8_snor8
,o_channel_layout__5_6_5
,o_channel_layout__4_4_4_4
,o_channel_layout__5_5_5_1
,o_channel_layout__8_8_8_8
,o_channel_layout__snor8_snor8_snor8_snor8
,o_channel_layout__10_10_10_2
,o_channel_layout__ui10_ui10_ui10_ui2
,o_channel_layout__8_8_8_gamma_corrected
,o_channel_layout__8_8_8_8_gamma_corrected
,o_channel_layout__f16
,o_channel_layout__f16_f16
,o_channel_layout__f16_f16_f16
,o_channel_layout__f16_f16_f16_f16
,o_channel_layout__f32
,o_channel_layout__f32_f32
,o_channel_layout__f32_f32_f32
,o_channel_layout__f32_f32_f32_f32
,o_channel_layout__f11_f11_f10
,o_channel_layout__9_9_9
,o_channel_layout__i8
,o_channel_layout__ui8
,o_channel_layout__i16
,o_channel_layout__ui16
,o_channel_layout__i32
,o_channel_layout__ui32
,o_channel_layout__i8_i8
,o_channel_layout__ui8_ui8
,o_channel_layout__i16_i16
,o_channel_layout__ui16_ui16
,o_channel_layout__i32_i32
,o_channel_layout__ui32_ui32
,o_channel_layout__i8_i8_i8
,o_channel_layout__ui8_ui8_ui8
,o_channel_layout__i16_i16_i16
,o_channel_layout__ui16_ui16_ui16
,o_channel_layout__i32_i32_i32
,o_channel_layout__ui32_ui32_ui32
,o_channel_layout__i8_i8_i8_i8
,o_channel_layout__ui8_ui8_ui8_ui8
,o_channel_layout__i16_i16_i16_i16
,o_channel_layout__ui16_ui16_ui16_ui16
,o_channel_layout__i32_i32_i32_i32
,o_channel_layout__ui32_ui32_ui32_ui32
}
