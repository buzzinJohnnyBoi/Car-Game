class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  Add(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }
  Subtract(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }
  Multiply(vec) {
    this.x *= vec.x;
    this.y *= vec.y;
  }
  Divide(vec) {
    this.x /= vec.x;
    this.y /= vec.y;
  }
  Copy() {
    return new Vector2D(this.x, this.y);
  }

  static get Zero() {
    return new Vector2D(0, 0);
  }
  static Equals(a, b) {
    return (a.x == b.x) && (a.y == b.y);
  }

  static Add(vec1, vec2) {
    return new Vector2D(vec1.x + vec2.x, vec1.y + vec2.y);
  }
  static Subtract(vec1, vec2) {
    return new Vector2D(vec1.x - vec2.x, vec1.y - vec2.y);
  }
  static Multiply(vec1, vec2) {
    return new Vector2D(vec1.x * vec2.x, vec1.y * vec2.y);
  }
  static Divide(vec1, vec2) {
    return new Vector2D(vec1.x / vec2.x, vec1.y / vec2.y);
  }

  static Ceil(vec) {
    return new Vector2D(Math.ceil(vec.x), Math.ceil(vec.y));
  }
  static Floor(vec) {
    return new Vector2D(Math.floor(vec.x), Math.floor(vec.y));
  }
  static Magnitude(vec) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y));
  }
  static Normalize(vec) {
    let magnitude = Vector2D.Magnitude(vec);
    return new Vector2D(vec.x / magnitude, vec.y / magnitude);
  }
  static Distance(a, b) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }
}