/* eslint-disable one-var */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-call */
/* eslint-disable no-self-compare */
/* eslint-disable standard/object-curly-even-spacing */
/* eslint-disable camelcase */

var $$iterator = global.Symbol.iterator,
  $$toStringTag = global.Symbol.toStringTag

var OVERRIDE_NATIVE_FOR_TESTING = false

function NextJob (result) {
  // no-op
}

function ToObject (v) {
  if (v === null || v === undefined) throw TypeError()
  return Object(v)
}

function GetV (v, p) {
  var o = ToObject(v)
  return o[p]
}
function GetMethod (o, p) {
  var func = GetV(o, p)
  if (func === undefined || func === null) return undefined
  if (!IsCallable(func)) throw TypeError()
  return func
}

function isSymbol (s) {
  return (typeof s === 'symbol') || ('Symbol' in global && s instanceof global.Symbol)
}

function define (o, p, v, override) {
  if (p in o && !override && !OVERRIDE_NATIVE_FOR_TESTING) { return }

  if (typeof v === 'function') {
    // Sanity check that functions are appropriately named (where possible)
    console.assert(isSymbol(p) || !('name' in v) || v.name === p || v.name === p + '_', 'Expected function name "' + p.toString() + '", was "' + v.name + '"')
    Object.defineProperty(o, p, {
      value: v,
      configurable: true,
      enumerable: false,
      writable: true
    })
  } else {
    Object.defineProperty(o, p, {
      value: v,
      configurable: false,
      enumerable: false,
      writable: false
    })
  }
}

function strict (o) {
  return o === global ? undefined : o
}

function GetIterator (obj, method) {
  if (arguments.length < 2) { method = GetMethod(obj, $$iterator) }
  var iterator = method.call(obj)
  if (Type(iterator) !== 'object') throw TypeError()
  return iterator
}

function IteratorStep (iterator, value) {
  var result = IteratorNext(iterator, value)
  var done = result['done']
  if (Boolean(done) === true) return false
  return result
}

function IteratorNext (iterator, value) {
  if (arguments.length < 2) { var result = iterator.next() } else { result = iterator.next(value) }
  if (Type(result) !== 'object') throw TypeError()
  return result
}

function IteratorValue (iterResult) {
  console.assert(Type(iterResult) === 'object')
  return iterResult.value
}

function IsCallable (o) { return typeof o === 'function' }

function IsConstructor (o) {
  if (/Constructor/.test(Object.prototype.toString.call(o))) return true
  if (/Function/.test(Object.prototype.toString.call(o))) return true
  return typeof o === 'function'
}

var enqueue = (function (nativePromise, nativeSetImmediate) {
  if (nativePromise) { return function (job) { nativePromise.resolve().then(function () { job() }) } }
  if (nativeSetImmediate) { return function (job) { nativeSetImmediate(job) } }
  return function (job) { setTimeout(job, 0) }
}(global['Promise'], global['setImmediate']))

function EnqueueJob (queueName, job, args) {
  var fn = function () { job.apply(undefined, args) }
  enqueue(fn)
}

function SameValue (x, y) {
  if (typeof x !== typeof y) return false
  switch (typeof x) {
    case 'undefined':
      return true
    case 'number':
      if (x !== x && y !== y) return true
      if (x === 0 && y === 0) return 1 / x === 1 / y
      return x === y
    case 'boolean':
    case 'string':
    case 'object':
    default:
      return x === y
  }
}

function Type (v) {
  switch (typeof v) {
    case 'undefined': return 'undefined'
    case 'boolean': return 'boolean'
    case 'number': return 'number'
    case 'string': return 'string'
    case 'symbol': return 'symbol'
    default:
      if (v === null) return 'null'
      if (v instanceof global.Symbol) return 'symbol'
      return 'object'
  }
}

function set_internal (o, p, v) {
  Object.defineProperty(o, p, {
    value: v,
    configurable: false,
    enumerable: false,
    writable: true
  })
}

(function () {
  // 25.4 Promise Objects

  // 25.4.1 Promise Abstract Operations

  // 25.4.1.1 PromiseCapability Records
  // 25.4.1.1.1 IfAbruptRejectPromise ( value, capability )

  function IfAbruptRejectPromise (value, capability) {
    var rejectResult = capability['[[Reject]]'].call(undefined, value)
    return capability['[[Promise]]']
  }

  // 25.4.1.2 PromiseReaction Records

  // 25.4.1.3 CreateResolvingFunctions ( promise )

  function CreateResolvingFunctions (promise) {
    var alreadyResolved = {'[[value]]': false}
    var resolve = PromiseResolveFunction()
    set_internal(resolve, '[[Promise]]', promise)
    set_internal(resolve, '[[AlreadyResolved]]', alreadyResolved)
    var reject = PromiseRejectFunction()
    set_internal(reject, '[[Promise]]', promise)
    set_internal(reject, '[[AlreadyResolved]]', alreadyResolved)
    return { '[[Resolve]]': resolve, '[[Reject]]': reject}
  }

  // 25.4.1.3.1 Promise Reject Functions

  function PromiseRejectFunction () {
    var F = function (reason) {
      console.assert(Type(F['[[Promise]]']) === 'object')
      var promise = F['[[Promise]]']
      var alreadyResolved = F['[[AlreadyResolved]]']
      if (alreadyResolved['[[value]]']) return undefined
      set_internal(alreadyResolved, '[[value]]', true)
      return RejectPromise(promise, reason)
    }
    return F
  }

  // 25.4.1.3.2 Promise Resolve Functions

  function PromiseResolveFunction () {
    var F = function (resolution) {
      console.assert(Type(F['[[Promise]]']) === 'object')
      var promise = F['[[Promise]]']
      var alreadyResolved = F['[[AlreadyResolved]]']
      if (alreadyResolved['[[value]]']) return undefined
      set_internal(alreadyResolved, '[[value]]', true)

      if (SameValue(resolution, promise)) {
        var selfResolutionError = TypeError()
        return RejectPromise(promise, selfResolutionError)
      }
      if (Type(resolution) !== 'object') { return FulfillPromise(promise, resolution) }
      try {
        var then = resolution['then']
      } catch (then) {
        return RejectPromise(promise, then)
      }
      if (!IsCallable(then)) { return FulfillPromise(promise, resolution) }
      EnqueueJob('PromiseJobs', PromiseResolveThenableJob, [promise, resolution, then])
      return undefined
    }
    return F
  }

  // 25.4.1.4 FulfillPromise ( promise, value )

  function FulfillPromise (promise, value) {
    console.assert(promise['[[PromiseState]]'] === 'pending')
    var reactions = promise['[[PromiseFulfillReactions]]']
    set_internal(promise, '[[PromiseResult]]', value)
    set_internal(promise, '[[PromiseFulfillReactions]]', undefined)
    set_internal(promise, '[[PromiseRejectReactions]]', undefined)
    set_internal(promise, '[[PromiseState]]', 'fulfilled')
    return TriggerPromiseReactions(reactions, value)
  }

  // 25.4.1.5 NewPromiseCapability ( C )

  function NewPromiseCapability (c) {
    // To keep Promise hermetic, this doesn't look much like the spec.
    return CreatePromiseCapabilityRecord(undefined, c)
  }

  // 25.4.1.5.1 CreatePromiseCapabilityRecord ( promise, constructor )

  function CreatePromiseCapabilityRecord (promise, constructor) {
    // To keep Promise hermetic, this doesn't look much like the spec.
    console.assert(IsConstructor(constructor))
    var promiseCapability = {}
    set_internal(promiseCapability, '[[Promise]]', promise)
    set_internal(promiseCapability, '[[Resolve]]', undefined)
    set_internal(promiseCapability, '[[Reject]]', undefined)
    var executor = GetCapabilitiesExecutor()
    set_internal(executor, '[[Capability]]', promiseCapability)

    // NOTE: Differs from spec; object is constructed here
    var constructorResult = promise = new constructor(executor)
    set_internal(promiseCapability, '[[Promise]]', promise)

    if (!IsCallable(promiseCapability['[[Resolve]]'])) throw TypeError()
    if (!IsCallable(promiseCapability['[[Reject]]'])) throw TypeError()
    if (Type(constructorResult) === 'object' && !SameValue(promise, constructorResult)) throw TypeError()
    return promiseCapability
  }

  // 25.4.1.5.2 GetCapabilitiesExecutor Functions

  function GetCapabilitiesExecutor () {
    var F = function (resolve, reject) {
      console.assert(F['[[Capability]]'])
      var promiseCapability = F['[[Capability]]']
      if (promiseCapability['[[Resolve]]'] !== undefined) throw TypeError()
      if (promiseCapability['[[Reject]]'] !== undefined) throw TypeError()
      set_internal(promiseCapability, '[[Resolve]]', resolve)
      set_internal(promiseCapability, '[[Reject]]', reject)
      return undefined
    }
    return F
  }

  // 25.4.1.6 IsPromise ( x )

  function IsPromise (x) {
    if (Type(x) !== 'object') return false
    if (!('[[PromiseState]]' in x)) return false
    if (x['[[PromiseState]]'] === undefined) return false
    return true
  }

  // 25.4.1.7 RejectPromise ( promise, reason )

  function RejectPromise (promise, reason) {
    console.assert(promise['[[PromiseState]]'] === 'pending')
    var reactions = promise['[[PromiseRejectReactions]]']
    set_internal(promise, '[[PromiseResult]]', reason)
    set_internal(promise, '[[PromiseFulfillReactions]]', undefined)
    set_internal(promise, '[[PromiseRejectReactions]]', undefined)
    set_internal(promise, '[[PromiseState]]', 'rejected')
    return TriggerPromiseReactions(reactions, reason)
  }

  // 25.4.1.8 TriggerPromiseReactions ( reactions, argument )

  function TriggerPromiseReactions (reactions, argument) {
    for (var i = 0, len = reactions.length; i < len; ++i) { EnqueueJob('PromiseJobs', PromiseReactionJob, [reactions[i], argument]) }
    return undefined
  }

  // 25.4.2 Promise Jobs

  // 25.4.2.1 PromiseReactionJob ( reaction, argument )

  function PromiseReactionJob (reaction, argument) {
    var promiseCapability = reaction['[[Capabilities]]']
    var handler = reaction['[[Handler]]']
    var handlerResult, status
    try {
      if (handler === 'Identity') handlerResult = argument
      else if (handler === 'Thrower') throw argument
      else handlerResult = handler.call(undefined, argument)
    } catch (handlerResult) {
      status = promiseCapability['[[Reject]]'].call(undefined, handlerResult)
      NextJob(status); return
    }
    status = promiseCapability['[[Resolve]]'].call(undefined, handlerResult)
    NextJob(status)
  }

  // 25.4.2.2 PromiseResolveThenableJob ( promiseToResolve, thenable, then)

  function PromiseResolveThenableJob (promiseToResolve, thenable, then) {
    // SPEC BUG: promise vs. promiseToResolve
    var resolvingFunctions = CreateResolvingFunctions(promiseToResolve)
    try {
      var thenCallResult = then.call(thenable, resolvingFunctions['[[Resolve]]'],
        resolvingFunctions['[[Reject]]'])
    } catch (thenCallResult) {
      var status = resolvingFunctions['[[Reject]]'].call(undefined, thenCallResult)
      NextJob(status); return
    }
    NextJob(thenCallResult)
  }

  // 25.4.3 The Promise Constructor

  // 25.4.3.1 Promise ( executor )

  function Promise (executor) {
    var config = { configurable: false, enumerable: false, writable: true, value: undefined }
    Object.defineProperty(this, '[[PromiseState]]', config)
    Object.defineProperty(this, '[[PromiseConstructor]]', config)
    Object.defineProperty(this, '[[PromiseResult]]', config)
    Object.defineProperty(this, '[[PromiseFulfillReactions]]', config)
    Object.defineProperty(this, '[[PromiseRejectReactions]]', config)

    var promise = this
    if (Type(promise) !== 'object') throw new TypeError()
    if (!('[[PromiseState]]' in promise)) throw TypeError()
    if (promise['[[PromiseState]]'] !== undefined) throw TypeError()
    if (!IsCallable(executor)) throw TypeError()

    set_internal(promise, '[[PromiseConstructor]]', Promise)

    return InitializePromise(promise, executor)
  }

  // 25.4.3.1.1 InitializePromise ( promise, executor )

  function InitializePromise (promise, executor) {
    console.assert('[[PromiseState]]' in promise)
    console.assert(IsCallable(executor))
    set_internal(promise, '[[PromiseState]]', 'pending')
    set_internal(promise, '[[PromiseFulfillReactions]]', [])
    set_internal(promise, '[[PromiseRejectReactions]]', [])
    var resolvingFunctions = CreateResolvingFunctions(promise)
    try {
      var completion = executor.call(undefined, resolvingFunctions['[[Resolve]]'],
        resolvingFunctions['[[Reject]]'])
    } catch (completion) {
      var status = resolvingFunctions['[[Reject]]'].call(undefined, completion)
    }
    return promise
  }

  // 25.4.4 Properties of the Promise Constructor
  // 25.4.4.1 Promise.all ( iterable )

  define(Promise, 'all', function all (iterable) {
    var c = strict(this)
    var promiseCapability = NewPromiseCapability(c)
    try {
      var iterator = GetIterator(iterable)
    } catch (value) {
      promiseCapability['[[Reject]]'].call(undefined, value)
      return promiseCapability['[[Promise]]']
    }
    var values = []
    var remainingElementsCount = { value: 1 }
    var index = 0
    while (true) {
      try {
        var next = IteratorStep(iterator)
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      if (!next) {
        remainingElementsCount.value -= 1
        if (remainingElementsCount.value === 0) {
          var resolveResult = promiseCapability['[[Resolve]]'].apply(undefined, values)
        }
        return promiseCapability['[[Promise]]']
      }
      try {
        var nextValue = IteratorValue(next)
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      try {
        var nextPromise = c.resolve(nextValue)
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      var resolveElement = PromiseAllResolveElementFunction()
      set_internal(resolveElement, '[[AlreadyCalled]]', { value: false })
      set_internal(resolveElement, '[[Index]]', index)
      set_internal(resolveElement, '[[Values]]', values)
      set_internal(resolveElement, '[[Capabilities]]', promiseCapability)
      set_internal(resolveElement, '[[RemainingElements]]', remainingElementsCount)
      remainingElementsCount.value += 1
      try {
        var result = nextPromise.then(resolveElement, promiseCapability['[[Reject]]'])
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      index += 1
    }
  })

  // 25.4.4.1.1 Promise.all Resolve Element Functions

  function PromiseAllResolveElementFunction () {
    var F = function (x) {
      var alreadyCalled = F['[[AlreadyCalled]]']
      if (alreadyCalled.value) return undefined
      alreadyCalled.value = true
      var index = F['[[Index]]']
      var values = F['[[Values]]']
      var promiseCapability = F['[[Capabilities]]']
      var remainingElementsCount = F['[[RemainingElements]]']
      try {
        values[index] = x
      } catch (result) {
        promiseCapability['[[Reject]]'].call(undefined, result)
        return promiseCapability['[[Promise]]']
      }
      remainingElementsCount.value -= 1
      if (remainingElementsCount.value === 0) { return promiseCapability['[[Resolve]]'].call(undefined, values) }
      return undefined
    }
    return F
  }

  // 25.4.4.2 Promise.prototype

  Promise.prototype = {}

  // 25.4.4.3 Promise.race ( iterable )

  define(Promise, 'race', function race (iterable) {
    var c = strict(this)
    var promiseCapability = NewPromiseCapability(c)
    try {
      var iterator = GetIterator(iterable)
    } catch (value) {
      promiseCapability['[[Reject]]'].call(undefined, value)
      return promiseCapability['[[Promise]]']
    }
    while (true) {
      try {
        var next = IteratorStep(iterator)
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      if (!next) return promiseCapability['[[Promise]]']
      try {
        var nextValue = IteratorValue(next)
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      try {
        var nextPromise = c.resolve(nextValue)
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
      try {
        nextPromise.then(promiseCapability['[[Resolve]]'], promiseCapability['[[Reject]]'])
      } catch (value) {
        promiseCapability['[[Reject]]'].call(undefined, value)
        return promiseCapability['[[Promise]]']
      }
    }
  })

  // 25.4.4.4 Promise.reject ( r )

  define(Promise, 'reject', function reject (r) {
    var c = strict(this)
    var promiseCapability = NewPromiseCapability(c)
    var rejectResult = promiseCapability['[[Reject]]'].call(undefined, r)
    return promiseCapability['[[Promise]]']
  })

  // 25.4.4.5 Promise.resolve ( x )

  define(Promise, 'resolve', function resolve (x) {
    var c = strict(this)
    if (IsPromise(x)) {
      var constructor = x['[[PromiseConstructor]]']
      if (SameValue(constructor, c)) return x
    }
    var promiseCapability = NewPromiseCapability(c)
    var resolveResult = promiseCapability['[[Resolve]]'].call(undefined, x)
    return promiseCapability['[[Promise]]']
  })

  // 25.4.4.6 Promise [ @@create ] ( )
  // 25.4.4.6.1 AllocatePromise ( constructor )
  // 25.4.5 Properties of the Promise Prototype Object
  // 25.4.5.1 Promise.prototype.catch ( onRejected )

  define(Promise.prototype, 'catch', function catch_ (onRejected) {
    var promise = this
    return promise.then(undefined, onRejected)
  })

  // 25.4.5.2 Promise.prototype.constructor

  Promise.prototype.constructor = Promise

  // 25.4.5.3 Promise.prototype.then ( onFulfilled , onRejected )

  define(Promise.prototype, 'then', function then (onFulfilled, onRejected) {
    var promise = this
    if (!IsPromise(promise)) throw TypeError()
    if (!IsCallable(onFulfilled)) onFulfilled = 'Identity'
    if (!IsCallable(onRejected)) onRejected = 'Thrower'
    var c = promise.constructor
    var promiseCapability = NewPromiseCapability(c)
    var fulfillReaction = { '[[Capabilities]]': promiseCapability,
      '[[Handler]]': onFulfilled }
    var rejectReaction = { '[[Capabilities]]': promiseCapability,
      '[[Handler]]': onRejected }
    if (promise['[[PromiseState]]'] === 'pending') {
      promise['[[PromiseFulfillReactions]]'].push(fulfillReaction)
      promise['[[PromiseRejectReactions]]'].push(rejectReaction)
    } else if (promise['[[PromiseState]]'] === 'fulfilled') {
      var value = promise['[[PromiseResult]]']
      EnqueueJob('PromiseJobs', PromiseReactionJob, [fulfillReaction, value])
    } else if (promise['[[PromiseState]]'] === 'rejected') {
      var reason = promise['[[PromiseResult]]']
      EnqueueJob('PromiseJobs', PromiseReactionJob, [rejectReaction, reason])
    }
    return promiseCapability['[[Promise]]']
  })

  // 25.4.6 Properties of Promise Instances

  if (!('Promise' in global) || OVERRIDE_NATIVE_FOR_TESTING) { global.Promise = Promise }

  // Patch early Promise.cast vs. Promise.resolve implementations
  if ('cast' in global.Promise) global.Promise.resolve = global.Promise.cast
}())

// 25.4.5.1 Promise.prototype [ @@toStringTag ]
define(Promise.prototype, $$toStringTag, 'Promise')
