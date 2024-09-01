import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import RawEditor from "./RawEditor";
import Tests from "./Tests";

const TestsWrapper = (props: {
  exerciseIsSuccess: boolean;
  isOwner: boolean;
  exercise_id: number;
}) => {
  const { exerciseIsSuccess, isOwner, exercise_id } = props;

  return (
    <TabGroup>
      <TabList className="rounded-full w-fit p-1 text-sm my-2 bg-gray-100 *:px-2 *:rounded-full data-[selected]:*:bg-white data-[selected]:*:border-gray-300 *:border *:border-transparent">
        <Tab>Visual editor</Tab>
        <Tab>Raw editor</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Tests
            exerciseIsSuccess={exerciseIsSuccess}
            isOwner={isOwner}
            exercise_id={exercise_id}
          />
        </TabPanel>

        <TabPanel>
          <RawEditor exercise_id={exercise_id} />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
};

export default TestsWrapper;
