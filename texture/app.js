import Shader from "./src/shader";
import Texture from "./src/texture";
import Framebuffer from "./src/framebuffer";

window.onload = async function () {
    let canvas = document.createElement("canvas");
    let gl = canvas.getContext("webgl", {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
    });
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    let vertex = `
        precision highp float; 
        varying vec2 c; 
        attribute vec2 pos; 
        void main(){ 
        gl_Position.xy = 2.0*pos-vec2(1.0); 
        gl_Position.zw = vec2(0.0,1.0); 
        c=pos; 
        }
    `;
    let fragment = `
        precision highp float; 
        varying vec2 c; 
        uniform sampler2D tTex; 
        void main(){ 
        gl_FragColor=texture2D(tTex,c).rgbr; 
        }
    `;
    let blitShader = new Shader(gl);
    blitShader.build(vertex, fragment);

    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    let position = new Float32Array([0, 0, 2, 0, 0, 2]);
    gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var g = function (texture) {
        blitShader.bind();
        texture.bind(blitShader.samplers.tTex);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.enableVertexAttribArray(blitShader.attribs.pos);
        gl.vertexAttribPointer(blitShader.attribs.pos, 2, gl.FLOAT, !1, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.disableVertexAttribArray(blitShader.attribs.pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    gl.ext = {
        textureAniso: gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic"),
        textureFloat: gl.getExtension("OES_texture_float"),
        textureFloatLinear: gl.getExtension("OES_texture_float_linear"),
        textureHalf: gl.getExtension("OES_texture_half_float"),
        textureHalfLinear: gl.getExtension("OES_texture_half_float_linear"),
        textureDepth: gl.getExtension("WEBGL_depth_texture"),
        colorBufferFloat: gl.getExtension("WEBGL_color_buffer_float"),
        colorBufferHalf: gl.getExtension("EXT_color_buffer_half_float"),
        index32bit: gl.getExtension("OES_element_index_uint"),
        loseContext: gl.getExtension("WEBGL_lose_context"),
        derivatives: gl.getExtension("OES_standard_derivatives"),
        renderInfo: gl.getExtension("WEBGL_debug_renderer_info")
    };

    let h = new Texture(gl, { mipmap: true, clamp: false, mirror: false, nofilter: false, aniso: 4 });

    let baseTex = await loadImage("assets/mat1_c.jpg");

    let aphlaTex = await loadImage("assets/mat1_a.jpg");

    // let params = { mipmap: true, aniso: 4, clamp: false, mirror: false }; //{mipmap: true, clamp: false, mirror: false, nofilter: false, aniso: 4}
    // if (baseTex && aphlaTex) {
        var a, b;
        aphlaTex.width * aphlaTex.height > baseTex.width * baseTex.height ? (a = aphlaTex.width, b = aphlaTex.height) : (a = baseTex.width, b = baseTex.height);
        h.desc.width = a;
        h.desc.height = b;
        var c = {
            clamp: true
        };
        baseTex.width == a && baseTex.height == b ?
            (
                h.loadImage(baseTex, gl.RGBA),
                a = new Framebuffer(gl, {
                    color0: h,
                    ignoreStatus: true
                })
            )
            :
            (
                b = new Texture(gl, c),
                b.loadImage(baseTex, gl.RGB),
                h.loadArray(null),
                a = new Framebuffer(gl, {
                    color0: h,
                    ignoreStatus: true
                }),
                a.bind(),
                g(b),
                b.destroy()
            );
        b = new Texture(gl, c);
        b.loadImage(aphlaTex, gl.RGB);
    
        a.bind();
        gl.colorMask(!1, !1, !1, !0);
        g(b);
        gl.colorMask(!0, !0, !0, !0);
        b.destroy();
        h.rebuildMips()
    //   gl.bindFramebuffer(gl.FRAMEBUFFER, a.fbo);
    //   gl.framebufferTexture2D(
    //     gl.FRAMEBUFFER,
    //     gl.COLOR_ATTACHMENT0,
    //     gl.TEXTURE_2D,
    //     h.id,
    //     0
    //   );
    //   let framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    //   if (
    //     framebufferStatus == gl.FRAMEBUFFER_COMPLETE
    //   ) {
        let pixels = new Uint8Array(baseTex.width * baseTex.height * 4);
          gl.readPixels(0, 0, baseTex.width , baseTex.height,gl.RGBA, gl.UNSIGNED_BYTE, pixels);
          render(pixels,baseTex.width , baseTex.height)
          Framebuffer.bindNone(gl);
    //     }
      
    // }


    const update = () => {


        // gl.useProgram(program);
        // gl.bindVertexArray(vao);
        // gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    requestAnimationFrame(() => {
        update();
    })
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            resolve(img);
        }
    });
}

function render(pixels,width,height){
    
    // let canvas = document.createElement("canvas");
    // canvas.width = width;
    // canvas.height = height;
    // let context = canvas.getContext("2d");
    // let imageData = context.createImageData(width, height);
    // // imageData.data.set(flipY(pixels, width, height));
    // imageData.data.set(pixels);
    // context.putImageData(imageData, 0, 0);
    // downloadMap[originName] = 1;
    // downloadCnt++;
    // downLoadByLink(canvas.toDataURL(), originName);
    const canvas = document.getElementById('canvas1');
        const ctx = canvas.getContext('2d');

        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);
}