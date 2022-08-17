/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2022 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import {
  Form,
  Tag,
  Select,
  Input,
  TextArea,
  Checkbox,
} from '@kube-design/components'
import { NumberInput } from 'components/Inputs'
import { toJS } from 'mobx'
import { pick, set, isEmpty, get, isUndefined } from 'lodash'
import { Modal, CodeEditor } from 'components/Base'
import { safeParseJSON } from 'utils'
import { groovyToJS } from 'utils/devops'
import { observer } from 'mobx-react'

import styles from './index.scss'

const boolMap = new Map([
  [true, 'true'],
  [false, 'false'],
])

const parseCheckoutData = data => {
  const formData = data.data.reduce((prev, arg) => {
    if (arg.key === 'scm') {
      const str = arg.value.value
      if (str) {
        Object.assign(prev, groovyToJS(str))
      }
    }
    prev[arg.key] = arg.value.value
    return prev
  }, {})
  return { formData }
}

const parseWithCredientialData = data => {
  const str = get(data, 'data.value', '')
  if (str) {
    const formData = groovyToJS(str)
    const credentialType = setCredentialType(str)
    return { formData, credentialType }
  }
  return null
}

const typesDict = {
  secret_text: 'string',
  username_password: 'usernamePassword',
  ssh: 'sshUserPrivateKey',
  kubeconfig: 'kubeconfigContent',
}

const setCredentialType = str => {
  const typeReg = /\$\{\[([\w-]*)\(/
  const type = str.match(typeReg) && str.match(typeReg)[1]
  if (type) {
    const credentialType = Object.entries(typesDict).find(
      typeArr => typeArr[1] === type
    )[0]
    return credentialType
  }
  return null
}

const initialData = parameters => {
  let codeName = ''
  return parameters?.reduce((prev, { name, type, defaultValue }) => {
    type === 'code' && (codeName = name)
    return {
      initData: {
        ...(prev.initData || {}),
        [name]: type === 'bool' ? defaultValue === 'true' : defaultValue || '',
      },
      typeMap: {
        ...(prev.typeMap || {}),
        [name]: type,
      },
      codeName,
    }
  }, {})
}
@observer
export default class Params extends React.Component {
  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.query = {}
    this.state = {
      formData: {},
      value: '',
      typeMap: {},
      initData: {},
      name: '',
    }
  }

  componentDidMount() {
    this.getCDListData()
    this.getCredentialsListData()
    this.getPipelineListData()
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { activeTask, edittingData } = nextProps
    const { name, parameters } = activeTask
    if (name === state.name) {
      return null
    }
    const { initData, typeMap, codeName } = initialData(parameters)

    if (isEmpty(edittingData)) {
      return codeName
        ? { value: initData[codeName], initData, typeMap, name }
        : { formData: initData, initData, typeMap, name }
    }

    let result = {}
    const data = toJS(edittingData.data)
    if (edittingData.type === 'checkout') {
      result = parseCheckoutData(edittingData)
    } else if (edittingData.type === 'withcredential') {
      result = parseWithCredientialData(edittingData)
    } else if (codeName) {
      result = {
        value: (Array.isArray(data) ? data[0]?.value.value : data.value) || '',
      }
    } else {
      result = {
        formData: Array.isArray(data)
          ? data.reduce((prev, arg) => {
              prev[arg.key] = arg.value.value
              const isBoolValue = typeMap[arg.key] === 'bool'
              if (isBoolValue) {
                prev[arg.key] =
                  typeof arg.value.value === 'boolean'
                    ? arg.value.value
                    : arg.value.value === 'true'
              }
              return prev
            }, {})
          : Object.keys(initData).reduce(
              (pre, key) => ({
                ...pre,
                [key]: data.value || '',
              }),
              {}
            ),
      }
    }

    return { ...(result || {}), initData, typeMap, name }
  }

  getCredentialsListData = params => {
    return this.props.store.getCredentials(params)
  }

  getCredentialsList = () => {
    return [
      ...this.props.store.credentialsList.data.map(credential => ({
        label: credential.name,
        value: credential.name,
        type: credential.type,
        disabled: false,
      })),
    ]
  }

  optionRender = ({ label, type, disabled }) => (
    <span style={{ display: 'flex', alignItem: 'center' }}>
      {label}&nbsp;&nbsp;
      <Tag type={disabled ? '' : 'warning'}>
        {type === 'ssh' ? 'SSH' : t(type)}
      </Tag>
    </span>
  )

  renderCredentialDesc() {
    return (
      <p>
        {t('SELECT_CREDENTIAL_DESC')}
        <span className={styles.clickable} onClick={this.props.showCredential}>
          {t('CREATE_CREDENTIAL')}
        </span>
      </p>
    )
  }

  getCDListData = params => {
    return this.props.store.getCDListData(params)
  }

  getCDList = () => {
    return [
      ...this.props.store.cdList.data.map(item => ({
        label: item.name,
        value: item.name,
      })),
    ]
  }

  getPipelineListData = params => {
    return this.props.store.getPipelines(params)
  }

  getPipelineList = () => {
    return [
      ...this.props.store.pipelineList.data.map(pipeline => ({
        label: pipeline.name,
        value: pipeline.name,
      })),
    ]
  }

  handleSecretChange = option => value => {
    const { formData } = this.state
    const res = this.props.store.credentialsList.data.filter(
      t => t.name === value
    )
    if (res.length && option.postByQuery) {
      this.query = {
        secret: res[0].name,
        secretNamespace: res[0].namespace,
      }
      return
    }
    if (res.length) {
      set(formData, 'secret', res[0].name)
    }
    this.setState({ formData })
  }

  handleCodeEditorChange = name => value => {
    const { formData } = this.state
    set(formData, name, value)
  }

  handleCheckboxChange = key => value => {
    const { formData } = this.state
    set(formData, key, value)
    this.setState({ formData })
  }

  renderFormItem(option) {
    const { credentialsList, cdList, pipelineList } = this.props.store
    const defaultFormItemProps = {
      key: option.name,
      label: t(option.display),
      rules: [
        {
          required: option.required ?? false,
          message: t('PARAM_REQUIRED'),
        },
      ],
    }
    switch (option.type) {
      case 'pipeline':
        return (
          <Form.Item {...defaultFormItemProps}>
            <Select
              name={option.name}
              options={this.getPipelineList()}
              pagination={pick(pipelineList, ['page', 'limit', 'total'])}
              isLoading={pipelineList.isLoading}
              onFetch={this.getPipelineListData}
              searchable
              clearable
            />
          </Form.Item>
        )
      case 'application':
        return (
          <Form.Item {...defaultFormItemProps}>
            <Select
              name={option.name}
              options={this.getCDList()}
              pagination={pick(cdList, ['page', 'limit', 'total'])}
              isLoading={cdList.isLoading}
              onFetch={this.getCDListData}
              searchable
              clearable
            />
          </Form.Item>
        )
      case 'secret':
        return (
          <Form.Item
            {...{
              ...defaultFormItemProps,
              desc: this.renderCredentialDesc(),
            }}
          >
            <Select
              name={option.name}
              options={this.getCredentialsList()}
              pagination={pick(credentialsList, ['page', 'limit', 'total'])}
              isLoading={credentialsList.isLoading}
              onFetch={this.getCredentialsListData}
              onChange={this.handleSecretChange(option)}
              optionRenderer={this.optionRender}
              valueRenderer={this.optionRender}
              searchable
              clearable
            />
          </Form.Item>
        )
      case 'number':
        return (
          <Form.Item {...defaultFormItemProps}>
            <NumberInput name={option.name} />
          </Form.Item>
        )
      case 'text':
        return (
          <Form.Item {...defaultFormItemProps}>
            <TextArea name={option.name} rows={8} />
          </Form.Item>
        )
      case 'enum':
        return (
          <Form.Item {...defaultFormItemProps}>
            <Select name={option.name} options={option.options || []} />
          </Form.Item>
        )
      case 'code':
        return (
          <CodeEditor
            key={option.name}
            className={styles.CodeEditor}
            name="script"
            mode="yaml"
            value={this.state.value}
            onChange={this.handleCodeEditorChange(option.name)}
          />
        )
      case 'bool':
        return (
          <Form.Item {...{ ...defaultFormItemProps, label: '', desc: '' }}>
            <Checkbox
              name={option.name}
              checked={get(this.state.formData, option.name, false)}
              onChange={this.handleCheckboxChange(option.name)}
            >
              {t(option.display)}
            </Checkbox>
          </Form.Item>
        )
      case 'string':
      default:
        return (
          <Form.Item {...defaultFormItemProps}>
            <Input name={option.name} />
          </Form.Item>
        )
    }
  }

  handleOk = () => {
    const { activeTask, store, onAddStep } = this.props
    const { typeMap, initData } = this.state
    const formData = Object.entries(this.formRef.current.getData()).reduce(
      (prev, [key, value]) => {
        const isBoolValue = typeMap[key] === 'bool'
        const _value = isUndefined(value) ? '' : value
        return {
          ...prev,
          [key]: isBoolValue ? boolMap.get(_value) : _value.toString(),
        }
      },
      {}
    )
    this.formRef.current.validate(async () => {
      const jsonData = await store.getPipelineStepTempleJenkins(
        activeTask.name,
        { ...initData, ...formData },
        this.query
      )
      onAddStep({
        ...safeParseJSON(jsonData, {}),
        taskName: activeTask.name,
      })
    })
  }

  render() {
    const { visible, onCancel, activeTask } = this.props
    return (
      <Modal
        width={680}
        bodyClassName={styles.body}
        onCancel={onCancel}
        onOk={this.handleOk}
        visible={visible}
        closable={false}
        title={activeTask.title}
      >
        <Form data={this.state.formData} ref={this.formRef}>
          {activeTask.parameters.map(option => this.renderFormItem(option))}
        </Form>
      </Modal>
    )
  }
}
