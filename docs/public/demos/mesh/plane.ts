import { Engine3D, Scene3D, Object3D, Camera3D, AtmosphericComponent, View3D, LitMaterial, PlaneGeometry, MeshRenderer, DirectLight, HoverCameraController, Color, Vector3, GPUCullMode } from '@orillusion/core';
await Engine3D.init();
let scene3D: Scene3D = new Scene3D();
let cameraObj: Object3D = new Object3D();
let camera = cameraObj.addComponent(Camera3D);
camera.perspective(60, Engine3D.aspect, 1, 5000.0);
let controller = camera.object3D.addComponent(HoverCameraController);
controller.setCamera(0, -15, 80);
scene3D.addChild(cameraObj);

let light: Object3D = new Object3D();
let component: DirectLight = light.addComponent(DirectLight);
light.rotationX = 45;
light.rotationY = 30;
component.lightColor = new Color(1.0, 1.0, 1.0, 1.0);
component.intensity = 1;
scene3D.addChild(light);

// create a object
const obj: Object3D = new Object3D();
// add MeshRenderer to the object
let mr: MeshRenderer = obj.addComponent(MeshRenderer);
// set a plane geometry
mr.geometry = new PlaneGeometry(20, 20);
// set a pbr lit material
mr.material = new LitMaterial();
// render double side
mr.material.cullMode = GPUCullMode.none;
// set location and rotation
obj.localPosition = new Vector3(0, 0, 0);
obj.localRotation = new Vector3(0, 45, 0);
scene3D.addChild(obj);

// add an Atmospheric sky enviroment
scene3D.addComponent(AtmosphericComponent).sunY = 0.6;
// create a view with target scene and camera
let view = new View3D();
view.scene = scene3D;
view.camera = camera;
// start render
Engine3D.startRenderView(view);
