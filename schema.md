# ---------- ROADS (Дороги)

## Polygon schema

* "type": "Feature"
* "id": 0
* "geometryType": "Point"
* "geometryCoordinates": [55.831903, 37.411961]
* "balloonContent": "Содержимое балуна"
* "clusterCaption": "Метка с iconContent"
* "hintContent": "Текст подсказки"
* "iconContent": "1"
* "iconColor": "#ff0000"
* "preset": "islands#blueCircleIcon"

* fillColor: 
* strokeColor: string
* strokeWidth: integer
* strokeOpacity: floa
* coordinates
* count_of_bands: integer
* input_stream: integer
* output_stream: integer

**create** : "create table roads(start_coordinate float[][], end_coordinate float[][], count_of_bands integer, input_stream integer, output_stream integer);"

# ---------- DIRECTION (Направления) Создаются при создании перекрестка

## schema
* start_road_id: integer
* end_road_id: integer
* traffic_light_id: integer

# ---------- TRAFFIC LIGHT (Светофор) 

