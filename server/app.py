from flask import Flask, request, jsonify
from flask_cors import CORS
from  data import locationMap
import os, json

app = Flask(__name__)
CORS(app)

@app.route("/search", methods=["GET"])
def return_Locations():
    query = request.args.get("q", "").strip().lower()
    if not query or query == "":
        return jsonify([])

    matches = [city for city in locationMap if query in city["name"].lower()][:5]
    return jsonify(matches)

@app.route("/get_initial_page", methods=["GET"])
def return_Initial_Page():
    query_location = request.args.get("l", "").strip()
    if not query_location or query_location == "":
        return jsonify([])

    query_property_type = request.args.get("pt", "").strip()
    if not query_property_type or query_property_type == "":
        return jsonify([])

    query_transaction_type = request.args.get("t", "").strip()
    if not query_transaction_type or query_transaction_type == "":
        return jsonify([])

    relative_path = os.path.join("static", "testing_mode", query_transaction_type, query_property_type, query_location)
    path = os.path.join(app.root_path, relative_path)

    if not os.path.exists(path):
        return jsonify({"data": [], "pages": 0})

    json_files = [f for f in os.listdir(path) if f.endswith('.json')]
    json_count = len(json_files)

    first_json_path = os.path.join(path, "1.json")
    first_json_data = {}

    if "1.json" in json_files:
        with open(first_json_path, "r", encoding="utf-8") as file:
            first_json_data = json.load(file)

    if 'nsrResultList' in first_json_data and first_json_data['nsrResultList'] is not None:
        result_list = first_json_data.get("resultList", [])
        nsr_result_list = first_json_data.get("nsrResultList", [])

        results = result_list + nsr_result_list
    else:
        results = first_json_data.get("resultList", [])

    return jsonify({"data": results, "pages": json_count})

@app.route("/get_page", methods=["GET"])
def return_Page():
    query_location = request.args.get("l", "").strip()
    if not query_location or query_location == "":
        return jsonify([])

    query_property_type = request.args.get("pt", "").strip()
    if not query_property_type or query_property_type == "":
        return jsonify([])

    query_transaction_type = request.args.get("t", "").strip()
    if not query_transaction_type or query_transaction_type == "":
        return jsonify([])

    query_page = request.args.get("k", "").strip()
    if not query_page or query_page == "":
        return jsonify([])

    if not all([query_location, query_property_type, query_transaction_type, query_page]):
        return jsonify({"error": "Missing parameters"}), 400

    relative_path = os.path.join("static", "testing_mode", query_transaction_type, query_property_type, query_location)
    path = os.path.join(app.root_path, relative_path)

    if not os.path.exists(path):
        return jsonify({"data": [], "pages": 0})

    json_files = sorted([f for f in os.listdir(path) if f.endswith(".json")])
    json_count = len(json_files)

    query_json_path = os.path.join(path, f"{query_page}.json")
    if f"{query_page}.json" not in json_files:
        return jsonify({"error": "Requested page not found", "pages": json_count}), 404

    with open(query_json_path, "r", encoding="utf-8") as file:
        query_json_data = json.load(file)

    if 'nsrResultList' in query_json_data and query_json_data['nsrResultList'] is not None:
        result_list = query_json_data.get("resultList", [])
        nsr_result_list = query_json_data.get("nsrResultList", [])

        results = result_list + nsr_result_list
    else:
        results = query_json_data.get("resultList", [])

    return jsonify({"data": results, "pages": json_count})


