Project 2, Group 1

Group Members:

Tianyue Yang, Corey Anderson, Riley Williamson, Abdellah Hady, Jennifer Gaddie

Description: 
		
We propose to build an interactive website that is useful to bootcampers looking for a job in Data Science/Analytics. Our data source begins with a collection of tables from the ETL Project, consisting of five layers: ds_jobs, salary, breweries, and state_boundary. All records have a state ID. Here we propose to build a dynamic front-end for job seekers to map and make figures that will be useful when searching for a job. Some records (such as brewery locations) also have coordinates to map their locations within the states.

We will use Bootstrap CSS and JavaScript with the D3.js and Leaflet libraries to make interactive maps and figures.

The showcase piece will be a Leaflet map of the United States with the polygons representing state boundaries. The color fill changes based on the data source, and the user can hover over the state to get useful summary statistics.

We will have pages with useful summary figures. A page may include states with the most jobs or where the pay is the highest, simple bar plots, and another more artistic floating bubble plot (where the user can change the data.)

Potential challenges:

The polygon files used to plot in geopandas may not be useful in Leaflet, so some extra steps are required to make this functional (but it is feasible).
There are many data layers (and columns in several of the tables). We need to consider the best way to read in all the data and then read it via D3.js.
Some columns may need to be dropped to make the plotting options simpler.


Sketch of final design: Use HTML/CSS/JAVASCRIPT (plotly, D3, leaflet)

Home Page
Will include basic information about the project, teaser pictures, navigation, team info.

Basic Charts
Summary level non-interactive charts for the available data set appear here.
One interactive “fancy” plot is included as well.

D3/leaflet
The interactive map shows job posting information per state. Hover over the state offers a breakdown of the data (housing price, jobs by title, salary, etc.)
Multiple layers for the map (salary, where job posted, brewery location, etc. detail are to be determined.)

