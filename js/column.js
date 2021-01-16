class Column {

  static hue = 0;

  constructor(id, value) {
    this.id = id;
    this.value = value;

    this.pos = null;
    this.pos0 = 0;

    this.color = new HSLA_Color(Column.hue, 1, 0.75);
    this.color0 = new HSLA_Color(Column.hue, 1, 0.75);

    this.color_b = new HSLA_Color(Column.hue, 1, 0.75);
    this.color_b0 = new HSLA_Color(Column.hue, 1, 0.75)

    this.arr_num = null
    this.arr_num0 = 0

    this.mark = 0
    this.mark0 = 0

    this.DOM = null
  }

  resetCol() {
    this.color.set(Column.hue, 1, 0.75, 1);
    this.color_b.set(Column.hue, 1, 0.75, 1);
    return this.color;
  }

  updateColor(pct) {
    this.DOM.css("background", "repeating-linear-gradient(0deg, " +
      HSLA_Color.crossfade(this.color_b, this.color_b0, pct) + " 0%, " +
      HSLA_Color.crossfade(this.color, this.color0, pct) + "75%," +
      HSLA_Color.crossfade(this.color, this.color0, pct) + "100%)")
  }
}