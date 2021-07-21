import numpy as np
import pandas as pd
import json

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template


password_1 = "postgres"
password_2 = "superuser"
database_path = f"postgresql://{password_1}:{password_2}@localhost:5432/DataScienceJob"

engine = create_engine(database_path)
connection = engine.connect()

######

app = Flask(__name__)

@app.route('/index.html')
def welcome():
    return render_template('index.html')
@app.route('/about_us.html')
def aboutus():
    return render_template('about_us.html')
@app.route('/job_cloud.html')
def job_cloud():
    return render_template('job_cloud.html')
#Tianyue added interactive map route
@app.route('/interactive_map.html')
def interactive_map():
    return render_template('interactive_map.html')

@app.route('/housing')
def housing():
    # Create session (link) from Python to the DB
    housing_df = pd.read_sql("SELECT * FROM housing", connection)
    housing_json = housing_df.to_json(orient = "records")
    return housing_json

@app.route('/ds_jobs')
def ds_jobs():
    ds_jobs_df = pd.read_sql("SELECT * FROM ds_jobs", connection)
    ds_jobs_df.drop(columns = ["salary_offered"], inplace = True)
    ds_jobs_json = ds_jobs_df.to_json(orient = "records")
    return ds_jobs_json

@app.route('/breweries')
def breweries():
    breweries_df = pd.read_sql("SELECT * FROM breweries", connection)
    breweries_json = breweries_df.to_json(orient = "records")
    return breweries_json

@app.route('/salary')
def salary():
    salary_df = pd.read_sql("SELECT * FROM salary", connection)
    salary_df.replace("Database Administrators and Architects", "Data Engineer", inplace = True)
    salary_df.replace("Data Scientists and Mathematical Science Occupations, All Other", "Data Scientist", inplace = True)
    salary_json = salary_df.to_json(orient = "records")
    return salary_json

@app.route('/state_boundary')
def state_boundary():
    state_boundary_df = pd.read_sql("SELECT * FROM state_boundary", connection)
    state_boundary_json = state_boundary_df.to_json(orient = "records")
    return state_boundary_json

if __name__ == '__main__':
    app.run(debug=True)

