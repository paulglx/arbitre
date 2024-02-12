import MultifileRuntime from "./Multifile/MultifileRuntime";
import SinglefileRuntime from "./Singlefile/SinglefileRuntime";
import TypePicker from "./TypePicker";

const ExerciseRuntimeTab = (props: any) => {
    const exerciseType = props.exerciseType;

    // Multi file
    const exercise = props.exercise;

    // Single file
    const edit = props.edit;
    const course = props.course;
    const isOwner = props.isOwner;
    const prefix = props.prefix;
    const suffix = props.suffix;
    const setPrefix = props.setPrefix;
    const setSuffix = props.setSuffix;

    return <>
        <TypePicker />
        {exerciseType === "single"
            ? <SinglefileRuntime
                edit={edit}
                course={course}
                isOwner={isOwner}
                prefix={prefix}
                suffix={suffix}
                setPrefix={setPrefix}
                setSuffix={setSuffix}
            />
            : <MultifileRuntime exercise={exercise} />}
    </>
}

export default ExerciseRuntimeTab