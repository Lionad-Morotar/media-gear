import LRU from '@/utils/suites/teditor/lru'

describe('LRU测试', () => {
  const lru = new LRU(4)
  it('能够正确维护链表长度', () => {
    lru.set('1', 1)
    lru.set('2', 2)
    lru.set('3', 3)
    lru.set('4', 4)
    lru.set('5', 5)
    expect(lru.has('4')).to.equal(false)
  })
  it('节点的数据应该正确', () => {
    expect(lru.get('1')).to.equal(1)
    expect(lru.get('2')).to.equal(2)
    expect(lru.get('3')).to.equal(3)
    expect(lru.get('5')).to.equal(5)
    lru.get('5')
    lru.get('3')
    lru.get('3')
    lru.get('3')
    lru.get('3')
    lru.set('5', 6)
    expect(lru.get('5')).to.equal(6)
  })
  it('节点的权重应该正确', () => {
    expect(lru.getNodeWeight('5')).to.equal(14)
    expect(lru.getNodeWeight('3')).to.equal(6)
  })
})
