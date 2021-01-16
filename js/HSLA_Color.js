class HSLA_Color {

  constructor(h = 0, s = 1, l = 0.5, a = 1) {
    this.h = h
    this.s = s
    this.l = l
    this.a = a
  }

  get_raw() {
    return [this.h, this.s, this.l, this.a]
  }

  set(h = null, s = null, l = null, a = null) {
    if (h != null) this.h = h;
    if (s != null) this.s = s;
    if (l != null) this.l = l;
    if (a != null) this.a = a;
  }

  toString() {
    return "hsla(" + "var(--hue)" + "," + this.s * 100 + "%," + this.l * 100 + "%," + this.a + ")"
  }

  copy(color) {
    this.h = color.h;
    this.l = color.l;
    this.s = color.s;
    this.a = color.a;
    return this;
  }

  static crossfade(c1, c2, pct) {
    return new HSLA_Color(
      c2.h + (c1.h - c2.h) * pct,
      c2.s + (c1.s - c2.s) * pct,
      c2.l + (c1.l - c2.l) * pct,
      c2.a + (c1.a - c2.a) * pct,
    );
  }
}