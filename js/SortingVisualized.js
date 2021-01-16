// Samuel Guilbeault
// ICS4U - 1
// Ms. Valentina Hideg
// 23 May 2019

class SortingVisualized {
  constructor(displayDiv, menuDiv) {
    this.disp = new Display(displayDiv)
    this.selectedAlgorithm = this.bubbleSort

    //SET UP DISPLAY//
    this.arrays = [
      []
    ];
    let columnCount = 16

    //create columns
    for (let i = 0; i < columnCount; i++) {
      // this.arrays[0].push(new Column(i, Math.random() * 0.95 + 0.05)); //random steps
      this.arrays[0].push(new Column(i, (i + 1.0) / columnCount)); //uniform steps

      this.disp.addColumn(this.arrays[0][i]);
    }

    this.disp.redraw()

    //SET UP MENU//
    $("#sorting_visualized-menu-wrapper").on("contextmenu", function() { //disable right click on menu
      console.log("in")
      return false
    });

    let algorithms = [{ //define algorithm abjects
        a: this.bubbleSort,
        d: "Bubble",
        s: "Sort"
      },
      {
        a: this.selectionSort,
        d: "Selection",
        s: "Sort"
      },
      {
        a: this.insertionSort,
        d: "Insertion",
        s: "Sort"
      },
      {
        a: this.mergeSort,
        d: "Merge",
        s: "Sort"
      },
      {
        a: this.quickSort,
        d: "Quick",
        s: "Sort"
      },
      // {
      //   a: function() {},
      //   d: "Linear",
      //   s: "Search"
      // },
      // {
      //   a: function() {},
      //   d: "Binary",
      //   s: "Search"
      // },
    ]

    //DROPDOWN FUNCTIONALITY//
    let ddButton = menuDiv.find("#menu-dropdown")
    let alg = menuDiv.find("#alg_name")
    let algWrapper = menuDiv.find("#alg_name-wrapper")
    let dropdownList = menuDiv.find("#dropdown-options")

    for (let i of algorithms) { // create dropdown options
      let p = $("<p>" + i.d + " " + i.s + "</p>")

      p.click(() => { //dropdown option funcitonality
        alg.html("<b>" + i.d + "</b>" + i.s);
        this.selectedAlgorithm = i.a
        $(":root").get(0).style.setProperty("--width", alg.width() + "px")
      })

      dropdownList.append(p) //add option to list
    }

    let scale = function() { //manages scale of title wrt currently selected
      let max = alg.width();
      for (let i of dropdownList.children()) { //find largest width between currently selected and options
        let child = $(i);
        child.css("display", "inline-block")
        if (child.width() > max) max = child.width();
        child.css("display", "block")
      }

      //set css variables for class animations
      $(":root").get(0).style.setProperty("--width", alg.width() + "px")
      $(":root").get(0).style.setProperty("--maxwidth", max + "px")
    }

    $(window).bind("resize", scale); //remanage title size on window scale

    ddButton.click(() => { //expand and shirnk dropdown menu
      if (dropdownList.css("display") == "none") {
        dropdownList.css("display", "block")
        scale();
        algWrapper.addClass("expanded")

      } else {
        dropdownList.css("display", "none")
        algWrapper.removeClass("expanded")
      }
    })

    scale(); //initial scale

    //SORT BUTTON//
    let sortButton = menuDiv.find("#sort")
    sortButton.click(async () => { //functionality
      if (sortButton.hasClass("disabled") == false) {
        shuffleButton.addClass("disabled")
        sortButton.addClass("disabled")
        await this.selectedAlgorithm();
        shuffleButton.removeClass("disabled")
        sortButton.removeClass("disabled")
      }
    })

    //SHUFFLE BUTTON//
    let shuffleButton = menuDiv.find("#shuffle")

    shuffleButton.click(async () => { //functionality
      if (shuffleButton.hasClass("disabled") == false) {
        shuffleButton.addClass("disabled")
        sortButton.addClass("disabled")
        await this.shuffle();
        shuffleButton.removeClass("disabled")
        sortButton.removeClass("disabled")
      }
    })

    shuffleButton.on("contextmenu", () => { //disable right click and funcitonality
      let f = async function(r) {
        if (shuffleButton.hasClass("disabled") == false) { //async function to return false immediately but still await properly
          shuffleButton.addClass("disabled")
          sortButton.addClass("disabled")
          await r.sort();
          shuffleButton.removeClass("disabled")
          sortButton.removeClass("disabled")
        }
      }
      f(this); //asynchronous thread
      return false;
    })

    //SPEED SLIDER//
    let speedSlider = menuDiv.find("#speed")
    let speedDisp = menuDiv.find("#speedDisp")
    let x = this.disp //so that this can be used inside slider click function

    speedSlider.on("input", function() { //functionality
      if (this.value == 101) { //furthest right position
        x.speed = Infinity;
        speedDisp.text("max")
      } else { //other positions
        x.speed = (parseFloat(this.value) / 10)
        speedDisp.text(parseFloat(this.value) / 10 +
          ((parseFloat(this.value) % 10 == 0) ? ".0x" : "x")); //ensure integers have .0x suffix
      }
    })

    //THEME SWITCH//
    let darktoggle = menuDiv.find("#theme-switch input")
    darktoggle.click(() => { //functionality
      if (darktoggle.prop("checked")) {
        $(":root").addClass("darkTheme")

      } else {
        $(":root").removeClass("darkTheme")
      }
    })

    //HUE SLIDER//
    let hueSlider = menuDiv.find(".slider#hue")
    let parent = this;

    hueSlider.on("input", function() { //functionality
      $(":root").css("--hue", this.value); //set css variable to slider value
    })
  }

  //shuffles the first array of this.arrays
  async shuffle() {
    for (let i = this.arrays[0].length; i > 0; i--) {
      let rIndex = Math.floor(Math.random() * i)
      let temp = this.arrays[0][i - 1]
      this.arrays[0][i - 1] = this.arrays[0][rIndex]
      this.arrays[0][rIndex] = temp

    }
    await this.disp.animateTo(this.arrays, 0.4);
  }

  //sorts the first array of this.array without any particular algorithm
  async sort() {
    this.arrays[0].sort((a, b) => (a.value > b.value) ? 1 : -1)
    await this.disp.animateTo(this.arrays, 0.4);
  }

  //switches two column elements in any two arrays of this.arrays
  async swap(arr1, i1, arr2, i2, animate = true) {
    let temp = this.arrays[arr1][i1]
    this.arrays[arr1][i1] = this.arrays[arr2][i2]
    this.arrays[arr2][i2] = temp

    if (animate) await this.disp.animateTo(this.arrays)
  }

  //moves a column from i1 to be in position i2 within one array
  async move(arrNum, i1, i2, animate = true) {
    let temp = this.arrays[arrNum][i1]
    this.arrays[arrNum].splice(i2, 0, this.arrays[arrNum].splice(i1, 1)[0])
    if (animate) await this.disp.animateTo(this.arrays);
  }

  //does comparason aesthetics for columns
  async compare(...columns) {;
    let oldColors = []
    for (let col of columns) {
      oldColors.push(new HSLA_Color().copy(col.color_b))
      col.color_b.set(null, null, 0.9, 1)
    }

    await this.disp.animateTo(this.arrays);

    console.log(columns)
    console.log(oldColors)

    for (let i = 0; i < columns.length; i++) {
      columns[i].color_b.copy(oldColors[i]);
    }
  }

  //does marked as sorted aesthetic for column
  async markAsSorted(column, animate = true) {
    if (column == null) return
    column.resetCol().set(null, 0, null, 0.5)
    column.color_b.set(null, 0, null, 0.5)
    if (animate) await this.disp.animateTo(this.arrays, 0.12);
  }

  //does marked as interest aesthetic for column
  async mark(animate = true, ...columns) {
    for (let col of columns) col.mark = 1;
    if (animate) await this.disp.animateTo(this.arrays);
  }

  //removes marks as interest aesthetic from columns
  async unmark(animate = true, ...columns) {
    for (let col of columns) col.mark = 0;
    if (animate) await this.disp.animateTo(this.arrays);
  }

  //adds a new array to this.arrays and manages animation
  async addArray(animate = true) {
    let array = []
    for (let i = 0; i < this.disp.columnCount; i++) array.push(null)
    this.arrays.push(array);
    if (animate) await this.disp.animateTo(this.arrays)
  }

  //forces animates columns to new positions
  async forceAnimate(s = 0.2) {
    await this.disp.animateTo(this.arrays, s);
  }

  //bubble sort sorting algortihm with animations incorporated
  async bubbleSort() {
    let swapped;
    let array = this.arrays[0]
    let counter = 0

    do {
      swapped = false
      for (let i = 0; i < array.length - 1 - counter; i++) {
        await this.compare(array[i], array[i + 1]);
        if (array[i].value > array[i + 1].value) { // check for inversion
          swapped = true;
          await this.swap(0, i, 0, i + 1)
        }
      }

      await this.markAsSorted(array[array.length - counter - 1])
      counter += 1;

    } while (swapped && counter < array.length - 1) //end early if no inversions made

    for (let col of array) this.markAsSorted(col, false) //mark whole array as sorted
    await this.forceAnimate();

    await this.disp.wave()
  }

  //bubble sort sorting algortihm with animations incorporated
  async selectionSort() {
    let array = this.arrays[0]

    for (let i = 0; i < array.length - 1; i++) {
      let min = i; //index if smallest item

      for (let j = i + 1; j < array.length; j++) { //iterate over remaining unsorted array to find smallest item

        this.mark(false, array[min])
        await this.compare(array[j])

        if (array[j].value < array[min].value) { //if new element is sorted
          array[min].resetCol()
          this.unmark(false, array[min])
          this.mark(false, array[j])
          min = j
        }

      }

      if (i != min) { //check if swap is necessary
        this.unmark(false, array[min])
        await this.swap(0, i, 0, min)
      } else {
        await this.unmark(true, array[min])
      }


      if (i == array.length - 2) this.markAsSorted(array[i + 1], false) //check if last iteration
      await this.markAsSorted(array[i])
    }

    await this.disp.wave()

  }

  //insertion sort sorting algortihm with animations incorporated
  async insertionSort() {
    let array = this.arrays[0]

    await this.markAsSorted(array[0]) //mark first element of array as sorted

    for (let i = 1; i < array.length; i++) { //for each index remaining to be sorted

      let j;
      for (j = 0; j < i; j++) { //iterates through sorted portion of array
        await this.compare(array[i], array[j]) //compare animation
        if (array[i].value < array[j].value) { //insert column at new location
          this.move(0, i, j, false)
          break
        }
      }

      await this.markAsSorted(array[j])
    }

    await this.disp.wave();
  }

  //quick sort sorting algortihm with animations incorporated
  async quickSort(bounds = null) {
    let top = false
    if (bounds == null) { //if first level
      bounds = [0, this.arrays[0].length];
      top = true;
    }

    if (bounds[1] - bounds[0] <= 1) { //if length 1 or empty array (base case)
      if (bounds[1] - bounds[0] == 1) { //if length 1
        await this.markAsSorted(this.arrays[0][bounds[0]])
      }
      return;
    }

    let pivot = bounds[0]
    let left = 1 + bounds[0]

    await this.mark(true, this.arrays[0][pivot])

    for (let i = 1 + bounds[0]; i < bounds[1]; i++) { //sort by left-right
      await this.compare(this.arrays[0][i], this.arrays[0][pivot])

      if (this.arrays[0][i].value < this.arrays[0][pivot].value) {
        if (i != left) {
          await this.swap(0, i, 0, left)
        }

        left++;
      }
    }

    //sorts pivot
    this.unmark(false, this.arrays[0][pivot])
    this.markAsSorted(this.arrays[0][pivot])
    await this.swap(0, pivot, 0, left - 1)

    if ((left - 1) - bounds[0] > 1) { //hides out-of-focus elements
      for (let i = left; i < bounds[1]; i++) {
        this.arrays[0][i].color.set(null, null, null, 0.25)
        this.arrays[0][i].color_b.set(null, null, null, 0.25)
      }

      await this.forceAnimate();
    }

    await this.quickSort([bounds[0], left - 1]) //left recursion

    if ((left - 1) - bounds[0] > 1) { //unhides elements
      for (let i = left; i < bounds[1]; i++) {
        this.arrays[0][i].color.set(null, null, null, 1)
        this.arrays[0][i].color_b.set(null, null, null, 1)
      }

      await this.forceAnimate();
    }

    await this.quickSort([left, bounds[1]]) //right recursion

    if (top) { //end wave if in top call
      await this.disp.wave();
    }
  }

  //merge sort sorting algortihm with animations incorporated
  async mergeSort(bounds = null) {
    //create second array
    if (this.arrays.length < 2) {
      await this.addArray()
    }

    //set bounds of first depth
    let top = false;
    if (bounds == null) {
      bounds = [0, this.arrays[0].length]
      top = true;
    }

    //base case
    if (bounds[1] - bounds[0] <= 1) {
      return
    }

    let head2 = bounds[0] + Math.ceil((bounds[1] - bounds[0]) / 2)
    await this.mergeSort([bounds[0], head2]) //left recursion
    await this.mergeSort([head2, bounds[1]]) //right recursion

    //move all relevant elements to copied arrays
    for (let i = bounds[0]; i < bounds[1]; i++) {
      this.swap(0, i, 1, i, false)
    }
    await this.forceAnimate();

    //find array heads
    let a = bounds[0]
    let b = head2

    //sorts
    for (let i = bounds[0]; i < bounds[1]; i++) {
      if (a < head2 && b < bounds[1]) {
        if (this.arrays[1][a].value < this.arrays[1][b].value) {
          if (top) this.markAsSorted(this.arrays[1][a]);
          await this.swap(1, a, 0, i)
          a++
        } else {
          if (top) this.markAsSorted(this.arrays[1][b]);
          await this.swap(1, b, 0, i)
          b++
        }
      } else if (a < head2) {
        if (top) this.markAsSorted(this.arrays[1][a]);
        await this.swap(1, a, 0, i)
        a++
      } else {
        if (top) this.markAsSorted(this.arrays[1][b]);
        await this.swap(1, b, 0, i)
        b++
      }
    }

    //end of first call
    if (top) {
      this.arrays.pop()
      await this.forceAnimate()
      await this.disp.wave()
    }

  }
}