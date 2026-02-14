import React, { useMemo } from 'react';
import type { CloudNode, DreamState } from '../types';

interface DreamCloudMapProps {
  cloudNodes: CloudNode[];
  dreamState: DreamState;
  animate?: boolean;
}

/**
 * Simple hash function to generate deterministic pseudo-random values from a string.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate a pseudo-random number between min and max from a seed.
 */
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const DreamCloudMap: React.FC<DreamCloudMapProps> = ({ cloudNodes, dreamState, animate = true }) => {
  const centerNode = cloudNodes.find(n => n.size === 'large');
  const satellites = cloudNodes.filter(n => n.size === 'medium');
  const badges = cloudNodes.filter(n => n.size === 'small');

  const nebulaParticles = useMemo(() => {
    const seed = hashCode(dreamState.type + dreamState.label);
    const count = 10;
    return Array.from({ length: count }, (_, i) => ({
      cx: seededRandom(seed, i * 3) * 260 + 20,
      cy: seededRandom(seed, i * 3 + 1) * 260 + 20,
      r: seededRandom(seed, i * 3 + 2) * 6 + 2,
      opacity: seededRandom(seed, i * 5) * 0.15 + 0.05,
      delay: seededRandom(seed, i * 7) * 3,
    }));
  }, [dreamState.type, dreamState.label]);

  const stateColor = dreamState.color || '#C4B5FD';

  return (
    <div className="dream-cloud-map">
      <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Glow filter for cloud nodes */}
          <filter id="cloudGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Softer glow for satellites */}
          <filter id="satelliteGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Nebula background gradient */}
          <radialGradient id="nebulaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={stateColor} stopOpacity="0.25" />
            <stop offset="50%" stopColor={stateColor} stopOpacity="0.08" />
            <stop offset="100%" stopColor={stateColor} stopOpacity="0" />
          </radialGradient>

          {/* Center node gradient */}
          <radialGradient id="centerGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={stateColor} stopOpacity="0.7" />
            <stop offset="60%" stopColor={stateColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1A1B4B" stopOpacity="0.6" />
          </radialGradient>

          {/* Satellite gradient */}
          <radialGradient id="satGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={stateColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2D2F6B" stopOpacity="0.3" />
          </radialGradient>

          {/* Badge gradient */}
          <radialGradient id="badgeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={stateColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1A1B4B" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Background nebula glow */}
        <circle
          cx="150"
          cy="150"
          r="140"
          fill="url(#nebulaGrad)"
          className="nebula-glow"
        />

        {/* Nebula particles */}
        {nebulaParticles.map((p, i) => (
          <circle
            key={`particle-${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={stateColor}
            opacity={p.opacity}
            style={animate ? {
              animation: `nebula-pulse ${3 + p.delay}s ease-in-out ${p.delay}s infinite`,
            } : undefined}
          />
        ))}

        {/* Connection lines from center to satellites */}
        {centerNode && satellites.map((sat, i) => (
          <line
            key={`line-${i}`}
            x1={centerNode.x}
            y1={centerNode.y}
            x2={sat.x}
            y2={sat.y}
            stroke={stateColor}
            strokeOpacity="0.15"
            strokeWidth="1"
            strokeDasharray="4 4"
            style={animate ? {
              animation: `fadeIn 0.8s ease ${0.3 + i * 0.15}s both`,
            } : undefined}
          />
        ))}

        {/* Connection lines from satellites to badges */}
        {satellites.map((sat, si) =>
          badges.filter((_, bi) => bi % satellites.length === si).map((badge, bi) => (
            <line
              key={`badge-line-${si}-${bi}`}
              x1={sat.x}
              y1={sat.y}
              x2={badge.x}
              y2={badge.y}
              stroke={stateColor}
              strokeOpacity="0.08"
              strokeWidth="0.5"
              strokeDasharray="2 3"
              style={animate ? {
                animation: `fadeIn 0.8s ease ${0.6 + si * 0.1 + bi * 0.1}s both`,
              } : undefined}
            />
          ))
        )}

        {/* Badge nodes (small) */}
        {badges.map((node, i) => (
          <g
            key={`badge-${i}`}
            className="cloud-node"
            style={animate ? {
              animation: `cloudForm 0.6s ease ${0.6 + i * 0.1}s both`,
              transformOrigin: `${node.x}px ${node.y}px`,
            } : undefined}
          >
            {/* Blur background */}
            <circle
              cx={node.x}
              cy={node.y}
              r={22}
              fill={stateColor}
              opacity={node.opacity * 0.15}
              filter="url(#satelliteGlow)"
            />
            {/* Main circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={18}
              fill="url(#badgeGrad)"
              stroke={stateColor}
              strokeOpacity="0.15"
              strokeWidth="0.5"
            />
            {/* Symbol emoji */}
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="14"
              className="symbol-badge"
            >
              {node.symbol.emoji}
            </text>
            {/* Symbol name */}
            <text
              x={node.x}
              y={node.y + 28}
              textAnchor="middle"
              fontSize="7"
              fill="#94A3B8"
              opacity="0.7"
            >
              {node.symbol.name}
            </text>
          </g>
        ))}

        {/* Satellite nodes (medium) */}
        {satellites.map((node, i) => (
          <g
            key={`sat-${i}`}
            className="cloud-node cloud-satellite"
            style={animate ? {
              animation: `cloudForm 0.6s ease ${0.3 + i * 0.12}s both`,
              transformOrigin: `${node.x}px ${node.y}px`,
            } : undefined}
          >
            {/* Blur background */}
            <circle
              cx={node.x}
              cy={node.y}
              r={40}
              fill={stateColor}
              opacity={node.opacity * 0.12}
              filter="url(#satelliteGlow)"
            />
            {/* Main circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={30}
              fill="url(#satGrad)"
              stroke={stateColor}
              strokeOpacity="0.2"
              strokeWidth="1"
            />
            {/* Symbol emoji */}
            <text
              x={node.x}
              y={node.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="20"
              className="symbol-badge"
            >
              {node.symbol.emoji}
            </text>
            {/* Symbol name */}
            <text
              x={node.x}
              y={node.y + 40}
              textAnchor="middle"
              fontSize="9"
              fill="#C4B5FD"
              opacity="0.8"
              fontWeight="500"
            >
              {node.symbol.name}
            </text>
          </g>
        ))}

        {/* Center node (large) */}
        {centerNode && (
          <g
            className="cloud-node cloud-center"
            style={animate ? {
              animation: 'cloudForm 0.7s ease 0.1s both',
              transformOrigin: `${centerNode.x}px ${centerNode.y}px`,
            } : undefined}
          >
            {/* Outer glow */}
            <circle
              cx={centerNode.x}
              cy={centerNode.y}
              r={65}
              fill={stateColor}
              opacity={centerNode.opacity * 0.1}
              filter="url(#cloudGlow)"
            />
            {/* Main circle */}
            <circle
              cx={centerNode.x}
              cy={centerNode.y}
              r={50}
              fill="url(#centerGrad)"
              stroke={stateColor}
              strokeOpacity="0.3"
              strokeWidth="1.5"
            />
            {/* Inner highlight */}
            <circle
              cx={centerNode.x - 10}
              cy={centerNode.y - 12}
              r={15}
              fill="white"
              opacity="0.06"
            />
            {/* Symbol emoji */}
            <text
              x={centerNode.x}
              y={centerNode.y + 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="30"
              className="symbol-badge"
            >
              {centerNode.symbol.emoji}
            </text>
            {/* Symbol name */}
            <text
              x={centerNode.x}
              y={centerNode.y + 58}
              textAnchor="middle"
              fontSize="11"
              fill="#DDD6FE"
              fontWeight="600"
            >
              {centerNode.symbol.name}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default DreamCloudMap;
