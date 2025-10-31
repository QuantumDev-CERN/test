import { useCallback, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    addEdge,
    Connection,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    useReactFlow,
    ReactFlowProvider,
} from '@xyflow/react';
import { CustomNode } from './CustomNode';

interface RoadmapFlowProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onEdgesSet: (callback: (edges: Edge[]) => Edge[]) => void;
    onResetView?: () => void;
}

const nodeTypes = {
    custom: CustomNode,
};

function RoadmapFlowInner({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onEdgesSet,
    onResetView
}: RoadmapFlowProps) {
    const { fitView } = useReactFlow();
    
    const onConnect = useCallback(
        (params: Connection) => onEdgesSet((eds: Edge[]) => addEdge(params, eds)),
        [onEdgesSet]
    );

    useEffect(() => {
        const handleResetView = () => {
            fitView({ padding: 0.1, duration: 800 });
        };

        if (onResetView) {
            window.addEventListener('reset-view', handleResetView);
            return () => window.removeEventListener('reset-view', handleResetView);
        }
    }, [fitView, onResetView]);

    return (
        <div className="h-full flex-1" style={{ 
            height: 'calc(100vh - 60px)', 
            width: '100%',
            minHeight: '400px'
        }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView={true}
                fitViewOptions={{ padding: 0.1 }}
                nodesDraggable={true}
                nodesConnectable={true}
                elementsSelectable={true}
                attributionPosition="bottom-left"
                className="bg-white"
                style={{
                    backgroundColor: '#ffffff',
                    width: '100%',
                    height: '100%'
                }}
            >
                <Controls className="bg-white shadow-lg rounded-lg !left-2 !bottom-2 lg:!left-4 lg:!bottom-4" />
                <MiniMap
                    className="bg-white shadow-lg rounded-lg border border-gray-200 !right-2 !top-2 lg:!right-4 lg:!top-4 !w-32 !h-24 lg:!w-40 lg:!h-32"
                    nodeColor="#3b82f6"
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Background gap={20} size={1} color="#e5e7eb" />
            </ReactFlow>
        </div>
    );
}

export function RoadmapFlow(props: RoadmapFlowProps) {
    return (
        <ReactFlowProvider>
            <RoadmapFlowInner {...props} />
        </ReactFlowProvider>
    );
}