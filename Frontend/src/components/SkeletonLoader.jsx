import React from 'react'
import './SkeletonLoader.scss'

export const HomeSkeleton = () => (
    <div className="skeleton-home-container">
        <div className="skeleton skeleton-header" />
        <div className="skeleton skeleton-sub" />
        <div className="skeleton skeleton-card" />
    </div>
)

export const InterviewSkeleton = () => (
    <div className="skeleton-interview-layout">
        <div className="skeleton-nav-col">
            <div className="skeleton skeleton-nav-item" />
            <div className="skeleton skeleton-nav-item" />
            <div className="skeleton skeleton-nav-item" />
        </div>
        <div className="skeleton-content-col">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-q-card" />
            <div className="skeleton skeleton-q-card" />
            <div className="skeleton skeleton-q-card" />
        </div>
        <div className="skeleton-sidebar-col">
            <div className="skeleton skeleton-ring" />
            <div className="skeleton skeleton-box" />
        </div>
    </div>
)
