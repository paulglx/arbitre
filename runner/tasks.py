import requests
from celery import shared_task

@shared_task()
def run_camisole(lang, source, tests):
    url = "http://oasis:1234/run"
    data = {
        "lang":lang,
        "source":source,
        "tests":tests
    }
    response = requests.post(url, json=data)
    return response

@shared_task()
def add(x,y):
    return x+y