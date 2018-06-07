class Square {
  constructor(value) {
    this.value = value
    this.marked = false
  }
  get mark(){
    return this.marked
  }
  set mark(state){
    if (!this.marked) {
      this.marked = state
      return true
    }
    return false
  }
  get val(){
    return this.value
  }
}

module.exports = Square