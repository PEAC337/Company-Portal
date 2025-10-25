import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RESOURCE_CATEGORIES, ResourceCategory, ResourceLink } from '../data/resources';
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { DriveIcon } from './icons/DriveIcon';
import { DocsIcon } from './icons/DocsIcon';
import { SlackIcon } from './icons/SlackIcon';
import { DesignIcon } from './icons/DesignIcon';
import { PolicyIcon } from './icons/PolicyIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { TrainingIcon } from './icons/TrainingIcon';
import { FmcsaIcon } from './icons/FmcsaIcon';
import { UsmobileIcon } from './icons/UsmobileIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

// --- Type Definitions ---
interface PlanetData extends ResourceLink {
  category: string;
  radius: number;
  initialAngle: number;
  instanceId: number;
}

interface HoveredObject {
  data: PlanetData;
  screenPosition: { x: number; y: number };
}

// --- Component Props ---
interface DataOrreryProps {
  resources: ResourceCategory[];
  handleLinkClick: (event: React.MouseEvent<HTMLDivElement>, url: string) => void;
}

// --- Constants ---
const ORBIT_CONFIG: { radius: number; category: string }[] = [
  { radius: 6, category: 'Core Infrastructure' },
  { radius: 9, category: 'Collaboration & Comms' },
  { radius: 12, category: 'Development & Design' },
  { radius: 15, category: 'Operations & Compliance' },
  { radius: 18, category: 'Accounts & Services' },
];

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  drive: DriveIcon,
  docs: DocsIcon,
  slack: SlackIcon,
  design: DesignIcon,
  policy: PolicyIcon,
  calendar: CalendarIcon,
  training: TrainingIcon,
  fmcsa: FmcsaIcon,
  usmobile: UsmobileIcon,
  default: ExternalLinkIcon,
};


// --- Main Component ---
const DataOrrery: React.FC<DataOrreryProps> = ({ resources, handleLinkClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const [hoveredObject, setHoveredObject] = useState<HoveredObject | null>(null);
  
  const hoveredInstanceRef = useRef<{ id: number | null, data: PlanetData | null }>({ id: null, data: null });

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    
    // --- Data Preparation ---
    const allLinks = RESOURCE_CATEGORIES.flatMap(category =>
      category.links.map(link => ({ ...link, category: category.category }))
    );
    const visibleLinkUrls = new Set(resources.flatMap(c => c.links.map(l => l.url)));

    const planetInstanceData: PlanetData[] = allLinks.map((link, index) => {
      const orbitConf = ORBIT_CONFIG.find(o => o.category === link.category)!;
      const linksInOrbit = allLinks.filter(l => l.category === link.category);
      const linkIndex = linksInOrbit.findIndex(l => l.url === link.url);
      const angle = (2 * Math.PI / linksInOrbit.length) * linkIndex;
      return {
        ...link,
        radius: orbitConf.radius,
        initialAngle: angle,
        instanceId: index
      };
    });

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // --- Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 10;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;

    // --- Post-processing (Bloom) ---
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.0, 0.4, 0.85);
    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // --- Central Hub ---
    const hub = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 1),
      new THREE.MeshStandardMaterial({
        color: 0xfacc15, emissive: 0xfbbf24, emissiveIntensity: 1, metalness: 0.5, roughness: 0.3,
      })
    );
    scene.add(hub);

    // --- Orbits and Planets (Instanced) ---
    ORBIT_CONFIG.forEach(orbitConf => {
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(orbitConf.radius, 0.03, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x334155 })
      );
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    });
    
    const planetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true });
    const planets = new THREE.InstancedMesh(planetGeometry, planetMaterial, planetInstanceData.length);
    planets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    if (planets.instanceColor) {
      planets.instanceColor.setUsage(THREE.DynamicDrawUsage);
    }
    scene.add(planets);

    const matrix = new THREE.Matrix4();
    const defaultColor = new THREE.Color(0x94a3b8);
    const hoverColor = new THREE.Color(0xfacc15);

    planetInstanceData.forEach((data) => {
      matrix.setPosition(data.radius * Math.cos(data.initialAngle), 0, data.radius * Math.sin(data.initialAngle));
      planets.setMatrixAt(data.instanceId, matrix);
      planets.setColorAt(data.instanceId, defaultColor);
    });

    // --- Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
    };
    
    const onClick = (event: MouseEvent) => {
      if (hoveredInstanceRef.current.data) {
        handleLinkClick(event as any, hoveredInstanceRef.current.data.url);
      }
    };

    currentMount.addEventListener('mousemove', onMouseMove);
    currentMount.addEventListener('click', onClick);

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAnimationPaused) {
        if (clock.running) clock.stop();
      } else {
        if (!clock.running) clock.start();
      }

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      hub.rotation.y += delta * 0.1;

      // Update Instances
      planetInstanceData.forEach((data) => {
        if (!visibleLinkUrls.has(data.url)) {
          matrix.makeScale(0, 0, 0); // Hide by scaling to zero
        } else {
          const angularSpeed = 0.5 / Math.sqrt(data.radius);
          const newAngle = data.initialAngle + angularSpeed * elapsedTime;
          matrix.makeTranslation(
            data.radius * Math.cos(newAngle),
            0,
            data.radius * Math.sin(newAngle)
          );
        }
        planets.setMatrixAt(data.instanceId, matrix);
      });
      planets.instanceMatrix.needsUpdate = true;
      
      // Raycasting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(planets);

      if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
        const instanceId = intersects[0].instanceId;
        if (hoveredInstanceRef.current.id !== instanceId) {
          if (hoveredInstanceRef.current.id !== null) {
            planets.setColorAt(hoveredInstanceRef.current.id, defaultColor);
          }
          hoveredInstanceRef.current = { id: instanceId, data: planetInstanceData[instanceId] };
          planets.setColorAt(instanceId, hoverColor);
          if (planets.instanceColor) {
            planets.instanceColor.needsUpdate = true;
          }

          const screenPosition = intersects[0].point.clone().project(camera);
          setHoveredObject({
            data: planetInstanceData[instanceId],
            screenPosition: {
              x: (screenPosition.x + 1) / 2 * currentMount.clientWidth,
              y: (-screenPosition.y + 1) / 2 * currentMount.clientHeight,
            }
          });
        }
      } else {
        if (hoveredInstanceRef.current.id !== null) {
          planets.setColorAt(hoveredInstanceRef.current.id, defaultColor);
          if (planets.instanceColor) {
            planets.instanceColor.needsUpdate = true;
          }
          hoveredInstanceRef.current = { id: null, data: null };
          setHoveredObject(null);
        }
      }

      controls.update();
      composer.render();
    };

    animate();

    // --- Cleanup ---
    const onResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      currentMount.removeEventListener('mousemove', onMouseMove);
      currentMount.removeEventListener('click', onClick);
      if (renderer.domElement.parentElement === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      // Dispose of Three.js objects
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [isAnimationPaused, resources]);

  const IconComponent = hoveredObject ? iconMap[hoveredObject.data.icon || 'default'] : null;

  return (
    <div className="relative w-full">
      <div ref={mountRef} className="orrery-container"></div>
      
      {/* Tooltip */}
      {hoveredObject && IconComponent && (
        <div
          className="absolute z-10 p-3 text-sm text-slate-200 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+1rem)] transition-opacity duration-200 w-64"
          style={{
            left: hoveredObject.screenPosition.x,
            top: hoveredObject.screenPosition.y,
            opacity: 1,
          }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 pt-1">
              <IconComponent className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-base text-slate-100">{hoveredObject.data.name}</p>
              <p className="text-xs text-amber-500 font-semibold mb-1">{hoveredObject.data.category}</p>
              <p className="text-xs text-slate-400">{hoveredObject.data.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
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