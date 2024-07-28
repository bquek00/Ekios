from flask import Flask
app = Flask(__name__)

@app.route("/api") # should return the api doc
def api_doc():
    return "<p>Hello, World!</p>"

@app.route("/api/stock-list")
def stock_list():
    return ["ibm", "msft", "tsla", "race"]