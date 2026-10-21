(() => {
  "use strict";
  const logo = document.getElementById("sme-logo");
  if (!logo) return;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return;

  // SME's Gray–Scott reactions occur only in the cytoplasm:
  // u_t = Du*laplacian(u) - u*v*v + f*(1-u)
  // v_t = Dv*laplacian(v) + u*v*v - (f+k)*v
  // The nucleus has diffusion only, with bidirectional membrane exchange.
  // Grid spacing is one model unit; the outer cell boundary has zero flux.
  const SIZE = 384;
  const LENGTH = SIZE * SIZE;
  const DT = 0.5;
  const DU = 0.2097;
  const DV = 0.105;
  const KILL = 0.06;
  // Nuclear membrane conductance relative to diffusion through the bulk.
  // The same face weight is used on both sides, conserving each species
  // during exchange. A value of 1 would make the interface transparent.
  const MEMBRANE_TRANSMISSION = 0.25;
  const STEPS_PER_SECOND = 600;
  const RUN_SECONDS = 30;
  const FADE_SECONDS = 0.75;
  const canvas = logo.querySelector("#sme-field");
  const context = canvas.getContext("2d");
  const nuclearContext = logo
    .querySelector("#sme-nuclear-field")
    .getContext("2d");
  const frame = context.createImageData(SIZE, SIZE);
  const nuclearFrame = nuclearContext.createImageData(SIZE, SIZE);
  const fields = logo.querySelector("#sme-fields");
  const cell = new Path2D(
    logo.querySelector("#sme-cell-shape").getAttribute("d"),
  );
  const nucleus = new Path2D(
    logo.querySelector("#sme-nucleus-shape").getAttribute("d"),
  );
  // 0 = exterior, 1 = cytoplasm, 2 = nucleus.
  const compartment = new Uint8Array(LENGTH);
  const activeList = [];
  const neighbors = [];
  const faceWeights = [];
  let u = new Float32Array(LENGTH);
  let v = new Float32Array(LENGTH);
  let nextU = new Float32Array(LENGTH);
  let nextV = new Float32Array(LENGTH);
  let feed;
  let time = 0;
  let credit = 0;
  let phase = "running";
  let phaseAge = 0;
  let previous = null;
  let lastPaint = -Infinity;
  let request = null;
  let onScreen = false;

  for (let y = 0; y < SIZE; ++y) {
    for (let x = 0; x < SIZE; ++x) {
      const i = y * SIZE + x;
      const px = ((x + 0.5) * 256) / SIZE;
      const py = ((y + 0.5) * 256) / SIZE;
      if (context.isPointInPath(cell, px, py)) {
        compartment[i] = context.isPointInPath(nucleus, px, py) ? 2 : 1;
        activeList.push(i);
      }
    }
  }
  const active = new Uint32Array(activeList);
  // Missing exterior neighbors map to the same site, giving zero flux.
  // Interior faces connect both compartments. Symmetric conductances slow
  // nuclear exchange without creating or destroying either species.
  for (const i of active) {
    for (const offset of [-1, 1, -SIZE, SIZE]) {
      const j = i + offset;
      const sameRow =
        Math.abs(offset) !== 1 || Math.floor(i / SIZE) === Math.floor(j / SIZE);
      const connected = j >= 0 && j < LENGTH && sameRow && compartment[j] !== 0;
      neighbors.push(connected ? j : i);
      faceWeights.push(
        connected && compartment[j] !== compartment[i]
          ? MEMBRANE_TRANSMISSION
          : 1,
      );
    }
  }
  const adjacency = new Uint32Array(neighbors);
  const conductance = new Float32Array(faceWeights);

  // Fixed Euler steps: DT*DU = 0.10485 < 1/4, the diffusion stability limit.
  function advance(steps) {
    for (let step = 0; step < steps; ++step) {
      for (let a = 0; a < active.length; ++a) {
        const i = active[a];
        const j = a * 4;
        const uc = u[i];
        const vc = v[i];
        const lapU =
          conductance[j] * (u[adjacency[j]] - uc) +
          conductance[j + 1] * (u[adjacency[j + 1]] - uc) +
          conductance[j + 2] * (u[adjacency[j + 2]] - uc) +
          conductance[j + 3] * (u[adjacency[j + 3]] - uc);
        const lapV =
          conductance[j] * (v[adjacency[j]] - vc) +
          conductance[j + 1] * (v[adjacency[j + 1]] - vc) +
          conductance[j + 2] * (v[adjacency[j + 2]] - vc) +
          conductance[j + 3] * (v[adjacency[j + 3]] - vc);
        let reactionU = 0;
        let reactionV = 0;
        if (compartment[i] === 1) {
          const reaction = uc * vc * vc;
          reactionU = -reaction + feed * (1 - uc);
          reactionV = reaction - (feed + KILL) * vc;
        }
        nextU[i] = uc + DT * (DU * lapU + reactionU);
        nextV[i] = vc + DT * (DV * lapV + reactionV);
      }
      [u, nextU] = [nextU, u];
      [v, nextV] = [nextV, v];
      time += DT;
    }
  }
  function makePalette(stops) {
    const result = new Uint8ClampedArray(1024 * 3);
    for (let n = 0; n < 1024; ++n) {
      const t = n / 1023;
      const half = t < 0.5 ? 0 : 1;
      let w = t < 0.5 ? t * 2 : (t - 0.5) * 2;
      w = w * w * (3 - 2 * w);
      for (let c = 0; c < 3; ++c)
        result[n * 3 + c] =
          stops[half][c] + (stops[half + 1][c] - stops[half][c]) * w;
    }
    return result;
  }
  // A single fixed V = 0..1 colour scale for both compartments.
  // Equal concentrations have identical colours, without normalization.
  const palette = makePalette([
    [93, 0, 197],
    [193, 38, 248],
    [252, 208, 255],
  ]);
  function render() {
    for (const i of active) {
      const label = compartment[i];
      const data = label === 2 ? nuclearFrame.data : frame.data;
      const c = Math.max(0, Math.min(1023, Math.round(v[i] * 1023))) * 3;
      data[i * 4] = palette[c];
      data[i * 4 + 1] = palette[c + 1];
      data[i * 4 + 2] = palette[c + 2];
      data[i * 4 + 3] = 255;
    }
    context.putImageData(frame, 0, 0);
    nuclearContext.putImageData(nuclearFrame, 0, 0);
  }
  function reset() {
    // The cytoplasmic feed range covers the three feed values shown in
    // the SME examples-page notebook. There is no nuclear feed or sink.
    feed = 0.03 + Math.random() * 0.02;
    // A clean compartment split: U outside, V inside. Membrane diffusion
    // brings them together and starts the outer autocatalytic reaction.
    // No seeded ring, spatial noise, or internal nuclear reactions.
    u.fill(0);
    nextU.fill(0);
    v.fill(0);
    nextV.fill(0);
    for (const i of active) {
      u[i] = compartment[i] === 1 ? 1 : 0;
      v[i] = compartment[i] === 2 ? 1 : 0;
    }
    time = 0;
    credit = 0;
    render();
  }
  const smooth = (x) => x * x * (3 - 2 * x);
  function tick(now) {
    request = null;
    if (!onScreen || document.hidden || reduced.matches) return;
    const elapsed = previous === null ? 0 : (now - previous) / 1000;
    previous = now;
    phaseAge += elapsed;
    if (phase === "running" && phaseAge >= RUN_SECONDS) {
      phase = "fade-out";
      phaseAge = 0;
      credit = 0;
    }
    if (phase === "fade-out") {
      fields.style.opacity = 1 - smooth(Math.min(1, phaseAge / FADE_SECONDS));
      if (phaseAge >= FADE_SECONDS) {
        reset();
        phase = "fade-in";
        phaseAge = 0;
      }
    } else {
      if (phase === "fade-in") {
        fields.style.opacity = smooth(Math.min(1, phaseAge / FADE_SECONDS));
        if (phaseAge >= FADE_SECONDS) {
          phase = "running";
          phaseAge = 0;
        }
      }
      // Integrate and paint at 30 fps; never catch up a hidden interval.
      credit += Math.min(elapsed, 0.05) * STEPS_PER_SECOND;
      if (now - lastPaint >= 1000 / 30) {
        const steps = Math.min(80, Math.floor(credit));
        credit -= steps;
        advance(steps);
        render();
        lastPaint = now;
      }
    }
    request = requestAnimationFrame(tick);
  }
  function schedule() {
    previous = null;
    if (request !== null) cancelAnimationFrame(request);
    request =
      onScreen && !document.hidden && !reduced.matches
        ? requestAnimationFrame(tick)
        : null;
  }
  document.addEventListener("visibilitychange", schedule);
  reduced.addEventListener("change", schedule);
  new IntersectionObserver((entries) => {
    onScreen = entries[0].isIntersecting;
    schedule();
  }).observe(logo);
  logo.classList.add("simulation-ready");
  reset();
})();
