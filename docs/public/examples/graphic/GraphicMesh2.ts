import { Object3D, Scene3D, Engine3D, AtmosphericComponent, CameraUtil, HoverCameraController, View3D, MeshRenderer, UnLitTexArrayMaterial, BitmapTexture2DArray, Vector3, Matrix4, Time, Color, BlendMode } from "@orillusion/core";
import { Stats } from "@orillusion/stats";
import { Graphic3DMesh } from "@orillusion/graphic";

class GraphicMesh2 {
    scene: Scene3D;
    parts: Object3D[];
    width: number;
    height: number;
    cafe: number = 120;
    constructor() { }

    async run() {

        Matrix4.maxCount = 500000;
        Matrix4.allocCount = 500000;

        await Engine3D.init({ beforeRender: () => this.update() });

        this.scene = new Scene3D();
        this.scene.addComponent(Stats);
        let sky = this.scene.addComponent(AtmosphericComponent);
        sky.enable = false;
        let camera = CameraUtil.createCamera3DObject(this.scene);
        camera.perspective(60, Engine3D.aspect, 1, 5000.0);

        camera.object3D.addComponent(HoverCameraController).setCamera(30, 0, 250);

        let view = new View3D();
        view.scene = this.scene;
        view.camera = camera;

        Engine3D.startRenderView(view);
        await this.initScene();
    }

    async initScene() {
        let texts:any[] = [];
        let node = await Engine3D.res.loadGltf("https://cdn.orillusion.com/PBR/Duck/Duck.gltf") as Object3D;
        let geo = node.getComponents(MeshRenderer)[0].geometry;

        texts.push(Engine3D.res.yellowTexture);
        let bitmapTexture2DArray = new BitmapTexture2DArray(texts[0].width, texts[0].height, texts.length);
        bitmapTexture2DArray.setTextures(texts);

        let mat = new UnLitTexArrayMaterial();
        mat.baseMap = bitmapTexture2DArray;
        mat.name = "LitMaterial";

        {
            this.width = 100;
            this.height = 20;
            let mr = Graphic3DMesh.draw(this.scene, geo, bitmapTexture2DArray, this.width * this.height);            
            this.parts = mr.object3Ds;

            for (let i = 0; i < this.width * this.height; i++) {
                const element = this.parts[i];
                mr.setTextureID(i, 0);

                let size = Math.random();
                element.transform.scaleX = size;
                element.transform.scaleY = size;
                element.transform.scaleZ = size;
            }
        }
    }

    update() {
        if (this.parts) {
            for (let i = 0; i < this.parts.length; i++) {
                const element = this.parts[i];

                let tmp = this.sphericalFibonacci(i, this.parts.length);
                let r = this.cafe;
                tmp.scaleBy(r);

                let tr = Math.sin(i * Time.frame * 0.00001) * 0.05;
                element.transform.scaleX = tr;
                element.transform.scaleY = tr;
                element.transform.scaleZ = tr;

                element.transform.localPosition = tmp;
            }
        }
    }
    public madfrac(A: number, B: number): number {
        return A * B - Math.floor(A * B);
    }

    public sphericalFibonacci(i: number, n: number): Vector3 {
        const PHI = Math.sqrt(5.0) * 0.5 + 0.5;
        let phi = 2.0 * Math.PI * this.madfrac(i, PHI - 1);
        let cosTheta = 1.0 - (2.0 * i + 1.0) * (1.0 / n);
        let sinTheta = Math.sqrt(Math.max(Math.min(1.0 - cosTheta * cosTheta, 1.0), 0.0));

        return new Vector3(
            Math.cos(phi) * sinTheta,
            Math.sin(phi) * sinTheta,
            cosTheta);

    }
}

new GraphicMesh2().run()