/** LRU 链表实现 */

/** Constructor */

function LRU (limit) {
  this.headNode = new Node({ key: '__head__', data: { val: null, weight: Number.MAX_VALUE } })
  this.tailNode = new Node({ key: '__tail__', data: { val: null, weight: Number.MIN_VALUE } })
  this.headNode.linkNext(this.tailNode)
  this.nodeMemo = {}
  this.nodeLength = 0
  this.nodeLengthLimit = limit || 999
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
// 将当前节点的next指向另一节点 linkNextTo
Node.prototype.linkNext = function (nextNode) {
  // TODO anti memory leak
  this.next = nextNode
  nextNode.prev = this
}
// 将当前节点插入某一结点后 insertAfterNode
Node.prototype.insertAfter = function (prevNode) {
  const prevNextNode = prevNode.next
  prevNode.linkNext(this)
  this.linkNext(prevNextNode)
}
// 删除当前节点, 除非节点是头节点/尾节点
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

// 通过key判断缓存中是否有某元素
LRU.prototype.has = function (key) {
  return !!this.nodeMemo[key]
}
// 通过key获取缓存中某一元素值
LRU.prototype.get = function (key) {
  let handle = this.nodeMemo[key]
  if (handle) {
    this.addNodeWeight(handle)
    return handle.data.val
  } else {
    throw new Error(`Key : ${key} is not fount in LRU Nodes`)
  }
}
// 通过key获取缓存中某一元素权重
LRU.prototype.getNodeWeight = function (key) {
  let handle = this.nodeMemo[key]
  if (handle) {
    return handle.data.weight
  } else {
    throw new Error(`Key : ${key} is not fount in LRU Nodes`)
  }
}
// 添加新的缓存元素
LRU.prototype.set = function (key, val) {
  const handleNode = this.nodeMemo[key]
  if (handleNode) {
    this.addNodeWeight(handleNode, 10)
    handleNode.data.val = val
  } else {
    if (this.nodeLength < this.nodeLengthLimit) {
      this.nodeLength++
    } else {
      const deleteNode = this.tailNode.prev
      deleteNode.unLink()
      delete this.nodeMemo[deleteNode.key]
    }
    const newNode = new Node({ key, data: { val, weight: 1 } })
    this.nodeMemo[key] = newNode
    newNode.insertAfter(this.tailNode.prev)
  }
}
// 打印缓存中全部节点
LRU.prototype.showAllNodes = function () {
  let next = this.headNode.next
  while (next && next.next) {
    console.log(`Node : ${next.key} has data ${next.data.val} and weight ${next.data.weight}`)
    next = next.next
  }
}
// 对某一元素进行加权操作
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

export default LRU
