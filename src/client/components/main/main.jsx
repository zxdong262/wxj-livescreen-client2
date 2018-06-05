
import React from 'react'
import _ from 'lodash'
//import copy from 'json-deep-copy'
import {notification, Form, Input, Button} from 'antd'
import './wrapper.styl'

const {getGlobal} = window
const ls = getGlobal('ls')
const FormItem = Form.Item
const {TextArea} = Input

/**
 * 将对象转换成 url 的 query 参数
 * 参考了：http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object/1714899#1714899
 * @example toQueryParams({a: 1, b: 2}) -> a=1&b=2
 * @param obj
 * @param prefix
 * @returns {string}
 */
const toQueryParams = function(_obj = {}) {
  let obj = _obj
  let str = []
  for (let p of Object.keys(obj)) {
    let v = obj[p]
    if (_.isUndefined(v) || _.isNull(v)) {
      v = ['']
    } else if (!_.isArray(v)) {
      v = [v]
    }
    str = [
      ...str,
      ...v.map(a => `${p}=${encodeURIComponent(a)}`)
    ]
  }
  return '?' + str.join('&')
}

@Form.create()
class Index extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      formData: ls.get('form') || {},
      loading: false
    }
  }

  componentWillMount() {
    this.checkAuth()
  }

  checkAuth = async () => {
    let {formData} = this.state
    let {
      username,
      password,
      url
    } = formData
    if (!username || !password || !url) {
      return
    }
    this.setState({
      loading: true
    })
    await this.testAuth(formData)
  }

  validateFieldsAndScroll = (fieldNames, options = {}) => {
    let { validateFieldsAndScroll } = this.props.form
    return new Promise(resolve => {
      validateFieldsAndScroll(fieldNames, options, (errors, values) => {
        if (errors) resolve(false)
        else resolve(values)
      })
    })
  }

  setStateLs = (update) => {
    Object.keys(update).forEach(k => {
      ls.set(k, update[k])
    })
    this.setState(update)
  }

  handleSubmit = async e => {
    e.preventDefault()
    let ok = await this.validateFieldsAndScroll()
    if (!ok) return
    await this.testAuth(ok)
  }

  testAuth = async (formData) => {
    let {
      url,
      username,
      password
    } = formData
    let arr = url.split('/')
    let host = arr[2]
    let authUrl = arr[0] + '//' + host + '/imoa-api/oauth/token'
    const p = window.getGlobal('rp')
    let query = {
      username,
      password,
      grant_type: 'password'
    }
    let linkAuth = authUrl + toQueryParams(query)
    console.log(linkAuth)
    /**
     *     //* 通常需特别配置 获取授权参数
    authParam: {
      grant_type: 'password',
       username: 'yyh',
       password: '888888'
    },
     */
    try {
      let res = await p({
        url: linkAuth,
        method: 'POST',
        parse: 'json',
        headers: {
          Authorization: 'Basic aW1vYS13ZWNoYXQ6'
        }
      })
      //console.log(res.body)
      if (!res.body.access_token) {
        throw new Error('验证失败，请检查填写的用户名密码或者大屏地址')
      }
      ls.set('form', formData)
      setTimeout(() => {
        window.location = url
      }, 100)
    } catch(e) {
      this.onError(e)
      this.setState({
        loading: false
      })
    }
  }

  onError = e => {
    let {message = 'error', stack} = e
    console.log(new Date + '', stack, _.isString(stack))
    let msg = (
      <div className="mw240 elli wordbreak" title={message}>
        {message}
      </div>
    )
    let description = (
      <pre
        className="mw300 elli common-err-desc wordbreak"
        title={stack}
      >
        {stack}
      </pre>
    )
    notification.error({
      message: msg,
      description,
      duration: 55
    })
  }

  toggleFullscreen = () => {
    (window.getGlobal('toggleFullscreen') || _.noop)()
  }

  openConsole = () => {
    (window.getGlobal('openDevTools') || _.noop)()
  }

  closeApp = () => {
    (window.getGlobal('closeApp') || _.noop)()
  }

  restart = () => {
    (window.getGlobal('restart') || _.noop)()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 6
      }
    }
    let {loading, formData} = this.state
    if (loading) {
      return (
        <div className="pd3 aligncenter">
          验证授权中...
        </div>
      )
    }
    return (
      <div className="page">
        <div className="pd2y aligncenter">
          <Button
            className="mg1r"
            onClick={this.toggleFullscreen}
          >
            切换全屏
          </Button>
          <Button
            className="mg1r"
            onClick={this.openConsole}
          >
            打开调试器
          </Button>
          <Button
            className="mg1r"
            onClick={this.closeApp}
          >
            关闭程序
          </Button>
          <Button
            className="mg1r"
            onClick={this.restart}
          >
            重启程序
          </Button>
        </div>
        <h1 className="pd2y pd1b aligncenter">
          登录到无限极产品大屏
        </h1>
        <p className="font pd1b font14 aligncenter">按 <b>Alt</b> 键切换显示/隐藏菜单</p>

        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="用户名"
            hasFeedback
          >
            {getFieldDecorator('username', {
              rules: [{
                required: true, message: '请输入用户名'
              }, {
                min: 1,
                max: 50,
                type: 'string',
                message: '1~50个字符'
              }],
              initialValue: formData.username
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码"
            hasFeedback
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码'
              }, {
                min: 1,
                max: 28,
                type: 'string',
                message: '1~28个字符'
              }],
              initialValue: formData.password
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="产品大屏地址"
            hasFeedback
          >
            {getFieldDecorator('url', {
              rules: [{
                required: true, message: '请输入产品大屏地址'
              }, {
                min: 1,
                max: 280,
                type: 'string',
                message: '1~28个字符'
              }],
              initialValue: formData.url
            })(
              <TextArea />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon="search"
              className="iblock"
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }

}
export default Index
