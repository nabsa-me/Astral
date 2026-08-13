export class PointOfInterest {
  constructor({ id, cityId, name, coords, guideId }) {
    this.id = id;
    this.cityId = cityId;
    this.name = name;
    this.coords = coords;
    this.guideId = guideId;
  }
}
