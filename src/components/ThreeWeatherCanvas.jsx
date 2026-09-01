import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeWeatherCanvas({ themeName }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2500);
    camera.position.set(0, 0, 450);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
    dirLight.position.set(100, 200, 200);
    scene.add(dirLight);
    const lightningLight = new THREE.PointLight(0xa5b4fc, 0, 1500, 1.5);
    lightningLight.position.set(0, 300, 100);
    scene.add(lightningLight);
    const envGroup = new THREE.Group();
    scene.add(envGroup);
    const objects = {
      sun: null,
      moon: null,
      stars: null,
      rain: null,
      snow: null,
      clouds: null,
      lightningLight
    };
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      isMobile = w < 768;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    function clearEnvironment() {
      while (envGroup.children.length > 0) {
        const obj = envGroup.children[0];
        envGroup.remove(obj);
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
      objects.sun = null;
      objects.moon = null;
      objects.stars = null;
      objects.rain = null;
      objects.snow = null;
      objects.clouds = null;
      lightningLight.intensity = 0;
    }
    function buildSunny() {
      const sunGroup = new THREE.Group();
      sunGroup.position.set(isMobile ? 80 : 180, isMobile ? 120 : 150, -100);
      const sunGeo = new THREE.SphereGeometry(38, 32, 32);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.95 });
      const sunCore = new THREE.Mesh(sunGeo, sunMat);
      sunGroup.add(sunCore);
      const haloGeo1 = new THREE.RingGeometry(38, 70, 32);
      const haloMat1 = new THREE.MeshBasicMaterial({ color: 0xffa500, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
      const halo1 = new THREE.Mesh(haloGeo1, haloMat1);
      sunGroup.add(halo1);
      const haloGeo2 = new THREE.RingGeometry(68, 120, 32);
      const haloMat2 = new THREE.MeshBasicMaterial({ color: 0xff8c00, side: THREE.DoubleSide, transparent: true, opacity: 0.15 });
      const halo2 = new THREE.Mesh(haloGeo2, haloMat2);
      sunGroup.add(halo2);
      envGroup.add(sunGroup);
      objects.sun = { group: sunGroup, halo1, halo2 };
      const moteCount = isMobile ? 70 : 160;
      const moteGeo = new THREE.BufferGeometry();
      const motePositions = new Float32Array(moteCount * 3);
      for (let i = 0; i < moteCount; i++) {
        motePositions[i * 3] = (Math.random() - 0.5) * 800;
        motePositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
        motePositions[i * 3 + 2] = (Math.random() - 0.5) * 500;
      }
      moteGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
      const moteMat = new THREE.PointsMaterial({ color: 0xfff3b0, size: 3.5, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
      const motes = new THREE.Points(moteGeo, moteMat);
      envGroup.add(motes);
      objects.sun.motes = motes;
    }

    function buildNight() {
      // 3D Moon
      const moonGroup = new THREE.Group();
      moonGroup.position.set(isMobile ? 80 : 180, isMobile ? 120 : 140, -120);

      const moonGeo = new THREE.SphereGeometry(34, 32, 32);
      const moonCanvas = document.createElement('canvas');
      moonCanvas.width = 256;
      moonCanvas.height = 256;
      const mCtx = moonCanvas.getContext('2d');
      mCtx.fillStyle = '#E2E8F0';
      mCtx.fillRect(0, 0, 256, 256);
      mCtx.fillStyle = '#CBD5E1';
      for (let i = 0; i < 20; i++) {
        const rx = Math.random() * 256;
        const ry = Math.random() * 256;
        const rr = Math.random() * 16 + 4;
        mCtx.beginPath();
        mCtx.arc(rx, ry, rr, 0, Math.PI * 2);
        mCtx.fill();
      }
      const moonTexture = new THREE.CanvasTexture(moonCanvas);
      const moonMat = new THREE.MeshStandardMaterial({ map: moonTexture, roughness: 0.8, emissive: 0xdbeafe, emissiveIntensity: 0.25 });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      moonGroup.add(moon);

      const moonGlowGeo = new THREE.RingGeometry(34, 65, 32);
      const moonGlowMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, side: THREE.DoubleSide, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending });
      const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
      moonGroup.add(moonGlow);

      envGroup.add(moonGroup);
      objects.moon = { group: moonGroup, mesh: moon };

      // Stars
      const starCount = isMobile ? 700 : 1800;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 1600;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 1200;
        starPos[i * 3 + 2] = -Math.random() * 1000 + 100;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending });
      const stars = new THREE.Points(starGeo, starMat);
      envGroup.add(stars);
      objects.stars = stars;
    }

    function buildRain(isThunder = false) {
      const dropCount = isMobile ? (isThunder ? 1000 : 700) : (isThunder ? 2200 : 1500);
      const rainGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(dropCount * 6);
      const dropLength = isThunder ? 32 : 22;

      for (let i = 0; i < dropCount; i++) {
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 800;
        const z = (Math.random() - 0.5) * 600;

        positions[i * 6] = x;
        positions[i * 6 + 1] = y;
        positions[i * 6 + 2] = z;
        positions[i * 6 + 3] = x - 3;
        positions[i * 6 + 4] = y - dropLength;
        positions[i * 6 + 5] = z;
      }

      rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const rainMat = new THREE.LineBasicMaterial({
        color: isThunder ? 0x93c5fd : 0x38bdf8,
        transparent: true,
        opacity: isThunder ? 0.75 : 0.6,
        blending: THREE.AdditiveBlending
      });

      const rainLines = new THREE.LineSegments(rainGeo, rainMat);
      envGroup.add(rainLines);
      objects.rain = { mesh: rainLines, count: dropCount, isThunder, nextLightningTime: 2.5 };

      buildCloudPuffs(isThunder ? 0x1e293b : 0x334155, 6);
    }

    function buildSnow() {
      const flakeCount = isMobile ? 500 : 1200;
      const snowGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(flakeCount * 3);
      const speeds = new Float32Array(flakeCount);
      const phases = new Float32Array(flakeCount);

      for (let i = 0; i < flakeCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
        speeds[i] = Math.random() * 1.5 + 0.8;
        phases[i] = Math.random() * Math.PI * 2;
      }

      snowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const snowMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 4.5,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const snowParticles = new THREE.Points(snowGeo, snowMat);
      envGroup.add(snowParticles);
      objects.snow = { mesh: snowParticles, count: flakeCount, speeds, phases };

      buildCloudPuffs(0x93c5fd, 4, 0.2);
    }

    function buildCloudPuffs(colorHex = 0x64748b, count = 8, opacity = 0.35) {
      const cloudGroup = new THREE.Group();
      for (let i = 0; i < count; i++) {
        const puffGeo = new THREE.SphereGeometry(Math.random() * 60 + 50, 16, 16);
        const puffMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          transparent: true,
          opacity,
          roughness: 0.9,
          metalness: 0.1
        });
        const puff = new THREE.Mesh(puffGeo, puffMat);
        puff.position.set((Math.random() - 0.5) * 900, Math.random() * 250 + 50, -Math.random() * 400 - 50);
        puff.scale.set(1.5, 0.8, 1);
        cloudGroup.add(puff);
      }
      envGroup.add(cloudGroup);
      objects.clouds = cloudGroup;
    }

    function switchTheme(tName) {
      clearEnvironment();
      switch (tName) {
        case 'theme-clear-day':
          buildSunny();
          break;
        case 'theme-night':
          buildNight();
          break;
        case 'theme-rain':
          buildRain(false);
          break;
        case 'theme-thunderstorm':
          buildRain(true);
          break;
        case 'theme-snow':
          buildSnow();
          break;
        case 'theme-cloudy':
        case 'theme-fog':
        default:
          buildCloudPuffs(0x64748b, isMobile ? 8 : 14, 0.45);
          break;
      }
    }

    engineRef.current = { switchTheme };
    switchTheme(themeName || 'theme-clear-day');

    // --- Animation Loop ---
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera Lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;
      camera.position.x = currentMouseX * 50;
      camera.position.y = -currentMouseY * 35;
      camera.lookAt(0, 0, 0);

      // Sun
      if (objects.sun) {
        const { halo1, halo2, motes } = objects.sun;
        halo1.rotation.z += 0.005;
        halo2.rotation.z -= 0.003;
        const pulse = 1 + Math.sin(elapsedTime * 2) * 0.06;
        halo1.scale.set(pulse, pulse, 1);
        if (motes) {
          const pos = motes.geometry.attributes.position.array;
          for (let i = 1; i < pos.length; i += 3) {
            pos[i] += Math.sin(elapsedTime + i) * 0.3;
          }
          motes.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Moon & Stars
      if (objects.moon) objects.moon.mesh.rotation.y += 0.002;
      if (objects.stars) objects.stars.rotation.y = elapsedTime * 0.003;

      // Rain & Thunder
      if (objects.rain) {
        const { mesh, count, isThunder } = objects.rain;
        const pos = mesh.geometry.attributes.position.array;
        const fallSpeed = isThunder ? 18 : 12;

        for (let i = 0; i < count; i++) {
          const yIdx = i * 6 + 1;
          const yEndIdx = i * 6 + 4;
          pos[yIdx] -= fallSpeed;
          pos[yEndIdx] -= fallSpeed;
          if (pos[yIdx] < -400) {
            pos[yIdx] = 400;
            pos[yEndIdx] = 400 - (isThunder ? 32 : 22);
            pos[i * 6] = (Math.random() - 0.5) * 1000;
            pos[i * 6 + 3] = pos[i * 6] - 3;
          }
        }
        mesh.geometry.attributes.position.needsUpdate = true;

        if (isThunder) {
          objects.rain.nextLightningTime -= delta;
          if (objects.rain.nextLightningTime <= 0) {
            lightningLight.intensity = Math.random() * 3.5 + 2.0;
            setTimeout(() => {
              lightningLight.intensity = 0;
              if (Math.random() > 0.4) {
                setTimeout(() => {
                  lightningLight.intensity = 2.5;
                  setTimeout(() => { lightningLight.intensity = 0; }, 60);
                }, 90);
              }
            }, 80);
            objects.rain.nextLightningTime = Math.random() * 5 + 3;
          }
        }
      }

      // Snow
      if (objects.snow) {
        const { mesh, count, speeds, phases } = objects.snow;
        const pos = mesh.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
          const xIdx = i * 3;
          const yIdx = i * 3 + 1;
          pos[yIdx] -= speeds[i] * 2.5;
          pos[xIdx] += Math.sin(elapsedTime * 1.5 + phases[i]) * 0.7;
          if (pos[yIdx] < -400) {
            pos[yIdx] = 400;
            pos[xIdx] = (Math.random() - 0.5) * 1100;
          }
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      }

      // Clouds
      if (objects.clouds) {
        objects.clouds.children.forEach((puff, idx) => {
          puff.position.x += (idx % 2 === 0 ? 0.25 : 0.15);
          if (puff.position.x > 500) puff.position.x = -500;
        });
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      clearEnvironment();
      renderer.dispose();
    };
  }, []);

  // Update theme dynamically when themeName prop changes
  useEffect(() => {
    if (engineRef.current && themeName) {
      engineRef.current.switchTheme(themeName);
    }
  }, [themeName]);

  return <canvas ref={canvasRef} id="three-canvas" />;
}
