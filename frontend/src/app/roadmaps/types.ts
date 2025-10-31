import { Node, Edge } from '@xyflow/react';

export interface RoadmapTab {
  id: string;
  label: string;
  icon: string;
}

export interface CustomNodeData {
  label: string;
  color?: string;
  borderColor?: string;
}

export interface RoadmapData {
  nodes: Node[];
  edges: Edge[];
}

export interface RoadmapCollection {
  [key: string]: RoadmapData;
}