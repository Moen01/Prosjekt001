'use client';
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './boksModell.css';

export default function BoksModell() {
    const mountRef = useRef(null);
    const [scene, setScene] = useState(null);
    const [renderer, setRenderer] = useState(null);
    const [camera, setCamera] = useState(null);
    const [controls, setControls] = useState(null);
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [isRaycasterActive, setIsRaycasterActive] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [currentMarker, setCurrentMarker] = useState(null);

    useEffect(() => {
        const handleMouseClick = (event) => {
            if (!scene || !renderer || !camera || !isRaycasterActive) return;

            const rect = renderer.domElement.getBoundingClientRect();
            const mouse = new THREE.Vector2(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            );

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                const intersect = intersects[0];
                const markerGeometry = new THREE.SphereGeometry(0.05, 32, 32);
                const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                marker.position.copy(intersect.point);
                scene.add(marker);

                setCurrentMarker(marker);
                setIsRaycasterActive(false);
            }
        };

        if (renderer) {
            renderer.domElement.addEventListener('click', handleMouseClick);
        }

        return () => {
            if (renderer) {
                renderer.domElement.removeEventListener('click', handleMouseClick);
            }
        };
    }, [scene, renderer, camera, isRaycasterActive]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const contents = e.target.result;
                if (file.name.endsWith('.stl')) {
                    const loader = new STLLoader();
                    const geometry = loader.parse(contents);
                    const material = new THREE.MeshNormalMaterial();
                    const mesh = new THREE.Mesh(geometry, material);

                    // Scale down the mesh
                    mesh.scale.set(0.1, 0.1, 0.1);

                    const newScene = new THREE.Scene();
                    const newCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
                    const newRenderer = new THREE.WebGLRenderer({ antialias: true });

                    newRenderer.setSize(300, 300); // Adjust size as needed
                    newRenderer.setClearColor(0xffffff); // Set background color to white
                    mountRef.current.appendChild(newRenderer.domElement);

                    newCamera.position.z = 5;
                    newScene.add(mesh);

                    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
                    newControls.enableDamping = true;
                    newControls.dampingFactor = 0.25;
                    newControls.enableZoom = true;

                    const animate = () => {
                        requestAnimationFrame(animate);
                        newControls.update();
                        newRenderer.render(newScene, newCamera);
                    };

                    animate();

                    setScene(newScene);
                    setRenderer(newRenderer);
                    setCamera(newCamera);
                    setControls(newControls);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleRemoveImage = () => {
        if (scene && renderer) {
            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }
            renderer.dispose();
            setScene(null);
            setRenderer(null);
            setCamera(null);
            setControls(null);
            mountRef.current.innerHTML = ''; // Clear the renderer DOM element
        }
    };

    const handleActivateRaycaster = () => {
        setIsRaycasterActive(true);
    };

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleSaveComment = () => {
        if (currentMarker && commentText) {
            setComments([...comments, { position: currentMarker.position, comment: commentText }]);
            setCommentText('');
            setCurrentMarker(null);
        }
    };

    return (
        <div className="left-pane">
            <div className="upload-box">
                <input type="file" accept=".stl" onChange={handleFileUpload} />
                <button onClick={handleRemoveImage} disabled={!scene}>Remove Image</button>
                <button onClick={handleActivateRaycaster} disabled={!scene}>Mark Spot</button>
                <input
                    type="text"
                    value={commentText}
                    onChange={handleCommentChange}
                    placeholder="Enter comment"
                    disabled={!currentMarker}
                />
                <button onClick={handleSaveComment} disabled={!currentMarker || !commentText}>Save Comment</button>
            </div>
            <div ref={mountRef} className="stl-viewer"></div>
            <div className="comments">
                {comments.map((comment, index) => (
                    <div key={index} onClick={() => setSelectedComment(comment)}>
                        Comment at ({comment.position.x.toFixed(2)}, {comment.position.y.toFixed(2)}, {comment.position.z.toFixed(2)}): {comment.comment}
                    </div>
                ))}
            </div>
            {selectedComment && (
                <div className="selected-comment">
                    <h3>Selected Comment</h3>
                    <p>Position: ({selectedComment.position.x.toFixed(2)}, {selectedComment.position.y.toFixed(2)}, {selectedComment.position.z.toFixed(2)})</p>
                    <p>Comment: {selectedComment.comment}</p>
                </div>
            )}
        </div>
    );
}