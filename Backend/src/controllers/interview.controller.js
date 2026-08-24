const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf, evaluateUserAnswer } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    try {
        let resumeContentText = ""

        if (req.file) {
            try {
                const pdfParser = new pdfParse.PDFParse(new Uint8Array(req.file.buffer))
                const parsed = await pdfParser.getText()
                resumeContentText = parsed.text || ""
            } catch (pdfErr) {
                console.log("PDF parse fallback:", pdfErr.message)
                resumeContentText = req.file.buffer.toString("utf-8")
            }
        }

        const { selfDescription = "", jobDescription = "" } = req.body

        if (!jobDescription) {
            return res.status(400).json({
                message: "Target job description is required."
            })
        }

        if (!resumeContentText && !selfDescription) {
            return res.status(400).json({
                message: "Please provide either a resume file or a self description."
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContentText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContentText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (err) {
        console.error("Error in generateInterViewReportController:", err)
        res.status(500).json({
            message: err.message || "Failed to generate interview report"
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

/**
 * @description Controller to grade/evaluate user's answer for a specific interview question.
 */
async function evaluateAnswerController(req, res) {
    try {
        const { question, userAnswer, jobDescription } = req.body

        if (!question || !userAnswer) {
            return res.status(400).json({
                message: "Question and userAnswer are required."
            })
        }

        const evaluation = await evaluateUserAnswer({ question, userAnswer, jobDescription })

        res.status(200).json({
            message: "Answer evaluated successfully.",
            evaluation
        })
    } catch (err) {
        console.error("Error in evaluateAnswerController:", err)
        res.status(500).json({
            message: err.message || "Failed to evaluate answer"
        })
    }
}

/**
 * @description Controller to delete an interview report by ID.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params

        const deletedReport = await interviewReportModel.findOneAndDelete({
            _id: interviewId,
            user: req.user.id
        })

        if (!deletedReport) {
            return res.status(404).json({
                message: "Interview report not found or unauthorized to delete."
            })
        }

        res.status(200).json({
            message: "Interview report deleted successfully.",
            interviewId
        })
    } catch (err) {
        console.error("Error in deleteInterviewReportController:", err)
        res.status(500).json({
            message: err.message || "Failed to delete interview report"
        })
    }
}

module.exports = { 
    generateInterViewReportController, 
    getInterviewReportByIdController, 
    getAllInterviewReportsController, 
    generateResumePdfController, 
    evaluateAnswerController,
    deleteInterviewReportController
}