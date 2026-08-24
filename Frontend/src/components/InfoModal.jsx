import React, { useEffect } from 'react'
import './InfoModal.scss'

const MODAL_CONTENT = {
    privacy: {
        title: 'Privacy Policy',
        icon: '🔒',
        sections: [
            {
                heading: 'Data Protection & Encryption',
                text: 'All resumes, job descriptions, and interview sessions uploaded to Interview AI are encrypted using industry-standard 256-bit AES encryption in transit and at rest.'
            },
            {
                heading: 'Zero Personal Data Resale',
                text: 'We never sell, rent, or monetize your resume, answers, or personal details to third-party recruiters, advertisers, or data brokers.'
            },
            {
                heading: 'AI Model Safety',
                text: 'Your uploaded resumes and practice answers are processed strictly in ephemeral memory for the duration of interview generation and evaluation, adhering to enterprise AI privacy standards.'
            }
        ]
    },
    terms: {
        title: 'Terms of Service',
        icon: '📜',
        sections: [
            {
                heading: 'Service Overview',
                text: 'Interview AI provides AI-powered mock interview practice, skill gap analysis, and tailored resume optimization to help candidates prepare for real-world job interviews.'
            },
            {
                heading: 'Acceptable Use',
                text: 'You agree to use this platform for lawful career preparation purposes. Automated scraping, reverse-engineering the AI scoring engine, or attempting to overload the API is strictly prohibited.'
            },
            {
                heading: 'Disclaimer & Results',
                text: 'While our AI models are trained on real-world interview formats and industry benchmarks, Interview AI is a preparation aid and does not guarantee job offers or employment outcomes.'
            }
        ]
    },
    help: {
        title: 'Help & FAQ Center',
        icon: '💡',
        faqs: [
            {
                q: 'How is the Match Score calculated?',
                a: 'The Match Score is computed by comparing your uploaded resume skills, years of experience, and achievements against the specific requirements and keywords in the target job description.'
            },
            {
                q: 'What resume file formats are supported?',
                a: 'Currently, standard PDF files up to 10 MB are supported for resume uploads. You can also type or paste a quick self-description.'
            },
            {
                q: 'How does the "Evaluate My Answer" feature work?',
                a: 'When you type an answer to any technical or behavioral question, our Gemini AI grades your answer from 0-10, highlights strengths, points out missing key concepts, and provides a structured STAR method model answer.'
            }
        ],
        contact: {
            text: 'Need assistance or have feedback?',
            email: 'support@interviewai.dev'
        }
    }
}

const InfoModal = ({ type, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    if (!type || !MODAL_CONTENT[type]) return null

    const data = MODAL_CONTENT[type]

    return (
        <div className="info-modal-backdrop" onClick={onClose}>
            <div className="info-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="info-modal-header">
                    <div className="header-title-row">
                        <span className="modal-icon">{data.icon}</span>
                        <h2>{data.title}</h2>
                    </div>
                    <button type="button" className="modal-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="info-modal-body">
                    {data.sections && data.sections.map((sec, i) => (
                        <div key={i} className="modal-section">
                            <h3>{sec.heading}</h3>
                            <p>{sec.text}</p>
                        </div>
                    ))}

                    {data.faqs && (
                        <div className="modal-section">
                            <h3>Frequently Asked Questions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                                {data.faqs.map((faq, i) => (
                                    <div key={i} className="faq-item">
                                        <h4>{faq.q}</h4>
                                        <p>{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.contact && (
                        <div className="contact-box">
                            <span className="contact-text">{data.contact.text}</span>
                            <a href={`mailto:${data.contact.email}`} className="contact-email">
                                {data.contact.email}
                            </a>
                        </div>
                    )}
                </div>

                <div className="info-modal-footer">
                    <button type="button" className="btn-modal-close" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InfoModal
