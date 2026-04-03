/**
 * Knowledge Graph — D3.js Force-Directed Graph
 */
const KnowledgeGraph = {
  svg: null,
  simulation: null,
  zoomLevel: 1,

  init() {
    // Wait for D3 to be available
    if (typeof d3 === "undefined") {
      console.warn("D3.js not loaded yet, retrying...");
      setTimeout(() => this.init(), 500);
      return;
    }
    this.setupControls();
  },

  // Only render when the view becomes active
  render() {
    if (typeof d3 === "undefined") return;

    const canvas = document.getElementById("graph-canvas");
    if (!canvas || canvas.querySelector("svg")) return; // Already rendered

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 700;
    const height = rect.height || 500;

    // Build nodes and links
    const nodes = NexusData.subjects.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      color: s.color,
      credits: s.credits,
      professor: s.professor,
      r: 20 + s.credits * 6,
    }));

    // Deduplicate links (remove reverse duplicates)
    const linkSet = new Set();
    const links = [];
    NexusData.graphConnections.forEach((c) => {
      const key = [c.source, c.target].sort().join("-");
      if (!linkSet.has(key)) {
        linkSet.add(key);
        links.push({
          source: c.source,
          target: c.target,
          label: c.label,
          strength: c.strength,
        });
      }
    });

    // Create SVG
    const svg = d3
      .select(canvas)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`);

    this.svg = svg;

    // Zoom group
    const g = svg.append("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        this.zoomLevel = event.transform.k;
      });

    svg.call(zoom);
    this._zoom = zoom;
    this._g = g;
    this._svgEl = svg;

    // Simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(120)
          .strength((d) => d.strength * 0.3),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.r + 10),
      );

    this.simulation = simulation;

    // Links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke-width", (d) => 1 + d.strength * 2);

    // Link labels
    const linkLabel = g
      .append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .attr("font-size", "9px")
      .attr("fill", "var(--text-tertiary)")
      .attr("text-anchor", "middle")
      .attr("font-family", "var(--font-sans)")
      .text((d) => d.label);

    // Nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.color)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 3)
      .attr("fill-opacity", 0.15)
      .attr("stroke-opacity", 0.8);

    // Node labels
    node
      .append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => Math.max(9, d.r * 0.4) + "px")
      .text((d) => d.code);

    // Tooltip
    const tooltip = document.createElement("div");
    tooltip.className = "graph-tooltip";
    canvas.appendChild(tooltip);

    // Hover effects
    node
      .on("mouseover", (event, d) => {
        // Highlight connected
        const connected = new Set();
        links.forEach((l) => {
          const s = typeof l.source === "object" ? l.source.id : l.source;
          const t = typeof l.target === "object" ? l.target.id : l.target;
          if (s === d.id) connected.add(t);
          if (t === d.id) connected.add(s);
        });
        connected.add(d.id);

        node.classed("dimmed", (n) => !connected.has(n.id));
        link.classed("dimmed", (l) => {
          const s = typeof l.source === "object" ? l.source.id : l.source;
          const t = typeof l.target === "object" ? l.target.id : l.target;
          return s !== d.id && t !== d.id;
        });
        link.classed("highlighted", (l) => {
          const s = typeof l.source === "object" ? l.source.id : l.source;
          const t = typeof l.target === "object" ? l.target.id : l.target;
          return s === d.id || t === d.id;
        });

        // Grow hovered node
        d3.select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.r + 5)
          .attr("fill-opacity", 0.3);

        // Show tooltip
        tooltip.innerHTML = `
        <div class="graph-tooltip-title">${d.name}</div>
        <div class="graph-tooltip-details">
          <div>${d.code} · ${d.credits} credits</div>
          <div>Professor: ${d.professor}</div>
        </div>`;
        tooltip.classList.add("visible");
      })
      .on("mousemove", (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        tooltip.style.left = event.clientX - canvasRect.left + 15 + "px";
        tooltip.style.top = event.clientY - canvasRect.top - 10 + "px";
      })
      .on("mouseout", (event, d) => {
        node.classed("dimmed", false);
        link.classed("dimmed", false);
        link.classed("highlighted", false);

        d3.select(event.currentTarget)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", d.r)
          .attr("fill-opacity", 0.15);

        tooltip.classList.remove("visible");
      });

    // Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      linkLabel
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Render legend
    this.renderLegend();
  },

  renderLegend() {
    const legendList = document.getElementById("graph-legend-list");
    if (!legendList) return;

    legendList.innerHTML = NexusData.subjects
      .map(
        (s) => `
      <div class="graph-legend-item">
        <span class="graph-legend-dot" style="background:${s.color}"></span>
        <span>${s.code}</span>
      </div>
    `,
      )
      .join("");
  },

  setupControls() {
    const zoomIn = document.getElementById("graph-zoom-in");
    const zoomOut = document.getElementById("graph-zoom-out");
    const reset = document.getElementById("graph-reset");

    if (zoomIn) {
      zoomIn.addEventListener("click", () => {
        if (this._svgEl && this._zoom) {
          this._svgEl.transition().duration(300).call(this._zoom.scaleBy, 1.3);
        }
      });
    }

    if (zoomOut) {
      zoomOut.addEventListener("click", () => {
        if (this._svgEl && this._zoom) {
          this._svgEl.transition().duration(300).call(this._zoom.scaleBy, 0.7);
        }
      });
    }

    if (reset) {
      reset.addEventListener("click", () => {
        if (this._svgEl && this._zoom) {
          this._svgEl
            .transition()
            .duration(500)
            .call(this._zoom.transform, d3.zoomIdentity);
        }
      });
    }
  },

  // Cleanup when leaving view
  destroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
    const canvas = document.getElementById("graph-canvas");
    if (canvas) {
      canvas.innerHTML = "";
    }
    this.svg = null;
    this.simulation = null;
  },
};
