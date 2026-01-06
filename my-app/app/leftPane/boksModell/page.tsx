'use client';

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Mesh,
  MeshNormalMaterial,
} from "three";

import FmeaFamilyKortLeftPane from "./components/fmeaFamilyKortLeftPane/page";
import styles from "./boksModell.module.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

interface ViewerState {
  scene: Scene | null;
  camera: PerspectiveCamera | null;
  renderer: WebGLRenderer | null;
  controls: OrbitControls | null; 
}

export default function BoksModell() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [{ scene, camera, renderer, controls }, setViewer] = useState<ViewerState>(
    { scene: null, camera: null, renderer: null, controls: null }
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      renderer?.dispose();
      controls?.dispose();
    };
  }, [renderer, controls]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".stl")) {
      setError("Only STL files are supported");
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const contents = loadEvent.target?.result;
      if (!(contents instanceof ArrayBuffer)) {
        setError("Failed to read file contents");
        return;
      }

      const container = mountRef.current;
      if (!container) {
        return;
      }

      renderer?.dispose();
      controls?.dispose();
      container.innerHTML = "";

      const loader = new STLLoader();
      const geometry = loader.parse(contents);
      const material = new MeshNormalMaterial();
      const mesh = new Mesh(geometry, material);
      mesh.scale.setScalar(0.1);

      const newScene = new Scene();
      const newCamera = new PerspectiveCamera(60, 1, 0.1, 1000);
      const newRenderer = new WebGLRenderer({ antialias: true });
      newRenderer.setSize(container.clientWidth, container.clientWidth);
      container.appendChild(newRenderer.domElement);

      newCamera.position.set(0, 0, 5);
      newScene.add(mesh);

      const newControls = new OrbitControls(newCamera, newRenderer.domElement);
      newControls.enableDamping = true;
      newControls.dampingFactor = 0.1;

      const animate = () => {
        newControls.update();
        newRenderer.render(newScene, newCamera);
        requestAnimationFrame(animate);
      };

      animate();

      setViewer({
        scene: newScene,
        camera: newCamera,
        renderer: newRenderer,
        controls: newControls,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleClear = () => {
    if (scene && renderer && mountRef.current) {
      scene.clear();
      renderer.dispose();
      mountRef.current.innerHTML = "";
      controls?.dispose();
      setViewer({ scene: null, camera: null, renderer: null, controls: null });
    }
  };

  return (
    <div className={styles.container}>
      <div ref={mountRef} className={styles.viewer}>
        {!renderer ? <span className={styles.hint}>Upload an STL model</span> : null}
      </div>
      <div className={styles.controls}>
        <input
          type="file"
          accept=".stl"
          onChange={handleFileUpload}
          className={styles.fileInput}
        />
        <div className={styles.buttonRow}>
          <button className={styles.button} type="button" onClick={handleClear}>
            Clear model
          </button>
        </div>
        {error ? <span className={styles.hint}>{error}</span> : null}
      </div>
      <FmeaFamilyKortLeftPane />
    </div>
  );
}
