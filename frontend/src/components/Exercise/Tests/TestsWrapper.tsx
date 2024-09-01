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
            <TabList>
                <Tab>Visual editor</Tab>
                <Tab>Raw editor</Tab>
            </TabList>
            <TabPanels>
                <Tests
                    exerciseIsSuccess={exerciseIsSuccess}
                    isOwner={isOwner}
                    exercise_id={exercise_id}
                />
                <RawEditor exercise_id={exercise_id} />
            </TabPanels>
        </TabGroup>
    );
};

export default TestsWrapper;
