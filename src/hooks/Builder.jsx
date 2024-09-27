class Builder {
  constructor() {
  }

  name;
  desc;
  elementList;
  isRandom = false;
  isDraggable = false;
  timer;

  setName(name) {
    this.name = name;
  }

  setDesc(desc) {
    this.desc = desc;
  }

  setRandom(bool) {
    if (bool === true) {
      this.isRandom = true
    }
  }

  setDraggable(bool) {
    if (bool === true) {
      this.isDraggable = true;
    }
  }

  setElements(Component, obj) {
    const listElements = obj.map(element =>
      <Component key={obj.indexOf(element)} value={element} />
    );

    this.elementList = listElements;
  }

  render() {
    return (
      <div className={classes.container}>
        <h1>{this.name}</h1>
        <p>{this.description}</p>
        {this.isDraggable && <DropBox />}
        <div className={classes.numberGrid}>
          {this.isRandom ? random(this.elementList) : this.elementList}
        </div>
      </div>
    )
  }
}
