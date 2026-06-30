// const {GoogleGenAI} = require ("@google/genai")
// const {z} = require("zod")
// const {zodToJsonSchema}= require("zod-to-json-schema")

// const ai = new GoogleGenAI({
//     apiKey : process.env.GOOGLE_GENAI_API_KEY
// })


// async function invokeGeminiAi(){
//     const response = await ai.models.generateContent({
//         model : "gemini-2.5-flash",
//         contents: "Hello gemini ! Explain what is Interview ?"
//     })

//     console.log(response.text)
// }


// const interviewReportSchema = z.object({
//     matchScore : z.number().describe("A score between 0 to 100 indicating how well the candidate's profile matches the job description"),
//     technicalQuestions: z.array(z.object({
//         question : z.string().describe("The technical question can be asked in the interview"),
//         intention : z.string().describe("The intention of interview behind asking this question"),
//         answer: z.string().describe("How to answer this question , what points to cover, what approach to take etc.")
//     })).describe("Behavioural question that can be asked in interview along with their intention"),
//       behaviouralQuestions: z.array(z.object({
//         question : z.string().describe("The technical question can be asked in the interview"),
//         intention : z.string().describe("The intention of interview behind asking this question"),
//         answer: z.string().describe("How to answer this question , what points to cover, what approach to take etc.")
//     })).describe("Behavioural question that can be asked in interview along with their intention"),
//     skillGap : z.array(z.object({
//         skill : z.string().describe("The skill which the candidate is lacking"),
//         severity : z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
//     })).describe("List of skill gap along with skill and severity"),
//     preparationPlan : z.array(z.object({
//         day : z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus : z.string().describe("The main focus of this day in thie preparation plan"),
//         tasks : z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan"),

//     })).describe("A day-wise preparation plan for candidate to follow ")


// })

// async function generateInterviewReport({resume, selfDescription, jobDescription}){
     

//     const prompt = `generate an interview report for a candidate with the following details :
//     Resume: ${resume}
//     Self Description: ${selfDescription}
//     Job Description: ${jobDescription} `
//     const response = await ai.models.generateContent({
//         model : "gemini-2.5-flash",
//         contents:prompt,
//         config:{
//             responseMimeType:"application/json",
//             responseJsonSchema:zodToJsonSchema(interviewReportSchema),
//         }
//     })

//     return JSON.parse(response.text)
// }

// module.exports = generateInterviewReport

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer and ATS resume reviewer.

Analyze the following candidate.

========================
RESUME
========================
${resume}

========================
SELF DESCRIPTION
========================
${selfDescription}

========================
JOB DESCRIPTION
========================
${jobDescription}

Generate ONLY valid JSON.

The JSON format MUST be:

{
  "matchScore": number,
  "technicalQuestions":[
    {
      "question":"",
      "intention":"",
      "answer":""
    }
  ],
  "behaviouralQuestions":[
    {
      "question":"",
      "intention":"",
      "answer":""
    }
  ],
  "skillGap":[
    {
      "skill":"",
      "severity":"low"
    }
  ],
  "preparationPlan":[
    {
      "day":1,
      "focus":"",
      "tasks":[
        "",
        ""
      ]
    }
  ]
}

Rules:

- matchScore must be between 0 and 100.
- Generate exactly 5 technical questions.
- Generate exactly 5 behavioural questions.
- Find all important skill gaps.
- severity can only be:
  - low
  - medium
  - high
- Generate a 7-day preparation plan.
- Return ONLY JSON.
- No markdown.
- No explanation.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  console.log("========== GEMINI ==========");
  console.log(response.text);
  console.log("============================");

  return JSON.parse(response.text);
}

module.exports = generateInterviewReport;