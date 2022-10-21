from .models import Exercise, Submission, Test, TestResult
from rest_framework import serializers, validators
import copy


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ["id", "exercise", "name", "stdin", "stdout"]

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'

    def run_validators(self, value):
        for validator in copy.copy(self.validators):
            if isinstance(validator, validators.UniqueTogetherValidator):
                self.validators.remove(validator)
        super(SubmissionSerializer, self).run_validators(value)

    def create(self, request):
        submission, created = Submission.objects.get_or_create(
            exercise=request["exercise"],
            owner=request["owner"],
            file=request["file"],

            defaults={
                'exercise':request["exercise"],
                'owner':request["owner"],
                'file':request["file"],
            }
        )

        submission.save()
        return submission

class TestResultSerializer(serializers.ModelSerializer):
    #Fixes depth=1 ignoring fields
    submission_pk = serializers.PrimaryKeyRelatedField(queryset=Submission.objects.all(), source='submission', write_only=True)
    exercise_test_pk = serializers.PrimaryKeyRelatedField(queryset=Test.objects.all(), source='exercise_test', write_only=True)
    class Meta:
        model = TestResult
        fields = ('submission', 'submission_pk', 'exercise_test', 'exercise_test_pk', 'running', 'stdout', 'success', 'time', 'memory')
        depth = 1

    def run_validators(self, value):
        for validator in copy.copy(self.validators):
            if isinstance(validator, validators.UniqueTogetherValidator):
                self.validators.remove(validator)
        super(TestResultSerializer, self).run_validators(value)

    def create(self, request):
        print("SERIALIZER create")
        print(request)
        testresult, created = TestResult.objects.get_or_create(
            submission=request["submission"],
            exercise_test=request["exercise_test"],

            defaults={
                'submission':request["submission"],
                'exercise_test':request["exercise_test"],
            }
        )
        
        testresult.running = request["running"]
        if testresult.running:
            testresult.stdout = ""
            testresult.success = False
            testresult.time = -1
            testresult.memory = -1
        else:
            testresult.stdout = request["stdout"]
            testresult.success = request["success"]
            testresult.time = request["time"]
            testresult.memory = request["memory"]

        testresult.save()
        return testresult