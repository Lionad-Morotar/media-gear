export default new Map([
  [
    /mdeditor/i,
    {
      info: {
        multyWindow: false
      },
      config: {
        title: 'TEditor',
        fullbody: true,
        fullScreenInBody: true,
        top: 50
      }
    }
  ],
  [
    /playground/i,
    {
      info: {
        multyWindow: true
      },
      config: {
        is: 'mdEditor',
        title: 'PLAY_GROUND',
        top: 100
      }
    }
  ]
])
