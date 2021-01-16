class Display {

  static FPS = 60.0;

  constructor(div) {
    this.frame = div;
    this.arrays = [
      []
    ]
    this.column_count = 0;
    this.speed = 1
    // this.rainbow()
  }

  addColumn(column) {
    column.DOM = $("<div class='column'></div>")
    column.pos = this.arrays[0].length
    column.pos0 = this.arrays[0].length
    column.array_num0 = 0
    this.arrays[0].push(column)
    this.column_count += 1;
  }

  redraw(pct = 1) {

    let c_width = 100.0 / this.arrays[0].length;

    for (let i = 0; i < this.arrays[0].length; i++) {

      this.arrays[0][i].DOM.css("width", c_width * 0.90 + "%");
      this.arrays[0][i].DOM.css("margin-left", c_width * 0.05 + "%");
      this.arrays[0][i].DOM.css("margin-right", c_width * 0.05 + "%");
      this.arrays[0][i].DOM.css("height",
        99.75 * this.arrays[0][i].value + "%");
      this.arrays[0][i].DOM.css("bottom", "0.25%")

      let offset = (this.arrays[0][i].pos - this.arrays[0][i].pos0) * pct;
      this.arrays[0][i].DOM.css("left", c_width * (this.arrays[0][i].pos0 + offset) + "%");

      this.arrays[0][i].DOM.css("background-color",
        "" + HSLA_Color.crossfade(this.arrays[0][i].color, this.arrays[0][i].color0, pct));

      // if (this.arrays[0][i].col != this.arrays[0][i].col2) console.log(RGBA_Color.crossfade(this.arrays[0][i].col, this.arrays[0][i].col2, pct).toString())


      if (this.arrays[0][i].pos == this.arrays[0][i].pos2 || pct == 1) {
        this.frame.prepend(this.arrays[0][i].DOM);
      } else {
        // this.arrays[0][i].DOM.css("background-color", "#6a7afc");
        this.frame.append(this.arrays[0][i].DOM);
      }
    }
  }

  async animateTo(arrays, s = 0.2) {
    let frameLength = 1000.0 / Display.FPS;

    //sense changes in positions
    for (let arr_num = 0; arr_num < arrays.length; arr_num++) {
      for (let i = 0; i < arrays[arr_num].length; i++) {
        if (arrays[arr_num][i] != null) {
          arrays[arr_num][i].pos = i;
          arrays[arr_num][i].arr_num = arr_num;
        }
      }
    }

    let animation_progress = 0;
    let f = x => { //function which defines easing of animation
      let y = 2;
      if (x <= 0.5) {
        return Math.pow(2, y - 1) * Math.pow(x, y)
      } else {
        return -1 * Math.pow(2, y - 1) * Math.pow(x - 1, y) + 1
      }
    }
    let interpolate = (v0, v, pct) => v0 + (v - v0) * pct;
    let c_width = 100.0 / this.column_count;

    //animation logic
    while (animation_progress < 1) {

      //advances animation
      animation_progress = Math.min(1,
        animation_progress + 1.0 / Display.FPS / s * this.speed);

      let pct = f(animation_progress)

      for (let array of arrays) {
        for (let column of array) {
          if (column != null) {
            //color
            column.updateColor(pct);

            //x pos
            column.DOM.css("left",
              interpolate(column.pos0, column.pos, pct) * c_width + "%");

            //y pos
            column.DOM.css("bottom",
              //height from array
              (interpolate(column.arr_num0, column.arr_num, pct) * 100.0 +
                //height from mark
                4.0 * interpolate(column.mark0, column.mark, pct)) /

              interpolate(this.arrays.length, arrays.length, pct) + "%");

            //height
            column.DOM.css("height",
              99.0 * column.value /
              interpolate(this.arrays.length, arrays.length, pct) +
              "%");
          }
        }
      }

      if (animation_progress < 1) {
        await wait(frameLength);
      } else {
        await wait(0);
      }
    }

    //save changes
    for (let array of arrays) {
      for (let column of array) {
        if (column != null) {
          column.pos0 = column.pos;
          column.arr_num0 = column.arr_num;
          column.mark0 = column.mark;
          column.color0.copy(column.color);
          column.color_b0.copy(column.color_b);
        }
      }
    }
    this.arrays = Array.from(arrays);
  }

  async wave(s = 0.6, ws = 0.4) {
    let frameLength = 1000.0 / Display.FPS;
    let pct = x => {
      if (x > 1) return 0;
      if (x < 0) return 0;
      return -1 * Math.cos(x * 2 * Math.PI) * 0.5 + 0.5;
    }

    for (let array of this.arrays) {
      for (let column of array) {
        if (column != null) {
          column.resetCol();
        }
      }
    }

    let animation_progress = 0;
    while (animation_progress < 1) {

      animation_progress = Math.min(1, animation_progress + 1.0 / Display.FPS / s * this.speed); //advances animation

      for (let i = 0; i < this.arrays[0].length; i++) {
        let start_time = (s - ws) * ((i + 1) / this.arrays[0].length)
        let percent = pct((animation_progress * s - start_time) / ws)
        this.arrays[0][i].DOM.css("bottom", percent * this.frame.height() * 0.1);

        let percent2 = (animation_progress * s - start_time) / ws
        if (percent2 > 1) percent2 = 1
        if (percent2 < 0) percent2 = 0
        this.arrays[0][i].updateColor(percent2)
      }


      if (animation_progress < 1) await wait(frameLength);
    }

    //reset colors
    for (let column of this.arrays[0]) {
      column.color0.copy(column.color);
      column.color_b0.copy(column.color_b);
    }
  }

  async rainbow() {
    while (1 == 1) {
      hue += 1
      for (let i of this.arrays[0]) {
        i.color.h = hue
        i.color0.h = hue
        i.DOM.css("background-color",
          "" + i.color);
      }
      await wait(frameLength)
    }
  }
}