from rest_framework import serializers, validators
import copy
from api.models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["id", "exercise", "file", "status", "created"]

    def run_validators(self, value):
        for validator in copy.copy(self.validators):
            if isinstance(validator, validators.UniqueTogetherValidator):
                self.validators.remove(validator)
        super(SubmissionSerializer, self).run_validators(value)
