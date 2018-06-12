class Square {
  constructor(value) {
    this.value = value
    this.marked = false
    this.character
  }
  get mark(){
    if (this.marked) {
      return this.character
    }
    return '?'
  }
  set mark(character){
    if (!this.marked) {
      this.character = character
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