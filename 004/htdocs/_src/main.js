(() => {

  // ==================================================
  // 　　SETTING
  // ==================================================

  let notWebGL = () => {
    console.log('this browser does not support webGL')
  };

  if(document.getElementsByTagName('html')[0].classList.contains('no-webgl')){
    notWebGL();
  }

  // try {
  //   init();
  //   // let renderer = new THREE.WebGLRenderer();
  // } catch(e) {
  //   notWebGL();
  // }

  // console.log(ubu.detect);

  if(ubu.detect.browser.ie){
    console.log('IEさん、動画テクスチャはちょっと…無理ですね…')
  }

  // ==================================================
  // 　　MAIN
  // ==================================================

  window.addEventListener('load', function() {
  // let init = () => {

    // ==================================================
    // 　　VARIABLES
    // ==================================================

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let targetDOM = document.getElementById('canvas');
    targetDOM.width *= devicePixelRatio;
    targetDOM.height *= devicePixelRatio;
    targetDOM.style.width = String(targetDOM.width / devicePixelRatio) + 'px';

    let mainVert = require('./../_shader/main.vert');
    let mainFrag = require('./../_shader/main.frag');
    // let postVert = require('./../_shader/post.vert');
    // let postFrag = require('./../_shader/post.frag');

    // let run = true;
    // window.addEventListener('keydown', function(event) {
    //   run = event.keyCode !== 27;
    // }, false);

    window.addEventListener('mousemove', function(e) {
      let x = event.clientX * 2.0 - winWidth;
      let y = event.clientY * 2.0 - winHeight;
      x /= winWidth;
      y /= winHeight;
      scene.position.x = -x * 0.1;
      scene.position.y =  y * 0.1;

      uniforms.mouse.value.x = e.pageX
      uniforms.mouse.value.y = e.pageY
    }, false);

    // ==================================================
    // 　　INIT
    // ==================================================

    let init = () => {
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    }

    // ==================================================
    // 　　RESIZE
    // ==================================================

    window.addEventListener('resize', function() {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;
      renderer.setSize(winWidth, winHeight);
      camera.aspect = winWidth / winHeight;
      camera.updateProjectionMatrix();
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    }, false );

    // ==================================================
    // 　　SCROLL
    // ==================================================

    // let scrollWatch = function() {
    //   let scrollTop = $(window).scrollTop();
    //   scene.position.y = scrollTop * 0.02;
    //   window.requestAnimationFrame(scrollWatch);
    // }

    // ==================================================
    // 　　RENDER
    // ==================================================

    let render = () => {
      count++;
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    // ==================================================
    // 　　CLASS
    // ==================================================

    let scene;
    let camera;
    let controls;
    let uniforms;
    let renderer;
    let geometry;
    let material;
    let directional;
    let ambient;
    let group;
    let mesh;

    // ==================================================
    // 　　PARAMETER
    // ==================================================

    let CAMERA_PARAMETER = {
      fovy: 60,
      aspect: winWidth / winHeight,
      near: 0.1,
      far: 1000.0,
      x: 0.0,
      y: 0.0,
      z: 5.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };

    let RENDERER_PARAMETER = {
      clearColor: 0xf5f5f5,
      width: winWidth,
      height: winHeight
    };

    let MATERIAL_PARAMETER = {
      color: 0xff0000
    };

    // ==================================================
    // 　　INITIALIZE
    // ==================================================

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      CAMERA_PARAMETER.fovy,
      CAMERA_PARAMETER.aspect,
      CAMERA_PARAMETER.near,
      CAMERA_PARAMETER.far
    );

    camera.position.x = CAMERA_PARAMETER.x;
    camera.position.y = CAMERA_PARAMETER.y;
    camera.position.z = CAMERA_PARAMETER.z;
    camera.lookAt(CAMERA_PARAMETER.lookAt);

    // controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
    renderer.setSize(RENDERER_PARAMETER.width, RENDERER_PARAMETER.height);
    targetDOM.appendChild(renderer.domElement);

    // ==================================================
    // 　　UNIFORMS
    // ==================================================

    uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2()
      },
      time: {
        type: 'f',
        value: 1.0
      }
    };

    // ==================================================
    // 　　GEOMETRY
    // ==================================================

    geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( [
      -1.0, -1.0,  1.0,
    	 1.0, -1.0,  1.0,
    	 1.0,  1.0,  1.0,
    	 1.0,  1.0,  1.0,
    	-1.0,  1.0,  1.0,
    	-1.0, -1.0,  1.0
    ]);

    geometry.addAttribute('position',
      new THREE.BufferAttribute(vertices, 3)
    );

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: mainVert,
      fragmentShader: mainFrag
    });

    material.side = THREE.DoubleSide;

    // ==================================================
    // 　　LIGHT
    // ==================================================

    directional = new THREE.DirectionalLight(0xffffff);
    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(directional);
    scene.add(ambient);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    mesh = new THREE.Line(geometry, material);
    scene.add(mesh);

    // ==================================================
    // 　　EVENT
    // ==================================================

    init();

    let count = 0;
    render();

  // }
  }, false);

})();
