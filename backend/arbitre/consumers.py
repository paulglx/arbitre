from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from runner.models import Submission
from .util import prepare_submission_message
import json
import jwt


class SubmissionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.exercise_id = self.scope["url_route"]["kwargs"]["exercise_id"]

        token = self.scope["query_string"].decode("utf-8").split("=")[1]
        self.user_id = await self.get_user_id(token)
        self.submission_group_name = f"submission_{self.exercise_id}_{self.user_id}"

        # Get the submission ID
        self.submission_id = await self.get_submission_id()

        # Join submission group
        await self.channel_layer.group_add(
            self.submission_group_name, self.channel_name
        )

        await self.accept()

        # Prepare the submission message
        message = await self.prepare_submission_message(self.submission_id)

        # Send the submission message
        await self.send(text_data=json.dumps(message))

    async def disconnect(self, code):
        # Leave submission group
        await self.channel_layer.group_discard(
            self.submission_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
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
    def prepare_submission_message(self, submission_id):
        return prepare_submission_message(submission_id)
