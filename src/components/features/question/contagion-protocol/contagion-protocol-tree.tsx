import { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import { ContagionProtocolTreeNode } from '@/models/contagion-protocol/contagion-protocol.model.type';

interface CytoscapeTreeProps {
  tree: {
    nodes: ContagionProtocolTreeNode[];
    edges: { source: string; target: string }[];
  };
  selectedPath?: string[];
}

export function CytoscapeTree({ tree, selectedPath = [] }: CytoscapeTreeProps) {
  const [_cy, setCy] = useState<cytoscape.Core | null>(null);
  const containerId = `cytoscape-container-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container || !tree) return;

    // Clear any existing cytoscape instance
    if (container.innerHTML) {
      container.innerHTML = '';
    }

    // Convert tree data to cytoscape format
    const nodes = tree.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.label,
        attribute: node.attribute,
        value: node.value,
        isOnPath: selectedPath.includes(node.id)
      }
    }));

    const edges = tree.edges.map((edge) => ({
      data: {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target
      }
    }));

    const cytoscapeInstance = cytoscape({
      container,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#1e293b',
            label: 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '120px',
            color: '#e2e8f0',
            'font-size': '12px',
            'font-weight': 'bold',
            width: 120,
            height: 60,
            'border-width': 3,
            'border-color': '#475569'
          }
        },
        {
          selector: 'node[isOnPath = true]',
          style: {
            'background-color': '#0f766e',
            'border-color': '#14b8a6',
            color: '#ffffff'
          }
        },
        {
          selector: 'edge',
          style: {
            width: 3,
            'line-color': '#475569',
            'target-arrow-color': '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        },
        {
          selector: 'edge[source = "START"]',
          style: {
            'line-color': '#14b8a6',
            'target-arrow-color': '#14b8a6',
            width: 4
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: ['START'],
        spacingFactor: 2.5,
        padding: 30,
        fit: true
      },
      // Enable zoom and pan
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.1,
      maxZoom: 100
    });

    setCy(cytoscapeInstance);

    return () => {
      cytoscapeInstance.destroy();
    };
  }, [tree]);

  return (
    <div className="w-full">
      <div
        id={containerId}
        className="w-full h-[700px] border-2 border-gray-600 rounded-lg bg-slate-800"
      />
      <div className="mt-2 text-xs text-slate-400 text-center">
        🔍 Gunakan roda mouse untuk memperbesar • Klik dan tarik untuk
        menjelajah pohon keputusan
      </div>
    </div>
  );
}
