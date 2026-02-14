import React from 'react';

interface DeepAnalysisProps {
  analysis: string[];
}

const DeepAnalysis: React.FC<DeepAnalysisProps> = ({ analysis }) => {
  return (
    <div className="deep-analysis">
      {analysis.map((text, index) => (
        <div
          key={index}
          className="deep-analysis-card"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="deep-analysis-index">
            {index + 1}
          </div>
          <div className="deep-analysis-text">
            {text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeepAnalysis;
