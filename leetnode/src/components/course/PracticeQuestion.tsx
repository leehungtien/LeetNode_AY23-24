
import axios from "axios";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

import VariablesBox from "@/components/editor/VariablesBox";
import Latex from "@/components/Latex";
import { QuestionDifficultyBadge } from "@/components/misc/Badges";
import { QuestionDataType } from "@/types/question-types";
import { CustomMath } from "@/utils/CustomMath";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Checkbox,
  Drawer,
  Flex,
  Loader,
  Modal,
  Paper,
  Radio,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { Question, QuestionWithAddedTime, User } from "@prisma/client";
import { IconBulb } from "@tabler/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/*TESTING ONLY*/
import CanvasTool from "../drawing/CanvaTool";
import Highlighter from "./Highlighter";

interface UserData extends User {
  attempts: { [timestamp: string]: number };
}

export type UCQATAnswersType = {
  key: string;
  answerContent: string;
  isCorrect: boolean;
  isLatex: boolean;
}[];

export default function PracticeQuestion() {

  // State to control the visibility of CanvasBrand
  const [isCanvasBrandActive, setIsCanvasBrandActive] = useState(true);


  // Toggle function for CanvasBrand visibility
  const toggleCanvasBrand = () => {
    setIsCanvasBrandActive(!isCanvasBrandActive);
  };


  const session = useSession();
  const theme = useMantineTheme();

  const router = useRouter();
  const currentCourseSlug = router.query.courseSlug as string;

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [hintsOpened, setHintsOpened] = useState<boolean>(false);

  const { data: UCQAT } = useQuery({
    queryKey: ["get-ucqat"],
    queryFn: () =>
      axios.get<
        QuestionWithAddedTime & {
          question: Question & {
            topic: {
              topicName: string;
            };
          };
        }
      >(`/api/question/questionsWithAddedTime?courseSlug=${currentCourseSlug}`),
  });

  const useSubmitAnswer = () => {
    const queryClient = useQueryClient();
    const { mutate: submitAnswer, status: submitAnswerStatus } = useMutation({
      mutationFn: ({
        query,
        body,
      }: {
        query: {
          qatId: string;
          courseSlug: string;
        };
        body: {
          attemptedKeys: string[];
          isCorrect: boolean;
          topicSlug: string;
          topicName: string;
        };
      }) => {
        return axios.post(
          `/api/question/submitAnswer?qatId=${query.qatId}&courseSlug=${query.courseSlug}`,
          body
        );
      },
      onSuccess: (res) => {
        setSelectedKeys([]);
        const { data } = res;
        console.log(data);
        toast(
          `[${data.topic}] Mastery: ${CustomMath.round(
            data.masteryLevel * 100,
            1
          )}%`,
          {
            icon: data.isCorrect ? "🎉" : "💪",
            className: `border border-solid ${
              data.isCorrect ? "border-green-500" : "border-red-500"
            }`,
            position: "top-right",
            duration: 5000,
          }
        );
        queryClient.invalidateQueries(["get-ucqat"]);
        queryClient.invalidateQueries(["get-attempts", data.courseSlug]);
        updatePoints(); // Update points for attempting questions
      },
    });
    

    return {
      submitAnswer,
      submitAnswerStatus,
    };
    

  };

  const { submitAnswer, submitAnswerStatus } = useSubmitAnswer();

  // Check if first question attempted
  const { data: userInfo } = useQuery<UserData>({
    queryKey: ["userInfo", session?.data?.user?.id],
    queryFn: async () => {
      const res = await axios.post("/api/user", {
        id: session?.data?.user?.id,
      });
      return res?.data;
    },
    enabled: !!session?.data?.user?.id,
  });

  const queryClient = useQueryClient();

  // Award points for attempting a question
  const { mutate: updatePoints } = useMutation(
    async () => {
      if (!!userInfo) {
        const lastActive = new Date(userInfo.lastActive); // get last active

        const res = await axios.post("/api/user/updatePoints", {
          id: session?.data?.user?.id,
          points:
            (userInfo.attempts[lastActive.toDateString()] ?? 0) === 0
              ? userInfo.points + 5 // First question attempted today
              : userInfo.points + 1, // > 1 question attempted today
        });
        return {
          ...res,
          data: {
            ...res.data,
            customIcon: "🎯",
            message: (
              <>
                Question(s) attempted:{" "}
                {(userInfo.attempts[lastActive.toDateString()] ?? 0) + 1} 🔋
                <span className="text-yellow-600">
                  +
                  {(userInfo.attempts[lastActive.toDateString()] ?? 0) === 0
                    ? 5
                    : 1}
                </span>
              </>
            ),
          },
        };
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userInfo", session?.data?.user?.id]); // Get latest number of attempts
      },
    }
  );

  if (!UCQAT) {
    return (
      <Center className="h-[calc(100vh-180px)]">
        <Loader />
      </Center>
    );
  }

  if (!UCQAT.data) {
    return (
      <Center className="h-[calc(100vh-180px)]">
        <Text>Stay tuned, more questions are coming your way!</Text>
      </Center>
    );
  }

  const answerOptions = UCQAT.data.answers as QuestionDataType["answers"];

  const correctKeys = answerOptions
    .filter((item) => item.isCorrect)
    .map((item) => item.key);

  return (
    <Paper p="xl" radius="md" withBorder>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedKeys.length === 0) {
            toast.error("Please select an option");
            return;
          }
          submitAnswer({
            query: {
              qatId: UCQAT.data.qatId,
              courseSlug: currentCourseSlug,
            },
            body: {
              attemptedKeys: selectedKeys,
              isCorrect:
                selectedKeys.length === correctKeys.length &&
                selectedKeys.every((item) => correctKeys.includes(item)),
              topicSlug: UCQAT.data.question.topicSlug,
              topicName: UCQAT.data.question.topic.topicName,
            },
          });
        }}
      > 
        <Highlighter/>
        {/* QUESTION BADGE: EASY/MEDIUM/HARD DIFFICULTY + QUESTION + DIAGRAM*/}

        <QuestionDifficultyBadge
          questionDifficulty={UCQAT.data.question.questionDifficulty}
          {...{ radius: "lg", size: "md" }}
        />

        
        <br/> 
        Guidelines for using Highlighter/Annotation(Canvas) tools: 
            <br/>  
            - When Canvas Tool is 'inactive', highlighting is permitted only when activated.
            <br/> 
            - When Canvas Tool is 'active', highlighting is not permitted even when activated.
            <br/> 
            - When drawing using the annotative Canvas Tool, you can disable the tool to temporarily clear your drawings. <br/>
            (You can re-enable it afterwards, for your annotations or drawings to reappear.)
            <br/> 
            <br/>
            Note: You can only select answer options when Canvas Tool is disabled!
        
        <div className="rawhtml mt-4 relative" style={{ position: 'relative' }}>
          

          <Highlighter/>
          {/* Conditionally render the CanvasBrand based on isCanvasBrandActive state */}
          <Button onClick={toggleCanvasBrand}
            style={{
              backgroundColor: '#15aabf', // No background color for a transparent button
              fontSize: '1rem', // Extra-large text size
              marginBottom: '0.5rem', // Extra-small margin-bottom
              fontWeight: 500, // Bold font weight
              color: 'white', // Cyan text color
              border: 'none', // No border for the button
              padding: '8px 16px', // Standard padding; adjust as needed
              outline: 'none', // Remove outline on focus
              cursor: 'pointer', // Change cursor to pointer to indicate it's a button
              borderRadius: '10px', // Adjust this value to get the desired roundness of corners
            }} 
          >
            
            {/* Set DEFAULT STATE to INACTIVE */}
            {isCanvasBrandActive 
              ? 'Canvas Tool: INACTIVE'
              : 'Canvas Tool: ACTIVE'}
          </Button>
          
          {/* Set DEFAULT STATE to INACTIVE - set to "!isCanvasBrandActive" */}
          <CanvasTool isVisible={!isCanvasBrandActive} />
          
          {/* LINE BREAK x 3 : needed for appropriate annotation formatting*/}
          <br/>
          <br/>

          {/* Render the sanitized HTML content */}
          <div dangerouslySetInnerHTML={{ 
            
            __html: DOMPurify.sanitize(UCQAT.data.question.questionContent, {
              ADD_TAGS: ["iframe"],
              ADD_ATTR: [
                "allow",
                "allowfullscreen",
                "frameborder",
                "scrolling",
              ],
            }),
          }} />
                  
        </div>

        <br/>
        <br/>

        {/* VARIABLES BOX (WITH VALUES OF COMPONENTS LIKE R1 R2 R3 etc....) */}
        <VariablesBox
          variables={UCQAT.data.variables as QuestionDataType["variables"]}
        />

        {correctKeys.length === 1 ? (
          <Radio.Group
            mt="xl"
            value={selectedKeys[0]}
            onChange={(value) => {
              console.log(
                value === answerOptions.find((item) => item.isCorrect)?.key
              );
              setSelectedKeys([value]);
            }}
            orientation="vertical"
            description="Select only one option"
            required
          >
            {answerOptions.map((item) => (
              <Radio
                key={item.key}
                value={item.key}
                label={
                  item.isLatex ? (
                    <Latex>{`$$ ${item.answerContent} $$`}</Latex>
                  ) : (
                    <Text>{item.answerContent}</Text>
                  )
                }
                className={`flex items-center justify-start rounded-md border border-solid ${
                  theme.colorScheme === "dark"
                    ? "border-zinc-600 bg-zinc-700"
                    : "border-gray-200 bg-gray-100"
                } p-2`}
              />
            ))}
          </Radio.Group>
        ) : (
          <Checkbox.Group
            mt="xl"
            value={selectedKeys}
            onChange={(values) => {
              console.log(
                values.length === correctKeys.length &&
                  values.every((item) => correctKeys.includes(item))
              );
              setSelectedKeys(values);
            }}
            orientation="vertical"
            description="Select all correct options"
            required
          >
            {answerOptions.map((item) => (
              <Checkbox
                key={item.key}
                value={item.key}
                label={
                  item.isLatex ? (
                    <Latex>{item.answerContent}</Latex>
                  ) : (
                    <Text>{item.answerContent}</Text>
                  )
                }
                className={`flex items-center justify-start rounded-md border border-solid ${
                  theme.colorScheme === "dark"
                    ? "border-zinc-600 bg-zinc-700"
                    : "border-gray-200 bg-gray-100"
                } p-2`}
              />
            ))}
          </Checkbox.Group>
        )}


        <Flex mt="xl" align="center" gap="md">
          
          
          {/* BUTTON: SUBMIT */}
          <Button
            type="submit"
            variant="light"
            fullWidth
            loading={submitAnswerStatus === "loading"}
          >
            {submitAnswerStatus === "loading" ? "Submitting..." : "Submit"}
          </Button>


          {(UCQAT.data.question.questionData as QuestionDataType).hints && (
              <ActionIcon
                size="lg"
                variant="light"
                radius="xl"
                onClick={() => setHintsOpened(true)}
              >
                <IconBulb size={20} />
              </ActionIcon>
          )}
        </Flex>

        {/* Hints Modal */}

        <Modal
          opened={hintsOpened}
          onClose={() => setHintsOpened(false)}
          title="Hints"
          size="md"
        >
          <Stack>
            {(UCQAT.data.question.questionData as QuestionDataType).hints?.map(
              (item, index) => (
                <Box
                  key={index}
                  className="flex items-center justify-start gap-3 rounded-md border border-solid border-gray-200 bg-gray-100 p-2"
                >
                  <Text color="dimmed">#{index + 1}</Text>
                  <Text>{item.hint}</Text>
                </Box>
              )
            )}
          </Stack>
        </Modal>

        
      </form>
    </Paper>
  );
}
