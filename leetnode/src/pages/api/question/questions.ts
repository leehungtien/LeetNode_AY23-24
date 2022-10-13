import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const reqvar = req.body["topicName"];

  // const questionDisplay: any =
  //   // {topicName: string, topicLevel: string, questionContent: string, questionDifficulty: string, questionMediaURL: string, answers: object}[] =
  //   await prisma.$queryRaw`select topicName, topicLevel, questionContent, questionDifficulty, questionMediaURL from
  //   ((Topic inner join Question on Question.topicId = Topic.topicId)
  //   inner join QuestionMedia on QuestionMedia.questionId = Question.questionId) where topicName = ${reqvar}`;

  // const answerDisplay: any =
  //   await prisma.$queryRaw`select  questionContent, optionNumber, answerContent, isCorrect from
  // (((Topic inner join Question on Question.topicId = Topic.topicId)
  // inner join QuestionMedia on QuestionMedia.questionId = Question.questionId)
  // inner join Answer on Answer.questionId = Question.questionId) where topicName = ${reqvar}`;

  // const dataDic: any = {};

  // for (let i = 0; i < answerDisplay.length; i++) {
  //   if (dataDic[answerDisplay[i].questionContent]) {
  //     dataDic[answerDisplay[i].questionContent].push(answerDisplay[i]);
  //   } else {
  //     dataDic[answerDisplay[i].questionContent] = [answerDisplay[i]];
  //   }
  // }

  // //add answers object
  // for (let i = 0; i < questionDisplay.length; i++) {
  //   if (dataDic[questionDisplay[i]?.questionContent as string]) {
  //     questionDisplay[i].answers =
  //       dataDic[questionDisplay[i].questionContent as string];
  //   }
  // }

  const questions = await prisma.question.findMany({
    where: {
      topic: {
        topicName: reqvar,
      },
    },
    include: {
      questionMedia: {
        select: { questionMediaURL: true },
      },
      topic: true,
      attempts: {
        // where: {
        //   userId: session?.user?.id,
        // },
        orderBy: {
          submittedAt: "desc",
        },
      },
      answers: true,
    },
  });

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    res.status(200).json(questions);
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
}
