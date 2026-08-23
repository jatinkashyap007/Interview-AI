import React, { useState, useEffect } from 'react'

const QUESTIONS = [
    "Tell me about a time you led a project under pressure.",
    "Why do you want to work at this company?",
    "Walk me through a conflict you resolved on a team.",
    "What's a weakness you've actively worked on?"
]

const AuthBrandPanel = () => {
    const [text, setText] = useState("")

    useEffect(() => {
        let qi = 0
        let ci = 0
        let deleting = false
        let timer

        const tick = () => {
            const full = QUESTIONS[qi]
            if (!deleting) {
                ci++
                setText(full.slice(0, ci))
                if (ci === full.length) {
                    deleting = true
                    timer = setTimeout(tick, 1400)
                    return
                }
            } else {
                ci--
                setText(full.slice(0, ci))
                if (ci === 0) {
                    deleting = false
                    qi = (qi + 1) % QUESTIONS.length
                }
            }
            timer = setTimeout(tick, deleting ? 22 : 38)
        }

        timer = setTimeout(tick, 38)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="brand">
            <div>
                <div className="brand-mark">
                    <span className="dot"></span>Interview AI
                </div>

                <div className="brand-copy">
                    <h1>Practice the interview<br />before it happens.</h1>
                    <p>Real-time mock interviews with adaptive follow-up questions, scored feedback, and a transcript you can actually learn from.</p>
                </div>

                <div className="demo-card">
                    <div className="demo-header">
                        <span className="demo-label">
                            <span className="live-pulse"></span>Live session
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>00:42</span>
                    </div>

                    <div className="transcript-line">
                        {text}
                        <span className="cursor"></span>
                    </div>

                    <div className="waveform">
                        {Array.from({ length: 26 }).map((_, i) => (
                            <span key={i} style={{ animationDelay: `${i * 0.045}s` }} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="trust-row">
                <span>256-bit encrypted</span>
                <span>SOC 2 in progress</span>
                <span>No data resale</span>
            </div>
        </div>
    )
}

export default AuthBrandPanel
