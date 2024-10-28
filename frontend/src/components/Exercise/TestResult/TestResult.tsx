import {
  CommandLineIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { DiffEditor } from "@monaco-editor/react";
import GradeBadge from "../../Util/GradeBadge";
import StatusBadge from "../../Util/StatusBadge";
import TestResultCodePreviewModal from "./TestResultCodePreviewModal";
import TestResultLateBadge from "./TestResultLateBadge";
import TestResultTimeBadge from "./TestResultTimeBadge";
import { selectCurrentKeycloakToken } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";

const TestResult = (props: any) => {
  const [submission, setSubmission] = useState(null as any);
  const [testResults, setTestResults] = useState(new Map<number, any>());
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [finalExerciseGrade, setFinalExerciseGrade] = useState(0);

  const testResultsArray = Array.from(testResults.values());

  const keycloakToken = useSelector(selectCurrentKeycloakToken);

  const updateTestResults = (key: any, value: any) => {
    setTestResults((map: Map<any, any>) => new Map(map.set(key, value)));
  };

  useEffect(() => {
    if (!keycloakToken) {
      console.error("User is not authenticated or token is missing");
      return;
    }

    const ws_prefix = process.env.REACT_APP_USE_HTTPS === "true" ? "wss://" : "ws://";
    const socket = new WebSocket(
      `${ws_prefix + process.env.REACT_APP_API_URL}/ws/submission/${props.exercise_id}?token=${keycloakToken}`
    );

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.message.submission) {
        setSubmission(data?.message.submission);
      }

      if (data?.message.test_results) {
        data.message.test_results.forEach((test_result: any) => {
          updateTestResults(test_result.id, test_result);
        });
      }
    };

    return () => {
      socket.close();
    };
  }, [props.exercise_id, keycloakToken]);

  useEffect(() => {
    if (!testResults) return;

    let sumOfCoefficient = 0;
    let dividendTestGrade = 0;

    testResults.forEach((testResult: any) => {
      sumOfCoefficient += testResult.exercise_test.coefficient || 0;
      if (testResult?.status === "success") {
        dividendTestGrade +=
          props.exercise_grade * (testResult.exercise_test.coefficient || 0);
      }
    });

    let _finalExerciseGrade = 0;
    if (sumOfCoefficient !== 0) {
      _finalExerciseGrade = dividendTestGrade / sumOfCoefficient;
    }

    setFinalExerciseGrade(_finalExerciseGrade);
  }, [testResults, props.exercise_grade]);

  const Spinner = () => {
    return (
      <>
        <svg
          aria-hidden="true"
          className="inline w-5 h-5 text-gray-200 animate-spin fill-gray-800"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Running...</span>
      </>
    );
  };

  const TestResultContent = (props: any) => {
    const result = props.result;

    if (result.running) {
      return <Spinner />;
    } else if (result.status === "failed") {
      const diffEditorHeight = result.stdout.split("\n").length * 20 + 20;

      return (
        <div className="border my-2">
          <DiffEditor
            original={result.stdout}
            modified={result.exercise_test.stdout}
            language="plaintext"
            theme="light"
            height={diffEditorHeight}
            options={{
              automaticLayout: true,
              enableSplitViewResizing: false,
              renderSideBySide: false,
              readOnly: true,
              minimap: {
                enabled: false,
              },
              scrollBeyondLastLine: false,
              scrollbar: {
                vertical: "hidden",
                alwaysConsumeMouseWheel: false,
              },
            }}
          />
        </div>
      );
    } else {
      return (
        <span className="font-monospace flex">
          <CommandLineIcon className="w-5 h-5 text-gray-600 hidden sm:inline" />
          &nbsp;
          <pre className="w-full overflow-x-scroll">{result.stdout}</pre>
        </span>
      );
    }
  };

  const TimeBadge = (props: any) => {
    const time = props.time;

    if (time <= 0) {
      return <></>;
    } else {
      return (
        <span className="text-gray-500 text-sm font-normal mr-2">{time} s</span>
      );
    }
  };

  const headerBgColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50";
      case "failed":
        return "bg-gray-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  if (!submission || !testResults) {
    return <></>;
  }

  return (
    <>
      <TestResultCodePreviewModal
        submission={submission}
        show={showCodePreview}
        setShow={setShowCodePreview}
      />

      <ul className="text-gray-900 bg-white border-gray-200 rounded-lg">
        <li
          className={` ${headerBgColor(
            submission.status
          )} w-full flex flex-row justify-between items-center px-4 py-2 border rounded-lg`}
        >
          <span className="flex flex-row items-center">
            <span className="font-bold">
              {submission?.file?.split("/").pop()}
            </span>
            &nbsp;
            <DocumentMagnifyingGlassIcon
              className="inline w-5 h-5"
              role="button"
              onClick={() => {
                setShowCodePreview(true);
              }}
            />
            &nbsp;
            <TestResultTimeBadge time={submission.created} />
          </span>
          <div>
            <TestResultLateBadge submission={submission} />
            <StatusBadge
              status={submission.status}
              className="inline text-right"
            />
            {props.exercise_grade ? (
              <GradeBadge
                grade={finalExerciseGrade}
                total={props.exercise_grade}
              />
            ) : null}
          </div>
        </li>

        {testResultsArray.map((result: any, i: number) => {
          return (
            <li
              className={`px-4 py-2 my-2 border hover:bg-gray-100 bg-gray-50 rounded-lg`}
              key={i}
            >
              <div className="">
                <div className="font-bold flex justify-between items-center">
                  {result.exercise_test.name}
                  <div>
                    <TimeBadge time={result.time} />
                    &nbsp;
                    <StatusBadge status={result.status} />
                  </div>
                </div>
                <TestResultContent result={result} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default TestResult;
