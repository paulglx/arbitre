from runner.models import Submission

"""
Refresh grades on all submissions

> python manage.py runscript refresh-grades
"""

def run(*args):
    print("Refreshing the grade on all submissions...")

    submissions = Submission.objects.all()
    for s in submissions:
        s.refresh_grade()

    print("Done")
