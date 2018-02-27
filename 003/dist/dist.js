(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var myVert = require('./../shader/sample.vert');
var myFrag = require('./../shader/sample.frag');

var notWebGL = function notWebGL() {
  // webGL非対応時の記述
  console.log('this browser does not support webGL');
};

if (document.getElementsByTagName('html')[0].classList.contains('no-webgl')) {
  notWebGL();
}

// three.jsのとき
try {
  var renderer = new THREE.WebGLRenderer();
} catch (e) {
  notWebGL();
}

// 返ってくる値を確認してみましょう！
console.log(ubu.detect);
// IEの時
if (ubu.detect.browser.ie) {
  console.log('IEさん、動画テクスチャはちょっと…無理ですね…');
}

window.onload = function () {
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  // rendererの作成
  var renderer = new THREE.WebGLRenderer();
  // canvasをbodyに追加
  document.body.appendChild(renderer.domElement);

  // canvasをリサイズ（学習用なのでリサイズイベント登録は省略）
  renderer.setSize(windowWidth, windowHeight);

  // scene作成
  var scene = new THREE.Scene();
  // camera作成
  var camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
  camera.position.z = 100;

  // Geometry作成
  var geometry = new THREE.PlaneBufferGeometry(100, 100);
  // Material作成
  var material = new THREE.ShaderMaterial({
    vertexShader: myVert,
    fragmentShader: myFrag
  });
  // Mesh作成
  var mesh = new THREE.Mesh(geometry, material);

  // Meshをシーンに追加
  scene.add(mesh);

  // draw
  renderer.render(scene, camera);
};

},{"./../shader/sample.frag":2,"./../shader/sample.vert":3}],2:[function(require,module,exports){
module.exports = "precision mediump float;\nvarying vec2 vUv;\n\nvoid main(){\n  // テクスチャ座標をカラーに出力\n  gl_FragColor = vec4(vUv, 0.0, 1.0);\n}\n";

},{}],3:[function(require,module,exports){
module.exports = "varying vec2 vUv;\n\nvoid main() {\n  //uv => テクスチャを貼るためのUV座標\n  vUv = uv;\n  //projectionMatrix => カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列\n  //modelViewMatrix => modelMatrix(オブジェクト座標からワールド座標へ変換する行列)とviewMatrix(ワールド座標から視点座標へ変換する行列)の積算\n  //position => 頂点座標\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n";

},{}]},{},[1]);
