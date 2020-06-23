### Purpose of this analysis:
The purpose of this project is to creates a tool that will allow people to visualize the United States Geological Survey's (USGS) earthquake data. They collect a massive amount of data from all over the world each day, and this app will probide a meaningful way of displaying it to educate the public on issues facing our planet. Specifically, it will provide maps that display plate boundaries and information on recent earthquakes, so people can visualize where earthquakes are most likely to occur.

---

### How to run the code:
**First Option**
1. Save all files of repository (except the files in the screenshots folder) to a folder on your computer.
1. Open your terminal.
1. cd into the folder your saved the files in.
1. Run the command “python -m http.server”.
1. Copy the server listed in the response (ex. http://0.0.0.0:8000/)
1. Paste the server in your browser OR type "localhost:8000" in your browser.
1. Pick and choose which type of map and which layers on the map you want to view.
<!-- end of List -->
**Second Option:**
1. View the webpage from Github Pages at: [https://sfroonjian.github.io/leaflet-challenge/](https://sfroonjian.github.io/leaflet-challenge/)

---

### Data collected:
![](screenshots/screenshot1.png)
![](screenshots/screenshot2.png)

---

### Why the data is displayed this way:
The data is displayed in a map since the purpose of this project is to illustrate the locations of recent earthquakes. The circles that were plotted to show the locations vary in size and color to indicate the earthquake's magnitude. The larger and more red the circle is, the greater the magnitude. There is also a legend to show you what magnitude range each color represents. Users can click on each circle to learn more about the earthquake, such as the exact location and magnitude of it. Users can also click to have another layer display on the map that shows all the fault lines. By doing so, users can clearly see how most earthquakes occur along fault lines. Lastly, users can choose the type of map they want to view so that they can view the data with various contrasting backgrounds.
