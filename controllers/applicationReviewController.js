import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import pdfjs from "pdfjs-dist";
import { config } from "dotenv";
config();
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

export const getReview = asyncHandler(async (req, res) => {
  const { userId, description } = req.body;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    res.status(404).send({ success: false, message: "User not found" });
    return;
  }
  if (!user.resume) {
    res.status(404).send({ success: false, message: "Resume not found" });
    return;
  }
  const resumeData = user.resume;

  const data = new Uint8Array(resumeData);
  const doc = await pdfjs.getDocument(data).promise;

  let textContent = "";
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    textContent += text;
  }
  try {
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "you are a resume inspector bot which will take in resume which can either be pdf or docs and you'll describe me how a person is based on their resume." +
            "i want you to analyse their technical knowledge and expertise based on the projects they mention and skill that they have and " +
            "then i'll give you a job description and based on that you'll give me 5 different ratings out of 5 whether the candidate is a good choice for the given job or not. " +
            "the rating criteria are qualification, experience, knowledge.",
        },
        {
          role: "assistant",
          content:
            "As an AI language model, I can certainly assist you in analyzing a resume and providing ratings based on the candidate's qualifications, experience, and knowledge. However, I cannot directly access or analyze specific resume links. Instead, you can provide me with the relevant information from the resume, such as the candidate's projects, skills, and experience." +
            "Once you provide me with the necessary details, including the job description, I can evaluate the candidate's qualifications, experience, and technical knowledge based on the information provided in the resume. I will then assign ratings out of 5 for each criterion (qualification, experience, knowledge) to determine if the candidate is a good fit for the given job.",
        },
        {
          role: "user",
          content:
            textContent +
            " Here is the resume and " +
            description +
            " here is the job description.",
        },
      ],
    });
    res.status(200).send({ success: true, data: result.data });
  } catch (err) {
    res.status(500).send({ success: true, data: err.message });
  }
});
