import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { useInterview } from '../../interview/hooks/useInterview'
import toast from 'react-hot-toast'
import '../history.scss'

const History = () => {
    const { reports, deleteReport } = useInterview()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')
    const [scoreFilter, setScoreFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')
    const [planToDelete, setPlanToDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Filter and Sort Logic
    const filteredReports = useMemo(() => {
        if (!reports) return []
        return reports.filter(r => {
            const matchesSearch = !searchTerm || (r.jobDescription && r.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()))
            if (!matchesSearch) return false

            const score = r.matchScore || 0
            if (scoreFilter === 'high') return score >= 80
            if (scoreFilter === 'mid') return score >= 60 && score < 80
            if (scoreFilter === 'low') return score < 60
            return true
        }).sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            if (sortBy === 'highest') return (b.matchScore || 0) - (a.matchScore || 0)
            if (sortBy === 'lowest') return (a.matchScore || 0) - (b.matchScore || 0)
            return 0
        })
    }, [reports, searchTerm, scoreFilter, sortBy])

    const handleDeleteConfirm = async () => {
        if (!planToDelete) return
        setIsDeleting(true)
        toast.loading("Deleting interview plan...", { id: "delete-plan" })
        const res = await deleteReport(planToDelete._id)
        setIsDeleting(false)
        if (res.success) {
            toast.success("Interview plan deleted successfully!", { id: "delete-plan" })
            setPlanToDelete(null)
        } else {
            toast.error(res.error || "Failed to delete plan", { id: "delete-plan" })
        }
    }

    return (
        <div className="history-page">
            <div className="history-header">
                <div className="header-text">
                    <div className="header-tag">
                        <span>📜</span> Manage Plans
                    </div>
                    <h1>My Interview Plans & History</h1>
                    <p>Review, practice, or clean up your past mock interview strategy sessions.</p>
                </div>
                <Link to="/" className="btn-create-new">
                    <span>+</span> Create New Plan
                </Link>
            </div>

            {/* Filter and Search Bar */}
            <div className="history-filters-card">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search plans by role or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters-group">
                    <select
                        value={scoreFilter}
                        onChange={(e) => setScoreFilter(e.target.value)}
                        className="filter-dropdown"
                    >
                        <option value="all">All Scores</option>
                        <option value="high">High Match (80%+)</option>
                        <option value="mid">Moderate Match (60-79%)</option>
                        <option value="low">Low Match (&lt;60%)</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="filter-dropdown"
                    >
                        <option value="newest">Sort: Newest First</option>
                        <option value="highest">Sort: Highest Match Score</option>
                        <option value="lowest">Sort: Lowest Match Score</option>
                    </select>
                </div>
            </div>

            {/* Plans List */}
            {filteredReports.length > 0 ? (
                <div className="history-grid">
                    {filteredReports.map((report) => {
                        const dateStr = report.createdAt
                            ? new Date(report.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })
                            : 'Recent'

                        const score = report.matchScore || 0
                        const scoreClass = score >= 80 ? 'score--high' : score >= 60 ? 'score--mid' : 'score--low'

                        return (
                            <div key={report._id} className="history-card">
                                <div className="card-header-row">
                                    <span className="card-date">{dateStr}</span>
                                    <span className={`score-pill ${scoreClass}`}>
                                        {score}% Match
                                    </span>
                                </div>

                                <h3 className="card-job-desc">
                                    {report.jobDescription ? report.jobDescription : 'Interview Strategy'}
                                </h3>

                                <div className="card-features-row">
                                    <span className="feature-chip">
                                        ⚙️ {report.technicalQuestions?.length || 0} Tech Qs
                                    </span>
                                    <span className="feature-chip">
                                        💬 {report.behavioralQuestions?.length || 0} Behavioral
                                    </span>
                                    <span className="feature-chip">
                                        🗓️ {report.roadMap?.length || 0}-Day Roadmap
                                    </span>
                                </div>

                                <div className="card-actions-row">
                                    <Link
                                        to={`/interview/${report._id}`}
                                        className="btn-open-plan"
                                    >
                                        Start Practice →
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn-delete-plan"
                                        onClick={() => setPlanToDelete(report)}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="empty-history-box">
                    <div className="empty-icon">📁</div>
                    <h2>No Interview Plans Found</h2>
                    <p>{searchTerm || scoreFilter !== 'all' ? "Try adjusting your search or filters." : "You haven't generated any interview preparation plans yet."}</p>
                    <Link to="/" className="btn-create-first">
                        Create Your First Plan
                    </Link>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {planToDelete && (
                <div className="delete-modal-backdrop" onClick={() => !isDeleting && setPlanToDelete(null)}>
                    <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Delete Interview Plan?</h3>
                        <p>
                            Are you sure you want to permanently delete this interview strategy? This action cannot be undone.
                        </p>
                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => setPlanToDelete(null)}
                                disabled={isDeleting}
                            >
                                Keep Plan
                            </button>
                            <button
                                type="button"
                                className="btn-confirm-delete"
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default History
