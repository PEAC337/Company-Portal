import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RESOURCE_CATEGORIES, ResourceCategory } from '../data/resources';
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';

interface DataOrreryProps {
  resources: ResourceCategory[];
  handleLinkClick: (event: React.MouseEvent<HTMLDivElement>, url: string) => void;
}

const ORBIT_CONFIG: { radius: number; category: string }[] = [
  { radius: 6, category: 'Core Infrastructure' },
  { radius: 9, category: 'Collaboration & Comms' },
  { radius: 12, category: 'Development & Design' },
  { radius: 15, category: 'Operations & Compliance' },
  { radius: 18, category: 'Accounts & Services' },
];

const DataOrrery: React.FC<DataOrreryProps> = ({ resources, handleLinkClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    const allLinks = RESOURCE_CATEGORIES.flatMap(category => 
      category.links.map(link => ({...link, category: category.category}))
    );
    const visibleLinkUrls = new Set(resources.flatMap(c => c.links.map(l => l.url)));

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // Post-processing for Bloom Effect
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Central Hub
    const hubGeometry = new THREE.IcosahedronGeometry(2, 1);
    const hubMaterial = new THREE.MeshStandardMaterial({
        color: 0xfacc15, // amber-400
        emissive: 0xfbbf24, // amber-500
        emissiveIntensity: 1,
        metalness: 0.5,
        roughness: 0.3,
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    scene.add(hub);

    // Orbits and Planets
    const planets: THREE.Mesh[] = [];
    ORBIT_CONFIG.forEach(orbitConf => {
      // Orbit path
      const orbitGeometry = new THREE.TorusGeometry(orbitConf.radius, 0.03, 16, 100);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x334155 }); // slate-700
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      // Planets
      const linksInOrbit = allLinks.filter(l => l.category === orbitConf.category);
      linksInOrbit.forEach((link, index) => {
        const angle = (2 * Math.PI / linksInOrbit.length) * index;
        const planetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const planetMaterial = new THREE.MeshStandardMaterial({
            color: 0x94a3b8, // slate-400
            emissive: 0x94a3b8,
            emissiveIntensity: 0.2
        });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.x = orbitConf.radius * Math.cos(angle);
        planet.position.z = orbitConf.radius * Math.sin(angle);
        planet.userData = { ...link, isVisible: visibleLinkUrls.has(link.url) };
        planets.push(planet);
        scene.add(planet);
      });
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersected: THREE.Object3D | null = null;
    
    const onMouseMove = (event: MouseEvent) => {
        if (!currentMount) return;
        const rect = currentMount.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
    };
    
    const onClick = (event: MouseEvent) => {
      if (intersected && intersected.userData.url) {
        handleLinkClick(event as any, intersected.userData.url);
      }
    };

    currentMount.addEventListener('mousemove', onMouseMove);
    currentMount.addEventListener('click', onClick);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      if (isAnimationPaused && !clock.running) {
        requestAnimationFrame(animate);
        return;
      }
      if (isAnimationPaused) {
        clock.stop();
      } else if (!clock.running) {
        clock.start();
      }

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Animate hub
      hub.rotation.y += delta * 0.1;

      // Animate planets
      planets.forEach(planet => {
        const radius = Math.sqrt(planet.position.x ** 2 + planet.position.z ** 2);
        const angularSpeed = 0.5 / Math.sqrt(radius);
        const currentAngle = Math.atan2(planet.position.z, planet.position.x);
        const newAngle = currentAngle + angularSpeed * delta;
        planet.position.x = radius * Math.cos(newAngle);
        planet.position.z = radius * Math.sin(newAngle);

        // Update visibility
        planet.visible = planet.userData.isVisible;
      });

      // Raycasting for hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets);

      if (intersects.length > 0) {
        if (intersected !== intersects[0].object) {
          if (intersected) {
             (intersected as THREE.Mesh).material.emissiveIntensity = 0.2;
          }
          intersected = intersects[0].object;
          (intersected as THREE.Mesh).material.emissiveIntensity = 0.8;
          
          if (tooltipRef.current && intersected.userData.name) {
            tooltipRef.current.style.display = 'block';
            tooltipRef.current.innerHTML = `
              <p class="font-bold text-base">${intersected.userData.name}</p>
              <p class="text-xs text-slate-400 mt-1">${intersected.userData.description}</p>
            `;
          }
        }
        if (tooltipRef.current) {
            const screenPosition = intersected.position.clone().project(camera);
            tooltipRef.current.style.left = `${(screenPosition.x + 1) / 2 * currentMount.clientWidth}px`;
            tooltipRef.current.style.top = `${(-screenPosition.y + 1) / 2 * currentMount.clientHeight}px`;
        }
      } else {
        if (intersected) {
            (intersected as THREE.Mesh).material.emissiveIntensity = 0.2;
        }
        intersected = null;
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'none';
        }
      }

      controls.update();
      composer.render();
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const onResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      currentMount.removeEventListener('mousemove', onMouseMove);
      currentMount.removeEventListener('click', onClick);
      currentMount.removeChild(renderer.domElement);
    };
  }, [isAnimationPaused, resources]); // Rerun effect if resources or pause state change

  return (
    <div className="relative w-full">
      <div ref={mountRef} className="orrery-container"></div>
      <div
        ref={tooltipRef}
        className="absolute z-10 p-3 text-sm text-slate-200 bg-slate-900 border border-slate-700 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+1rem)]"
        style={{ display: 'none' }}
      />
      <button
        onClick={() => setIsAnimationPaused(!isAnimationPaused)}
        className="absolute z-20 top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label={isAnimationPaused ? 'Play animation' : 'Pause animation'}
        title={isAnimationPaused ? 'Play animation' : 'Pause animation'}
      >
        {isAnimationPaused ? <PlayIcon className="h-6 w-6" /> : <PauseIcon className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default DataOrrery;