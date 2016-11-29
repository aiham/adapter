 /* eslint-env node */
'use strict';

module.exports = function constructGlobalMock(global) {
  if (typeof global !== 'object') {
    return undefined;
  }

  var globalMock = {};

  var windowKeys = [
    'document',
    'setTimeout',
    'MediaStream',
    'webkitMediaStream',
    'RTCIceCandidate',
    'mozRTCIceCandidate',
    'RTCSessionDescription',
    'mozRTCSessionDescription',
    'RTCIceGatherer',
    'RTCIceTransport',
    'RTCDtlsTransport',
    'RTCRtpReceiver',
    'RTCRtpSender'
  ];

  var windowClassNames = [
    'HTMLMediaElement',
    'RTCPeerConnection',
    'webkitRTCPeerConnection',
    'mozRTCPeerConnection',
    'MediaStreamTrack'
  ];

  var navigatorKeys = [
    'getUserMedia',
    'webkitGetUserMedia',
    'mozGetUserMedia'
  ];

  var mediaDevicesKeys = [
    'getUserMedia',
    'enumerateDevices',
    'getSupportedConstraints',
    'addEventListener',
    'removeEventListener'
  ];

  pick(globalMock, global, windowKeys);
  pick(globalMock, global, windowClassNames, extend);

  if (typeof global.navigator !== 'undefined') {
    globalMock.navigator = {};

    pick(globalMock.navigator, global.navigator, navigatorKeys);

    if (typeof global.navigator.mediaDevices !== 'undefined') {
      globalMock.navigator.mediaDevices = {};

      pick(
        globalMock.navigator.mediaDevices,
        global.navigator.mediaDevices,
        mediaDevicesKeys
      );
    }
  }

  return globalMock;
};

function pick(target, source, keys, wrap) {
  keys.forEach(function(key) {
    var value = source[key];
    if (typeof value !== 'undefined') {
      if (typeof value === 'function') {
        value = bind(key, value, source)
      }
      if (typeof wrap === 'function') {
        console.log(key, value);
        value = wrap(value);
      }
      target[key] = value;
    }
  });
}

function bind(parentName, func, context) {
  var key;
  var bound = func.bind(context);

  for (key in func) {
    if (typeof bound[key] === 'undefined') {
      bound[key] = func[key];
    }
  }

  return bound;
}

function extend(ParentClass) {
  function ChildClass() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this);

    return new (Function.prototype.bind.apply(ParentClass, args));
  }

  if (typeof ParentClass.prototype !== 'undefined') {
    ChildClass.prototype = Object.create(ParentClass.prototype);
    ChildClass.prototype.constructor = ChildClass;
  }

  var staticKey;
  for (staticKey in ParentClass) {
    ChildClass[staticKey] = ParentClass[staticKey];
  }

  return ChildClass;
}
