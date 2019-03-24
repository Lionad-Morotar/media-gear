import { timeAgo, toThousandFilter } from '@/filters'

describe('过滤器测试 : timeAgo', () => {
  it('分钟', () => {
    expect(timeAgo(Math.floor(new Date().getTime() / 1000))).to.equal('just now')
    expect(timeAgo(Math.floor(new Date().getTime() / 1000) - 60)).to.equal('1 minute')
  })
  it('小时', () => {
    expect(timeAgo(Math.floor(new Date().getTime() / 1000) - 3600 * 1)).to.equal('1 hour')
  })
  it('天', () => {
    expect(timeAgo(Math.floor(new Date().getTime() / 1000) - 3600 * 24)).to.equal('1 day')
  })
  it('复数单位', () => {
    expect(timeAgo(Math.floor(new Date().getTime() / 1000) - 120)).to.equal('2 minutes')
    expect(timeAgo(Math.floor(new Date().getTime() / 1000) - 3600 * 2)).to.equal('2 hours')
    expect(timeAgo(Math.floor(new Date().getTime() / 1000) - 3600 * 48)).to.equal('2 days')
  })
})

describe('过滤器测试 : toThousandFilter', () => {
  it('负数', () => {
    expect(toThousandFilter(-234234)).to.equal('-234,234')
  })
  it('零', () => {
    expect(toThousandFilter(0)).to.equal('0')
  })
  it('整数', () => {
    expect(toThousandFilter(23426346537)).to.equal('23,426,346,537')
  })
  it('字符串', () => {
    expect(toThousandFilter('23426346537')).to.equal('23,426,346,537')
    expect(toThousandFilter('-234234')).to.equal('-234,234')
    expect(toThousandFilter('0')).to.equal('0')
  })
})
