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
    const mainFrag__WIRE = require('./../_shader/main_wire.frag');
    const mainFrag__OBJ = require('./../_shader/main_obj.frag');
    const postVert = require('./../_shader/post.vert');
    const postFrag = require('./../_shader/post.frag');
    const Perlin = require('./../js/lib/perlin.js').Perlin;

    let renderer;
    let scene;
    let camera;

    let uniforms__WIRE;
    let uniforms__OBJ;

    let geometry__WIRE;
    let geometry__OBJ;

    let material__WIRE;
    let material__OBJ;

    let directional;
    let ambient;

    let wire;
    let obj;

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

      uniforms__WIRE.mouse.value.x = e.pageX;
      uniforms__WIRE.mouse.value.y = e.pageY;
      uniforms__OBJ.mouse.value.x = e.pageX;
      uniforms__OBJ.mouse.value.y = e.pageY;
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

      uniforms__WIRE.resolution.value.x = renderer.domElement.width;
      uniforms__WIRE.resolution.value.y = renderer.domElement.height;
      uniforms__OBJ.resolution.value.x = renderer.domElement.width;
      uniforms__OBJ.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;

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
      uniforms__WIRE.resolution.value.x = renderer.domElement.width;
      uniforms__WIRE.resolution.value.y = renderer.domElement.height;
      uniforms__OBJ.resolution.value.x = renderer.domElement.width;
      uniforms__OBJ.resolution.value.y = renderer.domElement.height;
      uniforms__POST.resolution.value.x = renderer.domElement.width;
      uniforms__POST.resolution.value.y = renderer.domElement.height;
    }

    // ==================================================
    // 　　RENDER
    // ==================================================

    let render = () => {
      count++;

      // scene.rotation.y = -count * 0.001;

      uniforms__WIRE.time.value += 0.05;
      uniforms__OBJ.time.value += 0.05;
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
      z: 100.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0)
    };

    let RENDERER_PARAMETER = {
      clearColor: 0xffffff,
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

    uniforms__WIRE = {
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

    uniforms__OBJ = {
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

    // geometry = new THREE.SphereGeometry(100, 100, 100);
    // geometry = new THREE.PlaneBufferGeometry(2048, 1024, 32, 16);
    // geometry = new THREE.PlaneBufferGeometry(winWidth*2.0, winHeight, winWidth*0.02*2.0, winHeight*0.02);

    // geometry = new THREE.PlaneBufferGeometry(1024, 1024, 256, 256);
    geometry__WIRE = new THREE.PlaneBufferGeometry(1024, 1024, 1024, 1024);
    geometry__OBJ = new THREE.PlaneBufferGeometry(1024, 1024, 1024, 1024);

    // geometry = new THREE.BufferGeometry();
    // let vertexPositions = [];
    // let width = 2.0;
    // let half = width / 2.0;
    // let interval = 0.2;
    // let points = width / interval;
    // for(var i = 0; i <= points; ++i){
    //   let x = -half + i * interval;
    //   for(var j = 0; j <= points; ++j){
    //     let y = -half + j * interval;
    //     vertexPositions.push([x, y, 0.0]);
    //   }
    // }
    // let vertices = new Float32Array(vertexPositions.length * 3);
    // for (var i = 0; i < vertexPositions.length; i++) {
    //   vertices[i * 3 + 0] = vertexPositions[i][0];
    //   vertices[i * 3 + 1] = vertexPositions[i][1];
    //   vertices[i * 3 + 2] = vertexPositions[i][2];
    // }
    // geometry.addAttribute('u_position',
    //   new THREE.BufferAttribute(vertices, 3)
    // );

    // let vertexIndices = [];
    // for (var i = 0; i < 6 * 18; i++) {
    //   if(
    //     i != 10 &&
    //     i != 21 &&
    //     i != 32 &&
    //     i != 43 &&
    //     i != 54 &&
    //     i != 65 &&
    //     i != 76 &&
    //     i != 87 &&
    //     i != 98
    //   ) {
    //     if(i < 107) {
    //       vertexIndices.push(
    //         i,  1 + i, 12 + i,
    //         i, 11 + i, 12 + i
    //       );
    //     } else {
    //       vertexIndices.push(
    //         i,  1 + i, 12 + i,
    //         i, 11 + i, 12 + i,
    //         1 + i,  2 + i, 13 + i,
    //         1 + i, 12 + i, 13 + i
    //       );
    //     }
    //   }
    // }

    // let indices = new Uint16Array(vertexIndices);

    // geometry.addAttribute('u_position',
    //   new THREE.BufferAttribute(geometry.attributes.position.array, 3)
    // );

    // geometry.addAttribute('index',
    //   new THREE.BufferAttribute(indices, 1)
    // );

    // ==================================================
    // 　　MATERIAL
    // ==================================================

    // material = new THREE.MeshLambertMaterial({
    //   color: 0xff0000,
    //   side: THREE.DoubleSide
    // });

    // material__OBJ = new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   side: THREE.DoubleSide
    // });

    // let phongShader = THREE.ShaderLib.phong;
    // material = new THREE.ShaderMaterial({
    //   uniforms: THREE.UniformsUtils.clone(phongShader.uniforms),
    //   vertexShader: phongShader.vertexShader,
    //   fragmentShader: phongShader.fragmentShader,
    //   lights: true,
    //   fog: true
    // });

    material__WIRE = new THREE.ShaderMaterial({
      uniforms: uniforms__WIRE,
      vertexShader: mainVert,
      fragmentShader: mainFrag__WIRE,
      transparent: true,
      wireframe: true,
      depthWrite: true,
      // fog: true,
      side: THREE.DoubleSide
    });

    material__OBJ = new THREE.ShaderMaterial({
      uniforms: uniforms__OBJ,
      vertexShader: mainVert,
      fragmentShader: mainFrag__OBJ,
      transparent: true,
      // wireframe: true,
      depthWrite: true,
      // fog: true,
      side: THREE.DoubleSide
    });

    // ==================================================
    // 　　LIGHT
    // ==================================================

    directional = new THREE.DirectionalLight(0xffffff);
    directional.position.set(0, 10, 0);
    // directional.shadowCameraVisible = true;
    // directional.castShadow = true;
    scene.add(directional);

    ambient = new THREE.AmbientLight(0xffffff, 0.2);
    // ambient.shadowCameraVisible = true;
    // ambient.castShadow = true;
    scene.add(ambient);

    // ==================================================
    // 　　MESH / GROUP
    // ==================================================

    wire = new THREE.Mesh(geometry__WIRE, material__WIRE);
    obj = new THREE.Mesh(geometry__OBJ, material__OBJ);

    // mesh.castShadow = true;
    // mesh.rotation.x = -1.0;

    // ===== perlin noise on javascript
    // let perlin = new Perlin();
    // let peak = 60;
    // let smoothing = 300;
    // let vertices = mesh.geometry.attributes.position.array;
    // for (var i = 0; i <= vertices.length; i += 3) {
    //   vertices[i+2] = peak * perlin.noise(
    //     (mesh.position.x + vertices[i] * (Math.random() * (1.0 - 0.98) + 0.98)) / (smoothing),
    //     (mesh.position.z + vertices[i+1] * (Math.random() * (1.0 - 0.98) + 0.98)) / (smoothing)
    //   );
    // }
    // mesh.geometry.attributes.position.needsUpdate = true;
    // mesh.geometry.computeVertexNormals();
    //
    // //
    // geometry.addAttribute('m_position',
    //   new THREE.BufferAttribute(vertices, 3)
    // );

    // mesh.position.y = -300.0;
    // mesh.position.z = -500.0;
    // mesh.rotation.x = -Math.PI*0.25;
    wire.rotation.x = -Math.PI*0.4;
    wire.rotation.z = -Math.PI;
    wire.position.y = -250.0;

    obj.rotation.x = -Math.PI*0.4;
    obj.rotation.z = -Math.PI;
    obj.position.y = -250.0;

    // group = new THREE.Group();
    // group.add(mesh);

    scene.add(wire);
    scene.add(obj);

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
