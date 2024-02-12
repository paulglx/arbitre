import SubmissionDeadline from './SubmissionDeadline';
import SubmissionFileField from './Singlefield/SubmissionFileField';
import SubmissionFileFieldDisabled from './SubmissionFileFieldDisabled';
import SubmissionMultifileField from './Multifile/SubmissionMultifileField';
import TestResult from '../TestResult/TestResult'

const ExerciseSubmissionTab = (props: any) => {

    const { exercise, type } = props

    return (<>
        <SubmissionDeadline exercise={exercise} />
        {exercise?.session?.can_submit ?
            type === "single" ?
                <SubmissionFileField exercise={exercise} />
                :
                <SubmissionMultifileField exercise={exercise} />
            :
            <SubmissionFileFieldDisabled />
        }
        <TestResult exercise_id={exercise.id} exercise_grade={exercise.grade} />
    </>)
}

export default ExerciseSubmissionTab