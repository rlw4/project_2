Project 2: Group 1

Data Science Job Search

<strong> Group Members: Tianyue Yang, Corey Anderson, and Jennifer Gaddie </strong>

(Riley Williamson also contributed to the early stages of this project.)

<h6>Description:</h6> 

Our goal was to build a simple Flask app for data science nerds looking for a job.

The data are from ETL Project T7 (https://github.com/coreydevinanderson/ETL_project_T7) and were stored as a PostgreSQL database with five tables: ds_jobs (job listings), salary (hourly and annual), breweries, and state_boundary. All records have a state ID and breweries also have lat/lon coordinates. We have included the table schema and source comma delimited files (see: /postgres_tables) to rebuild the SQL database; further details on data sources and cleaning procedures for the tables can be found in the ETL_project_T7 repository.

For the current project, the showcase piece is a dynamic and fully-featured 'Leaflet' map of the US States with two base layers (Street and Satellite), a choropleth map indicating job counts (by state). Howevering on the state produces a side panel with demographic, job, and brewery data for each state; clicking on the state zooms in and changes the view extent to emphasize the state. There is an additional point theme layer for the breweries with an information panel (including url) when clicked.

In addition to the map, we have also included a job-themed wordcloud (via the d3-cloud javascript plugin) based on the ds_jobs table (with wordclouds for different columns in the table: category/Sector, company_name, city, and state). For the wordcloud, font size was scaled to range between 10 and 90 based the max and min of the count array. At the present time, the wordcloud shows the top 50 (with 48 words  for states because there were not jobs in all US states). Below, a Plotly bar plot highlights the top 10 with a hover tip giving the relative frequency of each category (out of the total number of samples).

All other componenets of the website were built with Bootstrap 5.0 CSS.

Website:

templates/

"DataScienceJobs": Landing page with carousel             
index.html

"About US": Author information on cards             
about_us.html 

"Data Pages":

"Job Cloud":    
job_cloud.html
                         
"Interactive Map"                   
interactive_map.html

"I wouldn't/You did anyway"     
nostalgia.html

static/css/     
style.css

static/js/   
config.js   
data.js 
map.js  
word_cloud.js

images/(see .html for pictures that were chosen)

app.py
Flask app w/ pandas, numpy, and sqlalchemy


