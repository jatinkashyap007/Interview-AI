import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { useInterview } from '../../interview/hooks/useInterview'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import '../dashboard.scss'

const Dashboard = () => {
    const { reports, loading } = useInterview()
    const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')
    const [scoreFilter, setScoreFilter] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

    // ── Metric Calculations ────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        if (!reports || reports.length === 0) {
            return {
                avgScore: 0,
                totalReports: 0,
                totalQuestions: 0,
                topSkillGaps: []
            }
        }

        const total = reports.length
        const sumScore = reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0)
        const avgScore = Math.round(sumScore / total)

        let totalQuestions = 0
        const skillGapCounts = {}

        reports.forEach(r => {
            totalQuestions += (r.technicalQuestions?.length || 0) + (r.behavioralQuestions?.length || 0)
            if (Array.isArray(r.skillGaps)) {
                r.skillGaps.forEach(gap => {
                    const skillName = typeof gap === 'string' ? gap : (gap.skill || 'General')
                    skillGapCounts[skillName] = (skillGapCounts[skillName] || 0) + 1
                })
            }
        })

        const topSkillGaps = Object.entries(skillGapCounts)
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        return {
            avgScore,
            totalReports: total,
            totalQuestions,
            topSkillGaps
        }
    }, [reports])

    // ── Chart Data: Chronological score progression ──────────────────────────────
    const chartData = useMemo(() => {
        if (!reports || reports.length === 0) return []
        return [...reports]
            .reverse()
            .map((r, i) => {
                const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Session ${i + 1}`
                return {
                    name: date,
                    score: r.matchScore || 0,
                    title: r.jobDescription ? r.jobDescription.slice(0, 24) + '...' : `Plan #${i + 1}`
                }
            })
    }, [reports])

    // ── Filtered & Sorted Reports ────────────────────────────────────────────────
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

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: '#151B24',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#F4F6F8',
                    fontSize: '12px'
                }}>
                    <p style={{ margin: '0 0 4px', color: '#B7C0CC' }}>{payload[0].payload.name}</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#35E0C9' }}>
                        Match Score: {payload[0].value}%
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-tag">
                    <span>⚡</span> Analytics & Progress
                </div>
                <h1>Candidate Dashboard</h1>
                <p>Track your interview readiness, match scores, and recurring skill gaps over time.</p>
            </div>

            {/* Metrics Overview Cards */}
            <div className="metrics-grid">
                <div className="metric-card">
                    <span className="metric-label">Average Match Score</span>
                    <div className="metric-value-row">
                        <span className="metric-number">{stats.avgScore}%</span>
                        <span className={`metric-trend ${stats.avgScore >= 75 ? 'trend--high' : 'trend--mid'}`}>
                            {stats.avgScore >= 75 ? 'Strong Match' : 'Growing'}
                        </span>
                    </div>
                    <p className="metric-subtitle">Across {stats.totalReports} generated strategies</p>
                </div>

                <div className="metric-card">
                    <span className="metric-label">Total Practice Plans</span>
                    <div className="metric-value-row">
                        <span className="metric-number">{stats.totalReports}</span>
                    </div>
                    <p className="metric-subtitle">Active mock interview sessions</p>
                </div>

                <div className="metric-card">
                    <span className="metric-label">Questions Generated</span>
                    <div className="metric-value-row">
                        <span className="metric-number">{stats.totalQuestions}</span>
                    </div>
                    <p className="metric-subtitle">Technical & Behavioral Q&As</p>
                </div>

                <div className="metric-card">
                    <span className="metric-label">Top Skill Need</span>
                    <div className="metric-value-row">
                        <span className="metric-number" style={{ fontSize: '1.4rem' }}>
                            {stats.topSkillGaps[0]?.skill || 'None yet'}
                        </span>
                    </div>
                    <p className="metric-subtitle">Most frequently targeted gap</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Score Trend Area Chart */}
                <div className="chart-panel">
                    <div className="chart-panel-header">
                        <h2>Match Score Trend</h2>
                        <span className="chart-badge">Historical Progress</span>
                    </div>
                    <div className="chart-container">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#35E0C9" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#35E0C9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                    <XAxis dataKey="name" stroke="#6B7684" fontSize={11} />
                                    <YAxis domain={[0, 100]} stroke="#6B7684" fontSize={11} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#35E0C9"
                                        strokeWidth={2.5}
                                        fillOpacity={1}
                                        fill="url(#scoreGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart-placeholder">
                                <span>📊</span>
                                <p>Generate your first interview plan to see progress charts.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Gaps Frequency */}
                <div className="chart-panel">
                    <div className="chart-panel-header">
                        <h2>Top Recurring Skill Gaps</h2>
                        <span className="chart-badge" style={{ color: '#FF3B69', background: 'rgba(255,59,105,0.1)' }}>
                            Focus Areas
                        </span>
                    </div>
                    {stats.topSkillGaps.length > 0 ? (
                        <div className="skills-breakdown-list">
                            {stats.topSkillGaps.map((item, idx) => {
                                const maxCount = stats.topSkillGaps[0]?.count || 1
                                const percent = Math.round((item.count / maxCount) * 100)
                                return (
                                    <div key={idx} className="skill-item-bar">
                                        <div className="skill-item-info">
                                            <span className="skill-name">{item.skill}</span>
                                            <span className="skill-count">{item.count} occurrences</span>
                                        </div>
                                        <div className="skill-progress-track">
                                            <div
                                                className="skill-progress-fill"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="empty-chart-placeholder">
                            <span>🧠</span>
                            <p>No skill gaps identified yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Filterable Past Reports Section */}
            <div className="reports-section">
                <div className="reports-header">
                    <h2>Past Interview Reports ({filteredReports.length})</h2>
                    <div className="filters-row">
                        <input
                            type="text"
                            placeholder="Search by job title or keyword..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Match Scores</option>
                            <option value="high">High Match (80%+)</option>
                            <option value="mid">Moderate Match (60-79%)</option>
                            <option value="low">Low Match (&lt;60%)</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Sort: Newest First</option>
                            <option value="highest">Sort: Highest Score</option>
                            <option value="lowest">Sort: Lowest Score</option>
                        </select>
                    </div>
                </div>

                {filteredReports.length > 0 ? (
                    <div className="reports-cards-grid">
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
                                <div
                                    key={report._id}
                                    className="report-card"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <div className="card-top">
                                        <span className="report-date">{dateStr}</span>
                                        <span className={`score-pill ${scoreClass}`}>
                                            {score}% Match
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <h3 className="job-title">
                                            {report.jobDescription ? report.jobDescription : 'Interview Strategy'}
                                        </h3>
                                        <div className="card-meta">
                                            <span>
                                                ⚙️ {report.technicalQuestions?.length || 0} Tech Qs
                                            </span>
                                            <span>
                                                💬 {report.behavioralQuestions?.length || 0} Behavioral
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        <span className="view-link">
                                            Open Full Strategy →
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="no-reports-msg">
                        <p>No interview reports match your search or filter.</p>
                        <Link to="/" className="btn-create-plan">
                            Create New Interview Plan
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard
