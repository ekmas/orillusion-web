import { Engine3D, Scene3D, Object3D, Camera3D, Vector3, HoverCameraController, ForwardRenderJob, LitMaterial, BoxGeometry, MeshRenderer } from "@orillusion/core";

async function demo() {
    //初始化引擎
    await Engine3D.init();
    // 新建场景根节点
    let scene: Scene3D = new Scene3D();

    let cameraObj = new Object3D();
    let camera = cameraObj.addComponent(Camera3D);
    camera.perspective(60, window.innerWidth / window.innerHeight, 0.1, 5000.0);
    let hoverController = cameraObj.addComponent(HoverCameraController);
    hoverController.setCamera(15, -15, 15, new Vector3(0, 0, 0));
    scene.addChild(cameraObj);

    const boxObj: Object3D = new Object3D();
    boxObj.localPosition = new Vector3(0, 0, 0);

    // 为对象添 MeshRenderer
    let mr: MeshRenderer = boxObj.addComponent(MeshRenderer);
    // 设置几何体
    mr.geometry = new BoxGeometry(5, 5, 5);
    // 设置材质
    mr.material = new LitMaterial();

    scene.addChild(boxObj);

    // 新建前向渲染业务
    let renderJob: ForwardRenderJob = new ForwardRenderJob(scene);
    // 开始渲染
    Engine3D.startRender(renderJob);

}

demo();

