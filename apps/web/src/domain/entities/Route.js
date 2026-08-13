export class Route {
  constructor({ id, cityId, name, description, from, to, coords, color, waypoints, guideId }) {
    this.id = id;
    this.cityId = cityId;
    this.name = name;
    this.description = description;
    this.from = from;
    this.to = to;
    this.coords = coords;
    this.color = color;
    this.waypoints = waypoints || [];
    this.guideId = guideId;
  }
}
