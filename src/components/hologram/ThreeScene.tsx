
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  rotationSpeed?: number;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ rotationSpeed = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene, camera and renderer
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ccff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create hologram effect objects
    const torusGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00ccff, 
      transparent: true, 
      opacity: 0.7,
      wireframe: true
    });
    
    const torus1 = new THREE.Mesh(torusGeometry, torusMaterial);
    const torus2 = new THREE.Mesh(torusGeometry, torusMaterial);
    torus2.rotation.x = Math.PI / 2;
    
    scene.add(torus1);
    scene.add(torus2);
    
    // Create central holographic sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.3,
      wireframe: false
    });
    
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Create a rotating wireframe cube
    const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    
    // Create particle system for holographic effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const positionArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ccff,
      transparent: true,
      opacity: 0.8
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Text indicator - create a texture with text
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = 'rgba(0, 0, 0, 0)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.font = '32px Arial';
      context.fillStyle = '#00ccff';
      context.textAlign = 'center';
      context.fillText('JARVIS', canvas.width/2, canvas.height/2);
    }
    
    const textTexture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.SpriteMaterial({ 
      map: textTexture, 
      transparent: true 
    });
    const textSprite = new THREE.Sprite(textMaterial);
    textSprite.position.y = 2.5;
    textSprite.scale.set(2, 1, 1);
    scene.add(textSprite);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate objects for holographic effect - now with rotationSpeed
      const speedFactor = rotationSpeed;
      
      torus1.rotation.x += 0.01 * speedFactor;
      torus1.rotation.y += 0.005 * speedFactor;
      
      torus2.rotation.y += 0.01 * speedFactor;
      torus2.rotation.z += 0.005 * speedFactor;
      
      cube.rotation.x += 0.003 * speedFactor;
      cube.rotation.y += 0.003 * speedFactor;
      
      sphere.rotation.y += 0.01 * speedFactor;
      
      particles.rotation.y += 0.001 * speedFactor;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of geometries and materials
      torusGeometry.dispose();
      torusMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [rotationSpeed]);
  
  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default ThreeScene;
