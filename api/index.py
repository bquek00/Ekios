from flask import Flask, request
#from supabase import create_client
app = Flask(__name__)

#supabase = create_client("https://rnecpulvomnhbbfxzton.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZWNwdWx2b21uaGJiZnh6dG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MzU5ODEsImV4cCI6MjAzNzQxMTk4MX0.pDLh_1qB_Ve2-bgFLjt1xxMarAs42yXtqKCtsJX545E")

@app.route("/api") # should return the api doc
def api_doc():
    return "<p>Hello, World!</p>"

@app.route("/api/stock-list")
def stock_list():
    return ["ibm", "msft", "tsla", "race"]

# @app.route("/api/orders", methods=["POST"])
# def submit_order():
    # data = supabase.auth.get_user()
    # print(data)
    # if not data:
    #     return {"error": "Unauthorized"}, 401
    # payload = request.json
    # print(f"payload: {payload}")
    # response = (
    #     supabase.table("orders")
    #     .insert({"uid": data.id, **payload})
    #     .execute()
    # )
    # print(f"response: {response}")

# @app.route("api/stocks/<stock_name>")
# def get_stock_data():
