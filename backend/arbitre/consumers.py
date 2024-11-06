from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from runner.models import Submission
from api.models import Exercise 
from .util import prepare_submission_message
import json
import jwt

class SubmissionConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Get exercise_id
        self.exercise_id = self.scope["url_route"]["kwargs"]["exercise_id"]
        
        # Get user initiating request from token (in query string)
        token = self.scope["query_string"].decode("utf-8").split("=")[1]
        self.request_user_id = await self.get_user_id(token)
        if self.request_user_id is None:
            await self.close()
        
        # Get user whose submission to display
        if "user_id" in self.scope["url_route"]["kwargs"]:
            # Requesting user must be a teacher (owner or tutor) on this course
            authorized = await self.check_user_authorization(self.request_user_id, self.exercise_id)
            if not authorized:
                await self.close()
                return

            self.user_id = self.scope["url_route"]["kwargs"]["user_id"]

        else:
            self.user_id = self.request_user_id


        self.submission_group_name = f"submission_{self.exercise_id}_{self.user_id}"

        # Get the submission ID
        self.submission_id = await self.get_submission_id()

        # Join submission group
        await self.channel_layer.group_add(
            self.submission_group_name, self.channel_name
        )

        await self.accept()

        # Prepare the submission message
        message = await self.prepare_submission_message(
            self.submission_id, with_test_results=True
        )

        # Send the submission message
        await self.send(text_data=json.dumps(message))

    async def disconnect(self, code):
        # Leave submission group
        await self.channel_layer.group_discard(
            self.submission_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to submission group
        await self.channel_layer.group_send(
            self.submission_group_name,
            {"type": "submission_update", "message": message},
        )

    # Receive message from submission group
    async def submission_update(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def get_submission_id(self):
        submission = Submission.objects.filter(
            exercise_id=self.exercise_id, owner_id=self.user_id
        ).first()
        return submission.id if submission else None

    @database_sync_to_async
    def get_user_id(self, token):
        """
        Get User id from access token
        """
        User = get_user_model()
        try:
            # Verify the token (this will depend on your exact JWT setup)
            payload = jwt.decode(token, options={"verify_signature": False})
            user = User.objects.get(username=payload["preferred_username"])
            return user.id
        except jwt.ExpiredSignatureError:
            return None
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return None

    @database_sync_to_async
    def check_user_authorization(self, user_id, exercise_id) -> bool:
        """
        Check whether a user is a teacher or a tutor on an exercise's course
        """
        User = get_user_model()

        exercise = Exercise.objects.get(id=exercise_id)
        user = User.objects.get(id=user_id)

        course = exercise.session.course
        course_teachers = list(course.owners.all()) + list(course.tutors.all())

        return user in course_teachers
    
    @database_sync_to_async
    def prepare_submission_message(self, submission_id, with_test_results=False):
        return prepare_submission_message(
            submission_id, with_test_results=with_test_results
        )
