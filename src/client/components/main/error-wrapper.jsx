import React from 'react'
import {Icon, Button} from 'antd'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: {}
    }
  }

  componentDidCatch(error) {
    console.log(new Date() + '', error.stack)
    this.setState({
      hasError: true,
      error
    })
  }

  reload = () => {
    location.reload()
  }

  render() {
    if (this.state.hasError) {
      let {stack, message} = this.state.error
      return (
        <div className="pd3 aligncenter">
          <h1>
            <Icon type="frown-o" className="mg1r iblock" />
            <span className="iblock mg1r">出错了</span>
            <Button
              onClick={this.reload}
              className="iblock"
              icon="reload"
            >
              刷新
            </Button>
          </h1>
          <div className="pd1y">{message}</div>
          <div className="pd1y">{stack}</div>
        </div>
      )
    }
    return this.props.children
  }
}
