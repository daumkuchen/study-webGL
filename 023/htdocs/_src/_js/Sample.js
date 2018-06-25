const TweenMax = require('gsap');
const vertexSrc = require('./../_shader/main.vert');
const fragmentSrc = require('./../_shader/main.frag');

export default class Sample {
  constructor() {
  }
  init() {

    // デモに使用する画像URL
    const assetUrls = [
      './../img/img_01.jpg',
      './../img/img_02.jpg',
      './../img/displacement.jpg'
    ];

    // ===== 初期化開始

    // webglをレンダリングするためのcanvasを作成する。
    let target = document.getElementById('canvas');
    let canvas = document.createElement('canvas');
    target.appendChild(canvas);
    let gl = canvas.getContext('webgl');

    let cnt = 0;
    let textureArr = [];

    // プログラムの作成
    let program = gl.createProgram();

    // vertextシェーダをコンパイル
    var vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vertexSrc);
    gl.compileShader(vShader);

    // fragmentシェーダをコンパイル
    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fragmentSrc);
    gl.compileShader(fShader);

    gl.attachShader(program, vShader);
    gl.deleteShader(vShader);

    gl.attachShader(program, fShader);
    gl.deleteShader(fShader);
    gl.linkProgram(program);

    // bufferの作成
    var vertices = new Float32Array([
    	-1.0, -1.0,
    	 1.0, -1.0,
    	-1.0,  1.0,
    	 1.0, -1.0,
    	-1.0,  1.0,
    	 1.0,  1.0,
    ]);

    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var vertexLocation = gl.getAttribLocation(program, 'position');
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // uniformのロケーションを取得しておく
    let uTransLoc = gl.getUniformLocation(program, 'uTrans');
    let textureLocArr = [];
    textureLocArr.push(gl.getUniformLocation(program, 'uTexture0'));
    textureLocArr.push(gl.getUniformLocation(program, 'uTexture1'));
    textureLocArr.push(gl.getUniformLocation(program, 'uDisp'));

    let obj = {
      trans: 0
    };

    loadImages();
    resize();

    function start(){
    	loop();
    }

    function resize(){
    	let size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
    	if(size > 450)  size = 450;
    	canvas.width = size;
    	canvas.height = size;
    }

    function loop(){
    	// WebGLを初期化する
    	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    	gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

    	// 使用するprogramを指定する
    	gl.useProgram(program);

    	// 描画に使用する頂点バッファーをattributeとして設定する。
    	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    	gl.vertexAttribPointer(
    		vertexLocation, 2, gl.FLOAT, false, 0, 0)
    	gl.enableVertexAttribArray(vertexLocation);

    	// uniformsの値を指定する
    	// 描画に使用するのtexture設定
    	textureArr.forEach((texture, index) => {
    		gl.activeTexture(gl.TEXTURE0 + index);
    		gl.bindTexture(gl.TEXTURE_2D, texture);
    		gl.uniform1i(textureLocArr[index], index);
    	})

    	gl.uniform1f(uTransLoc, obj.trans);
    	gl.drawArrays(gl.TRIANGLES, 0, 6);

    	requestAnimationFrame(loop);
    }

    // デモに使用する画像をロードする
    function loadImages(){
    	assetUrls.forEach((url, index) => {
    		let img = new Image();
    		let texture = gl.createTexture();
    		textureArr.push(texture);

    		img.onload = function(_index, _img){
    			let texture = textureArr[_index];

    			// imageをテクスチャーとして更新する
    			gl.bindTexture(gl.TEXTURE_2D, texture);
    			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, _img);
    			gl.generateMipmap(gl.TEXTURE_2D);

    			cnt++;
    			if(cnt == 3) start();
    		}.bind(this, index, img)

    		img.crossOrigin = "Anonymous";
    		img.src = url;
    	})
    }

    function create_texture(url, num){

      // イメージオブジェクトの生成
      var img = new Image();

      // データのオンロードをトリガーにする
      img.onload = function(){

        // テクスチャオブジェクトの生成
        var tex = gl.createTexture();

        // テクスチャをバインドする
        gl.bindTexture(gl.TEXTURE_2D, tex);

        // テクスチャへイメージを適用
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        // ミップマップを生成
        gl.generateMipmap(gl.TEXTURE_2D);

        // テクスチャのバインドを無効化
        gl.bindTexture(gl.TEXTURE_2D, null);

        // 生成したテクスチャを変数に代入
        switch(num){
          case 0:
            texture0 = tex;
            break;
          case 1:
            texture1 = tex;
            break;
          default:
            break;
        }
      };
      img.src = url;
    }

    canvas.addEventListener('mouseenter', function(){
    	TweenMax.killTweensOf(obj);
    	TweenMax.to(obj, 1.5, {trans: 1});
    });

    canvas.addEventListener('mouseleave', function(){
    	TweenMax.killTweensOf(obj);
    	TweenMax.to(obj, 1.5, {trans: 0});
    });

    window.addEventListener('resize', function() {
      resize();
    });

  }
}
