import requests
from celery import Celery, shared_task

#app = Celery('arbitre', backend='redis://localhost:6379', broker='redis://localhost:6379')

#@app.task
@shared_task
def run_camisole(lang, source, tests):
    url = "http://oasis:1234/run"
    data = {
        "lang":lang,
        "source":source,
        "tests":tests
    }
    response = requests.post(url, json=data)
    return response

#@app.task
@shared_task
def add(x,y):
    return x+y
