// インポート文がマスト
import * as THREE from "./build/three.module.js";

//マウスで拡大・縮小したりできるようにするやつ
import { OrbitControls } from "./jsm/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);

function init() {
  // シーンの構築
  scene = new THREE.Scene();

  // カメラを追加

  // パースペクティブカメラとは？
  // 視野角、アスペクト比、開始距離、終了距離）
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //カメラを移動
  camera.position.set(0, 0, +500);

  // レンダラーを追加

  renderer = new THREE.WebGLRenderer({ alpha: true });

  // テクスチャーの解像度を適切に設定する
  renderer.setPixelRatio(window.devicePixelRatio);

  document.body.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);

  //テクスチャを追加してみよう
  let textures = new THREE.TextureLoader().load("./textures/earth.jpg");

  // ジオメトリを作成
  // 100は、ラディアスのことで球体の半径を指している
  // 64は、widthSegmentのことでポリゴンの数
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32);
  //マテリアルを作成
  let ballMaterial = new THREE.MeshPhysicalMaterial({
    map: textures,
  });
  //メッシュ化してみよう
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  //シーンに追加
  scene.add(ballMesh);

  //平行光源を追加してみよう
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  //光源の位置を変更
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  //ポイントライトを追加してみよう
  pointLight = new THREE.PointLight(0xfffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  pointLight.decay = 1;
  pointLight.power = 1000;

  //ポイント光源がどこにあるかを特定する
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  //マウス操作ができるようにしよう
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  animate();
}

// ブラウザのリサイズに対応させよう
function onWindowResize() {
  //レンダラーのサイズを随時更新
  renderer.setSize(window.innerWidth, window.innerHeight);

  //カメラのアスペクト比を正す。
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

//ポイント光源を急の周りで巡回させよう
function animate() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );
  //レンダリングしてみよう
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}
