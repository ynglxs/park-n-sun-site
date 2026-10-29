// Scène Three.js du bowl : maquette en contreplaqué, caméra qui roule le long de la ligne
// de ride. Three.js est injecté (chargé à la demande par bowl.js) : ce module n'importe
// rien du CDN. Toutes les géométries, matériaux et textures sont créés une seule fois
// et libérés par liberer().
import { FORME, grilleSurface, normalePlan, pointPlan } from "./bowl-forme.js";
import { lireOklch, oklchVersSrgb } from "./couleurs.js";
import { amortir, pointAProgression, tableLongueurs } from "./courbe.js";
import {
  CHAPITRES,
  cibleRegard,
  pointsCamera,
  pointsLigne,
} from "./parcours.js";

const COLONNES = 220;
const LIGNES = 64;
const PLI = 0.14; // épaisseur d'un pli de la maquette (unités de scène)
const BLOC = { x0: -8.6, x1: 9.2, z0: -6, z1: 6, fond: -2.9 };

// Couleur Three.js depuis un token CSS OKLCH (Three.js ne lit pas oklch()).
function couleurToken(THREE, styles, nom) {
  const c = lireOklch(styles.getPropertyValue(nom));
  const { r, g, b } = oklchVersSrgb(c || { l: 0.5, c: 0, h: 0 });
  return new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);
}

// Couleur CSS pour dessiner dans un canvas 2D (qui, lui, comprend oklch()).
function css(styles, nom) {
  return styles.getPropertyValue(nom).trim();
}

// Texture des plis : bandes horizontales (une par pli) + veinage du bouleau.
function dessinerPlis(ctx, taille, styles) {
  const bandes = Math.round(1 / PLI);
  const h = taille / bandes;
  ctx.fillStyle = css(styles, "--color-birch-light");
  ctx.fillRect(0, 0, taille, taille);
  for (let i = 0; i < bandes; i++) {
    const y = i * h;
    // Les plis alternent de fil : un sur deux légèrement plus foncé.
    if (i % 2) {
      ctx.fillStyle = css(styles, "--color-birch");
      ctx.fillRect(0, y, taille, h);
    }
    ctx.fillStyle = css(styles, "--color-grain");
    ctx.globalAlpha = 0.85;
    ctx.fillRect(0, y + h - 2, taille, 2); // ligne de colle
    ctx.globalAlpha = 1;
  }
  veinage(ctx, taille, styles, 0.16);
}

function veinage(ctx, taille, styles, alpha) {
  // Fibres : courbes sinueuses déterministes (pas d'aléatoire, rendu identique partout).
  ctx.strokeStyle = css(styles, "--color-grain");
  ctx.lineWidth = 1;
  for (let k = 0; k < 46; k++) {
    const y0 = (k * 97.3) % taille;
    ctx.globalAlpha = alpha * (0.4 + ((k * 37) % 10) / 16);
    ctx.beginPath();
    for (let x = 0; x <= taille; x += 8) {
      const y =
        y0 +
        Math.sin((x / taille) * Math.PI * 2 * (1 + (k % 3)) + k) * 3 +
        Math.sin(x * 0.05 + k * 1.7) * 1.2;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function dessinerPlateau(ctx, taille, styles) {
  ctx.fillStyle = css(styles, "--color-birch-light");
  ctx.fillRect(0, 0, taille, taille);
  veinage(ctx, taille, styles, 0.22);
  // Joints des panneaux de contreplaqué.
  ctx.fillStyle = css(styles, "--color-grain");
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, taille, 2);
  ctx.fillRect(0, 0, 2, taille);
  ctx.globalAlpha = 1;
}

// Margelles : blocs gris clair séparés par des joints (texte d'origine : « margelles en béton »).
function dessinerMargelle(ctx, taille, styles) {
  ctx.fillStyle = css(styles, "--color-birch-deep");
  ctx.fillRect(0, 0, taille, taille);
  ctx.fillStyle = css(styles, "--color-graphite-soft");
  ctx.globalAlpha = 0.35;
  ctx.fillRect(0, 0, taille, taille);
  ctx.globalAlpha = 0.9;
  ctx.fillRect(0, 0, 4, taille);
  ctx.globalAlpha = 1;
}

// Texte posé sur une paroi : dessiné une fois dans un canvas, puis plaqué sur une bande
// de la surface (il épouse la courbe). Le même texte est dans le DOM.
function dessinerTexte(ctx, largeur, hauteur, texte, styles) {
  ctx.clearRect(0, 0, largeur, hauteur);
  ctx.fillStyle = css(styles, "--color-blued");
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let taille = hauteur * 0.78;
  ctx.font = `800 ${taille}px "Big Shoulders Display", "Arial Narrow", sans-serif`;
  const mesure = ctx.measureText(texte).width;
  if (mesure > largeur * 0.94) {
    taille *= (largeur * 0.94) / mesure;
    ctx.font = `800 ${taille}px "Big Shoulders Display", "Arial Narrow", sans-serif`;
  }
  ctx.fillText(texte, largeur / 2, hauteur / 2);
}

function textureCanvas(THREE, largeur, hauteur, dessiner) {
  const canvas = document.createElement("canvas");
  canvas.width = largeur;
  canvas.height = hauteur;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponible");
  dessiner(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function geometrie(THREE, { positions, uvs, indices }) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  g.setIndex(new THREE.BufferAttribute(indices, 1));
  g.computeVertexNormals();
  return g;
}

// Bande de la margelle : du bord (léger débord vers l'intérieur) vers l'extérieur.
function grilleMargelle(colonnes) {
  const largeur = 0.42;
  const debord = 0.06;
  const hauteur = 0.1;
  const profil = [
    [-debord, -hauteur],
    [-debord, 0.02],
    [0.05, hauteur],
    [largeur, hauteur],
  ];
  const nb = (colonnes + 1) * profil.length;
  const positions = new Float32Array(nb * 3);
  const uvs = new Float32Array(nb * 2);
  let longueur = 0;
  let precedent = pointPlan(0);
  let k = 0;
  for (let i = 0; i <= colonnes; i++) {
    const t = i / colonnes;
    const b = pointPlan(t);
    longueur += Math.hypot(b.x - precedent.x, b.z - precedent.z);
    precedent = b;
    const n = normalePlan(t);
    profil.forEach(([d, y], j) => {
      positions.set([b.x + n.x * d, y, b.z + n.z * d], k * 3);
      uvs.set([longueur / 0.9, j / (profil.length - 1)], k * 2);
      k++;
    });
  }
  const lignes = profil.length - 1;
  const indices = new Uint32Array(colonnes * lignes * 6);
  let q = 0;
  for (let i = 0; i < colonnes; i++) {
    for (let j = 0; j < lignes; j++) {
      const a = i * profil.length + j;
      const b = a + 1;
      const c = a + profil.length;
      const d = c + 1;
      indices.set([a, b, c, b, d, c], q);
      q += 6;
    }
  }
  return { positions, uvs, indices };
}

export function creerScene(THREE, { canvas, styles, surChapitre }) {
  const jetables = [];
  const garder = (o) => (jetables.push(o), o);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "low-power",
  });
  const scene = new THREE.Scene();
  const fond = couleurToken(THREE, styles, "--color-birch");
  scene.background = fond;
  scene.fog = new THREE.Fog(fond, 16, 38);

  const camera = new THREE.PerspectiveCamera(62, 1, 0.05, 80);

  // Lumières : ciel neutre (bouleau clair) et lampe chaude au sodium.
  scene.add(
    new THREE.HemisphereLight(
      couleurToken(THREE, styles, "--color-birch-light"),
      couleurToken(THREE, styles, "--color-birch-deep"),
      2,
    ),
  );
  const lampe = new THREE.DirectionalLight(
    couleurToken(THREE, styles, "--color-sodium"),
    1.6,
  );
  lampe.position.set(-5, 10, 6);
  scene.add(lampe);

  // Textures (une fois).
  const texPlis = garder(
    textureCanvas(THREE, 512, 512, (ctx) => dessinerPlis(ctx, 512, styles)),
  );
  texPlis.wrapS = texPlis.wrapT = THREE.RepeatWrapping;
  texPlis.repeat.set(1 / 3, 1); // u en longueur, v en hauteur : un motif par unité
  const texPlateau = garder(
    textureCanvas(THREE, 512, 512, (ctx) => dessinerPlateau(ctx, 512, styles)),
  );
  texPlateau.wrapS = texPlateau.wrapT = THREE.RepeatWrapping;
  texPlateau.repeat.set(1 / 2.4, 1 / 1.2);
  const texMargelle = garder(
    textureCanvas(THREE, 128, 64, (ctx) => dessinerMargelle(ctx, 128, styles)),
  );
  texMargelle.wrapS = THREE.RepeatWrapping;

  const bois = garder(
    new THREE.MeshStandardMaterial({
      map: texPlis,
      roughness: 0.78,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  );
  const plateau = garder(
    new THREE.MeshStandardMaterial({ map: texPlateau, roughness: 0.82 }),
  );
  const margelle = garder(
    new THREE.MeshStandardMaterial({ map: texMargelle, roughness: 0.9 }),
  );
  const acier = garder(
    new THREE.MeshStandardMaterial({
      color: couleurToken(THREE, styles, "--color-birch-deep"),
      roughness: 0.7,
    }),
  );

  // Le bassin.
  const surface = garder(
    geometrie(THREE, grilleSurface(COLONNES, LIGNES, { uvHauteur: true })),
  );
  scene.add(new THREE.Mesh(surface, bois));

  // Margelle.
  const geoMargelle = garder(geometrie(THREE, grilleMargelle(COLONNES)));
  scene.add(new THREE.Mesh(geoMargelle, margelle));

  // Plateau autour du bassin : rectangle percé du contour du bord.
  const forme = new THREE.Shape();
  // Dessinée en (x, -z) puis couchée : la face regarde vers le haut.
  forme.moveTo(BLOC.x0, -BLOC.z0);
  forme.lineTo(BLOC.x1, -BLOC.z0);
  forme.lineTo(BLOC.x1, -BLOC.z1);
  forme.lineTo(BLOC.x0, -BLOC.z1);
  forme.closePath();
  const trou = new THREE.Path();
  for (let i = 0; i <= 160; i++) {
    const b = pointPlan(i / 160);
    if (i === 0) trou.moveTo(b.x, -b.z);
    else trou.lineTo(b.x, -b.z);
  }
  forme.holes.push(trou);
  const geoPlateau = garder(new THREE.ShapeGeometry(forme, 4));
  geoPlateau.rotateX(-Math.PI / 2);
  const meshPlateau = new THREE.Mesh(geoPlateau, plateau);
  scene.add(meshPlateau);

  // Flancs de la maquette : on y lit les plis empilés.
  const flancs = [
    [BLOC.x0, BLOC.z0, BLOC.x1, BLOC.z0],
    [BLOC.x1, BLOC.z0, BLOC.x1, BLOC.z1],
    [BLOC.x1, BLOC.z1, BLOC.x0, BLOC.z1],
    [BLOC.x0, BLOC.z1, BLOC.x0, BLOC.z0],
  ];
  for (const [xa, za, xb, zb] of flancs) {
    const l = Math.hypot(xb - xa, zb - za);
    const g = garder(new THREE.PlaneGeometry(l, -BLOC.fond, 8, 8));
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, uv.getX(i) * l, (1 - uv.getY(i)) * -BLOC.fond);
    }
    const m = new THREE.Mesh(g, bois);
    m.position.set((xa + xb) / 2, BLOC.fond / 2, (za + zb) / 2);
    m.rotation.y = -Math.atan2(zb - za, xb - xa);
    scene.add(m);
  }

  // Poteaux du local, dans le creux du plan.
  const geoPoteau = garder(new THREE.CylinderGeometry(0.28, 0.28, 6, 24));
  for (const t of [0.25]) {
    const b = pointPlan(t);
    const n = normalePlan(t);
    const p = new THREE.Mesh(geoPoteau, acier);
    p.position.set(b.x + n.x * 0.75, 3, b.z + n.z * 0.75);
    scene.add(p);
  }

  // Ligne de ride tracée sur la surface.
  const ligne = pointsLigne();
  const tableLigne = tableLongueurs(ligne, 400);
  const pointsTrace = [];
  for (let i = 0; i <= 400; i++) {
    const [x, y, z] = pointAProgression(ligne, tableLigne, i / 400);
    pointsTrace.push(new THREE.Vector3(x, y, z));
  }
  const geoLigne = garder(
    new THREE.BufferGeometry().setFromPoints(pointsTrace),
  );
  const matLigne = garder(
    new THREE.LineDashedMaterial({
      color: couleurToken(THREE, styles, "--color-blued"),
      dashSize: 0.32,
      gapSize: 0.18,
    }),
  );
  const traceRide = new THREE.Line(geoLigne, matLigne);
  traceRide.computeLineDistances();
  scene.add(traceRide);

  // Textes posés sur les parois.
  for (const chapitre of CHAPITRES) {
    const tex = garder(
      textureCanvas(THREE, 2048, 256, (ctx) =>
        dessinerTexte(ctx, 2048, 256, chapitre.surface, styles),
      ),
    );
    const mat = garder(
      new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        roughness: 0.8,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    if (chapitre.plateau) {
      const { x, z, largeur, hauteur } = chapitre.plateau;
      const plan = garder(new THREE.PlaneGeometry(largeur, hauteur));
      const m = new THREE.Mesh(plan, mat);
      // Couché sur la plateforme, lisible depuis la vue de fin (caméra côté z < 0).
      m.rotation.set(-Math.PI / 2, 0, Math.PI);
      m.position.set(x, 0.01, z);
      scene.add(m);
      continue;
    }
    const g = garder(
      geometrie(
        THREE,
        grilleSurface(64, 16, {
          t0: chapitre.t[0],
          t1: chapitre.t[1],
          s0: chapitre.s[0],
          s1: chapitre.s[1],
          decalage: 0.015,
        }),
      ),
    );
    scene.add(new THREE.Mesh(g, mat));
  }

  // Trajectoire de la caméra.
  const chemin = pointsCamera();
  const tableChemin = tableLongueurs(chemin, 600);
  const devant = new THREE.Vector3();
  const regard = new THREE.Vector3();

  let courant = 0;
  let cible = 0;
  let dernier = null;
  let actif = false;
  let visible = true;
  let chapitre = -1;

  function placer(p) {
    const [x, y, z] = pointAProgression(chemin, tableChemin, p);
    camera.position.set(x, y, z);
    const [dx, dy, dz] = cibleRegard(
      pointAProgression(chemin, tableChemin, Math.min(1, p + 0.035)),
    );
    devant.set(dx, dy, dz);
    // Aux extrémités (vues d'ensemble), on regarde le centre.
    const bord = Math.min(p, 1 - p);
    const k = bord < 0.06 ? 1 - bord / 0.06 : 0;
    regard.set(0.4, -1.2, 0).lerp(devant, 1 - k);
    camera.lookAt(regard);
  }

  function rendre() {
    renderer.render(scene, camera);
  }

  // Une seule boucle de rendu, qui s'arrête dès que la caméra est arrivée.
  function image(temps) {
    const dt =
      dernier === null ? 1 / 60 : Math.min(0.1, (temps - dernier) / 1000);
    dernier = temps;
    courant = amortir(courant, cible, 5, dt);
    if (Math.abs(courant - cible) < 1e-4) courant = cible;
    placer(courant);
    rendre();
    const index = CHAPITRES.findLastIndex((c) => courant >= c.debut);
    if (index !== chapitre) {
      chapitre = index;
      surChapitre?.(index);
    }
    if (courant === cible) arreterBoucle();
  }

  function lancerBoucle() {
    if (actif || !visible) return;
    actif = true;
    dernier = null;
    renderer.setAnimationLoop(image);
  }

  function arreterBoucle() {
    actif = false;
    renderer.setAnimationLoop(null);
  }

  return {
    // Progression voulue (0 → 1), venant du défilement.
    viser(p) {
      cible = p;
      lancerBoucle();
    },
    // Place la caméra sans transition (premier affichage).
    sauterA(p) {
      courant = cible = p;
      placer(p);
      rendre();
    },
    redimensionner(largeur, hauteur, dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(largeur, hauteur, false);
      camera.aspect = largeur / hauteur;
      // Écran étroit : on élargit le champ pour garder les parois dans le cadre.
      camera.fov = camera.aspect < 0.8 ? 74 : 62;
      camera.updateProjectionMatrix();
      placer(courant);
      rendre();
    },
    // Section hors de l'écran : plus aucune image calculée.
    rendreVisible(v) {
      visible = v;
      if (!v) arreterBoucle();
      else if (courant !== cible) lancerBoucle();
    },
    liberer() {
      arreterBoucle();
      for (const o of jetables) o.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
    forme: FORME,
  };
}
