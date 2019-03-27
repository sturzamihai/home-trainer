# -*- coding: utf-8 -*-

from flask import Flask
import platform, psutil, multiprocessing, json

app = Flask(__name__)

def get_specs():
    specs = {
        'os': platform.system(),
        'cpu': {
            'name': platform.processor(),
            'num': multiprocessing.cpu_count()
        },
        'memory': {
            'total': psutil.virtual_memory().total,
            'free': psutil.virtual_memory().available
        }
    }
    return specs

def get_metrics():
    with open('../metrics.json') as f:
        obj = json.loads(f.read())
    
    return obj

@app.route('/app/get')
def app_get():
    specs = get_specs()
    metrics = get_metrics()
    return json.dumps({
        'sys':specs,
        'model':metrics
        })

if __name__ == "__main__":
    app.run(port=3000)