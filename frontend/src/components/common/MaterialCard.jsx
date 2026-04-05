import React from "react";
import { Link } from "react-router-dom";

const MaterialCard = ({ material }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6 flex flex-col h-full border-l-4 border-l-emerald-500">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded uppercase tracking-wider">
          {material.categoryId?.name || material.category || "Uncategorized"}
        </span>
        <span className="text-gray-400 text-xs">
          {new Date(material.createdAt).toLocaleDateString()}
        </span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{material.title}</h3>
      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
        {material.description}
      </p>
      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">By {material.author}</span>
        <a
          href={material.contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 font-bold hover:text-emerald-700 text-sm inline-flex items-center"
        >
          View Resource
          <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default MaterialCard;
