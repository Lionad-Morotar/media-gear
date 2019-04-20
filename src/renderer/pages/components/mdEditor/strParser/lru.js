/** Constructor */

function LRU (limit) {
  this.headNode = new Node({ key: '__head__', data: { val: null, weight: Number.MAX_VALUE } })
  this.tailNode = new Node({ key: '__tail__', data: { val: null, weight: Number.MIN_VALUE } })
  this.headNode.linkNext(this.tailNode)
  this.nodeMemo = {}
  this.nodeLength = 0
  this.memoCountLimit = limit || 999
}
function Node (config) {
  this.key = config.key
  this.prev = null
  this.next = null
  this.data = config.data || {
    val: null,
    weight: 1
  }
}

/** Node prototype */

Node.prototype.linkPrev = function (prevNode) {
  prevNode.linkNext(this)
}
Node.prototype.linkNext = function (nextNode) {
  // TODO anti memo leak
  this.next = nextNode
  nextNode.prev = this
}

Node.prototype.insertAfter = function (prevNode) {
  const prevNextNode = prevNode.next
  prevNode.linkNext(this)
  this.linkNext(prevNextNode)
}

Node.prototype.unLink = function () {
  const prev = this.prev
  const next = this.next

  if (!prev || !next) {
    console.log(`Node : ${this.key} cant unlink`)
    return false
  }
  prev.linkNext(next)
}

/** LRU prototype */

LRU.prototype.get = function (key) {
  let handle = this.headNode
  while (handle.next) {
    handle = handle.next
    if (handle.key === key) {
      this.addNodeWeight(handle)
      return handle.data
    }
  }
  console.warn(`Key : ${key} is not fount in LRU Nodes`)
}

LRU.prototype.set = function (key, val) {
  const newNode = new Node({ key, data: { val, weight: 1 } })
  newNode.insertAfter(this.tailNode.prev)
}

LRU.prototype.showAllNode = function () {
  let next = this.headNode.next
  while (next) {
    console.log(`Node : ${next.key} has data ${next.data}`)
    next = next.next
  }
}
LRU.prototype.addNodeWeight = function (node, w = 1) {
  const handle = node
  let prev = handle.prev

  handle.unLink()
  handle.data.weight += w
  while (prev) {
    if (prev.data.weight <= handle.data.weight) {
      prev = prev.prev
    } else {
      handle.insertAfter(prev)
      prev = null
    }
  }
}

const mdLRU = new LRU()
mdLRU.set('1', 1)
mdLRU.set('2', 2)
mdLRU.set('3', 3)
mdLRU.set('4', 4)
mdLRU.set('5', 5)
mdLRU.get('5')
mdLRU.get('5')
mdLRU.get('3')
mdLRU.get('3')
mdLRU.get('3')
mdLRU.get('3')
mdLRU.set('1')
mdLRU.showAllNode()
