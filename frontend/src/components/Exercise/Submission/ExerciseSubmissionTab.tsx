import SubmissionDeadline from './SubmissionDeadline';
import SubmissionFileField from './SubmissionFileField';
import SubmissionFileFieldDisabled from './SubmissionFileFieldDisabled';
import TestResult from '../TestResult/TestResult'

const ExerciseSubmissionTab = (props: any) => {

    const { exercise } = props

    return (<>
        <SubmissionDeadline exercise={exercise} />
        {exercise?.session?.can_submit ?
            <SubmissionFileField exercise={exercise} />
            :
            <SubmissionFileFieldDisabled />
        }
        <TestResult exercise_id={exercise.id} exercise_grade={exercise.grade} />
    </>)
}

export default ExerciseSubmissionTab