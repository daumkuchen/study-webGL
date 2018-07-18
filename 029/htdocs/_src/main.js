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
  //   let renderer = new THREE.WebGLRenderer();
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

    // ==================================================
    // 　　CLASS
    // ==================================================

    const mainVert = require('./../_shader/main.vert');
    const mainFrag = require('./../_shader/main.frag');
    const postVert = require('./../_shader/post.vert');
    const postFrag = require('./../_shader/post.frag');
    const Perlin = require('./../js/lib/perlin.js').Perlin;

    let renderer;
    let scene;
    let camera;

    let uniforms;
    let geometry;
    let material;

    let directional;
    let ambient;

    let mesh;

    let controls;

    let renderer__POST;
    let scene__POST;
    let camera__POST;
    let uniforms__POST;
    let geometry__POST;
    let material__POST;
    let mesh__POST;

    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let targetDOM = document.getElementById('canvas');
    // targetDOM.width *= devicePixelRatio;
    // targetDOM.height *= devicePixelRatio;
    // targetDOM.style.width = String(targetDOM.width / devicePixelRatio) + 'px';

    // ==================================================
    // 　　MOUSE
    // ==================================================

    window.addEventListener('mousemove', function(e) {
      let x = event.clientX * 2.0 - winWidth;
      let y = event.clientY * 2.0 - winHeight;
      x /= winWidth;
      y /= winHeight;

      // scene.position.x = -x * 10.0;
      // scene.position.y =  y * 10.0;

      uniforms.mouse.value.x = e.pageX;
      uniforms.mouse.value.y = e.pageY;
      uniforms__POST.mouse.value.x = e.pageX;
      uniforms__POST.mouse.value.y = e.pageY;
    }, false);

    // ==================================================
    // 　　RESIZE
    // ==================================================

    window.addEventListener('resize', function() {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;

      camera.aspect = winWidth / winHeight;
      camera.updateProjectionMatrix();
      camera__POST.aspect = winWidth / winHeight;
      camera__POST.updateProjectionMatrix();

      renderer.setSize(winWidth, winHeight);
      renderer__POST.setSize(winWidth, winHeight);

      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;

    }, false );

    // ==================================================
    // 　　SCROLL
    // ==================================================

    // let scrollWatch = () => {
    //   let scrollTop = $(window).scrollTop();
    //   scene.position.y = scrollTop * 0.02;
    //   window.requestAnimationFrame(scrollWatch);
    // }

    // ==================================================
    // 　　INIT
    // ==================================================

    let init = () => {
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;
    }

    // ==================================================
    // 　　RENDER
    // ==================================================

    let render = () => {
      count++;

      // scene.rotation.y = -count * 0.001;

      uniforms.time.value += 0.05;
      uniforms__POST.time.value += 0.05;

      renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.clearColor));
      renderer.render(scene, camera, renderer__POST);

      renderer.setClearColor(new THREE.Color(RENDERER_PARAMETER.postColor));
      renderer.render(scene__POST, camera__POST);

      requestAnimationFrame(render);
    }

    // ==================================================
    // 　　PARAMETER
    // ==================================================

    let CAMERA_PARAMETER = {
      fovy: 60,
      aspect: winWidth / winHeight,
      near: 0.01,
      far: 5000.0,
      x: 0.0,
      y: 0.0,
      z: 50.0,
      lookAt: new THREE.Vector3(1.0, 1.0, 1.0)
    };

    let RENDERER_PARAMETER = {
      clearColor: 0x000000,
      postColor: 0xffffff
    };

    let MATERIAL_PARAMETER = {
      color: 0xff0000,
      side: THREE.DoubleSide
    };

    // ==================================================
    // 　　INITIALIZE / SCENE / CAMERA / RENDERER
    // ==================================================

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(RENDERER_PARAMETER.clearColor, 0.01, 1000);

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

    controls = new THREE.OrbitControls(camera);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(winWidth, winHeight);

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

    geometry = new THREE.PlaneBufferGeometry(128, 128, 512, 512);

    material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: mainVert,
      fragmentShader: mainFrag,
      side: THREE.FrontSide,
      wireframe: true,
      transparent: true
    });

    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 10, 0);
    // directional.shadowCameraVisible = true;
    // directional.castShadow = true;
    scene.add(directional);

    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    // ambient.shadowCameraVisible = true;
    // ambient.castShadow = true;
    scene.add(ambient);

    mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -Math.PI * 0.4;
    // mesh.position.y = -100.0;

    scene.add(mesh);

    // ==================================================
    // 　　POST
    // ==================================================

    scene__POST = new THREE.Scene();

    camera__POST = new THREE.PerspectiveCamera(
      CAMERA_PARAMETER.fovy,
      CAMERA_PARAMETER.aspect,
      CAMERA_PARAMETER.near,
      CAMERA_PARAMETER.far
    );
    camera__POST.position.x = CAMERA_PARAMETER.x;
    camera__POST.position.y = CAMERA_PARAMETER.y;
    camera__POST.position.z = CAMERA_PARAMETER.z;
    camera__POST.lookAt(CAMERA_PARAMETER.lookAt);

    renderer__POST = new THREE.WebGLRenderTarget(winWidth, winHeight, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    });
    renderer__POST.setSize(winWidth, winHeight);

    uniforms__POST = {
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
      },
      uTex: {
        type: 't',
        value: renderer__POST.texture,
      }
    };

    // geometry__POST = new THREE.PlaneBufferGeometry(winWidth*0.5, winHeight*0.5);
    // geometry__POST = new THREE.PlaneBufferGeometry(2048, 1024);
    geometry__POST = new THREE.PlaneBufferGeometry(2, 2);

    material__POST = new THREE.ShaderMaterial({
      uniforms: uniforms__POST,
      vertexShader: postVert,
      fragmentShader: postFrag,
      transparent: true,
      // fog: true
      // depthWrite: true,
      // side: THREE.DoubleSide
    });

    mesh__POST = new THREE.Mesh(geometry__POST, material__POST);
    scene__POST.add(mesh__POST);

    // ==================================================
    // 　　INIT
    // ==================================================

    init();

    let count = 0;
    render();

  }, false);

})();
