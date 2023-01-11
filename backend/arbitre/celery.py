from celery import Celery
from celery.schedules import crontab
import os
from arbitre.tasks import run_all_pending_testresults

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "arbitre.settings")

app = Celery("arbitre")

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Load task modules from all registered Django apps.
app.autodiscover_tasks()


@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):

    # Executes every 15 minutes
    sender.add_periodic_task(
        crontab(minute="*/5"),
        run_all_pending_testresults.s(),
    )
