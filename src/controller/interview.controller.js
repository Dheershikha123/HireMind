const pdfParse = require("pdf-parse")

const generateInterviewReport = require("../services/ai.service")

const interviewReportModel = require("../models/interviewReport.model")


async function generateInterviewReportController(req,res){

    const resumeFile = req.file

    // const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const parsedResume = await (
    new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))
).getText();

const resumeContent = parsedResume.text;
    

    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume : resumeContent,
        selfDescription,
        jobDescription,
    }) 

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume : resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({
        message: "Interview resport generated successfully",
        interviewReport
    })

}

module.exports = {
    generateInterviewReportController
}