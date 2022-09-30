from celery import Celery
import os

app = Celery(
    'runner',
    backend='amqp',
    broker='amqp://admin:admin@localhost:5672/myvhost',
    include=['runner.tasks']
)

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arbitre.settings')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

#app.conf.result_backend = 'redis://localhost:6379/0'

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

