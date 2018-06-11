class Square {
  constructor(value) {
    this.value = value.toString()
    this.marked = false
  }
  get mark(){
    if (this.marked) {
      return this.value
    }
    return ' '
  }
  set mark(value){
    if (!this.marked) {
      this.value = value
      this.marked = true
      return true
    }
    return false
  }
  get val(){
    return this.value
  }
  get markedBool(){
    return this.marked
  }
}

module.exports = Square