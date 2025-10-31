import { Node } from '@xyflow/react';
import { RoadmapCollection } from '../types';
import { COLORS, EDGE_STYLE } from '../constants';

const createNode = (
  id: string,
  label: string,
  x: number,
  y: number,
  color: { bg: string; border: string }
): Node => ({
  id,
  type: 'custom',
  position: { x, y },
  data: { label, color: color.bg, borderColor: color.border },
  draggable: true,
});

const createEdge = (id: string, source: string, target: string) => ({
  id,
  source,
  target,
  animated: true,
  style: EDGE_STYLE,
});

export const initialRoadmapData: RoadmapCollection = {
  ai: {
    nodes: [
      createNode('1', 'Python Basics', 250, 50, COLORS.GREEN),
      createNode('2', 'Mathematics & Statistics', 250, 150, COLORS.ORANGE),
      createNode('3', 'NumPy & Pandas', 100, 250, COLORS.BLUE),
      createNode('4', 'Data Visualization', 400, 250, COLORS.BLUE),
      createNode('5', 'Machine Learning', 250, 350, COLORS.PURPLE),
      createNode('6', 'Deep Learning', 100, 450, COLORS.PINK),
      createNode('7', 'Neural Networks', 400, 450, COLORS.PINK),
      createNode('8', 'AI Projects', 250, 550, COLORS.INDIGO),
    ],
    edges: [
      createEdge('e1-2', '1', '2'),
      createEdge('e2-3', '2', '3'),
      createEdge('e2-4', '2', '4'),
      createEdge('e3-5', '3', '5'),
      createEdge('e4-5', '4', '5'),
      createEdge('e5-6', '5', '6'),
      createEdge('e5-7', '5', '7'),
      createEdge('e6-8', '6', '8'),
      createEdge('e7-8', '7', '8'),
    ],
  },
  dsa: {
    nodes: [
      createNode('1', 'Programming Basics', 250, 50, COLORS.GREEN),
      createNode('2', 'Arrays & Strings', 250, 150, COLORS.ORANGE),
      createNode('3', 'Linked Lists', 100, 250, COLORS.BLUE),
      createNode('4', 'Stacks & Queues', 400, 250, COLORS.BLUE),
      createNode('5', 'Trees & Graphs', 250, 350, COLORS.PURPLE),
      createNode('6', 'Sorting Algorithms', 100, 450, COLORS.PINK),
      createNode('7', 'Dynamic Programming', 400, 450, COLORS.PINK),
      createNode('8', 'Advanced Algorithms', 250, 550, COLORS.INDIGO),
    ],
    edges: [
      createEdge('e1-2', '1', '2'),
      createEdge('e2-3', '2', '3'),
      createEdge('e2-4', '2', '4'),
      createEdge('e3-5', '3', '5'),
      createEdge('e4-5', '4', '5'),
      createEdge('e5-6', '5', '6'),
      createEdge('e5-7', '5', '7'),
      createEdge('e6-8', '6', '8'),
      createEdge('e7-8', '7', '8'),
    ],
  },
  webdev: {
    nodes: [
      createNode('1', 'HTML & CSS', 250, 50, COLORS.GREEN),
      createNode('2', 'JavaScript', 250, 150, COLORS.ORANGE),
      createNode('3', 'React.js', 100, 250, COLORS.BLUE),
      createNode('4', 'TypeScript', 400, 250, COLORS.BLUE),
      createNode('5', 'Next.js', 250, 350, COLORS.PURPLE),
      createNode('6', 'State Management', 100, 450, COLORS.PINK),
      createNode('7', 'Testing', 400, 450, COLORS.PINK),
      createNode('8', 'Deployment', 250, 550, COLORS.INDIGO),
    ],
    edges: [
      createEdge('e1-2', '1', '2'),
      createEdge('e2-3', '2', '3'),
      createEdge('e2-4', '2', '4'),
      createEdge('e3-5', '3', '5'),
      createEdge('e4-5', '4', '5'),
      createEdge('e5-6', '5', '6'),
      createEdge('e5-7', '5', '7'),
      createEdge('e6-8', '6', '8'),
      createEdge('e7-8', '7', '8'),
    ],
  },
};