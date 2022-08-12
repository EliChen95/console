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
import { pick, set, isEmpty, get } from 'lodash'
import { Modal, CodeEditor } from 'components/Base'
import { safeParseJSON } from 'utils'

import styles from './index.scss'

const boolMap = new Map([
  [true, 'true'],
  [false, 'false'],
])

export default class Params extends React.Component {
  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      formData: {},
      value: '',
      paramTypeMap: {},
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
    const { name } = activeTask
    if (name === state.name) {
      return null
    }

    let codeTypeName = ''
    const initData = {}
    const paramTypeMap = {}
    activeTask.parameters?.forEach(
      ({ name: paramName, type, defaultValue }) => {
        initData[paramName] =
          type === 'bool' ? defaultValue === 'true' : defaultValue || ''
        paramTypeMap[paramName] = type
        type === 'code' && (codeTypeName = paramName)
      }
    )
    if (isEmpty(edittingData)) {
      return codeTypeName
        ? { value: initData[codeTypeName], initData, paramTypeMap, name }
        : { formData: initData, initData, paramTypeMap, name }
    }

    if (codeTypeName) {
      return {
        value: edittingData.value[codeTypeName],
        initData,
        paramTypeMap,
        name,
      }
    }
    const formData = edittingData.data.reduce((prev, arg) => {
      const isBoolValue = paramTypeMap[arg.key] === 'bool'
      prev[arg.key] = isBoolValue ? arg.value.value === 'true' : arg.value.value
      return prev
    }, {})
    return { formData, initData, paramTypeMap, name }
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

  handleSecretChange = value => {
    const { formData } = this.state
    const res = this.props.store.credentialsList.data.filter(
      t => t.name === value
    )
    if (res.length) {
      set(formData, 'secret', res[0].name)
      set(formData, 'secretNamespace', res[0].namespace)
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
      label: option.display,
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
              onChange={this.handleSecretChange}
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
              {option.display}
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
    const { paramTypeMap, initData } = this.state
    const formData = Object.entries(this.formRef.current.getData()).reduce(
      (prev, [key, value]) => {
        const isBoolValue = paramTypeMap[key] === 'bool'
        return {
          ...prev,
          [key]: isBoolValue ? boolMap.get(value) : (value || '').toString(),
        }
      },
      {}
    )
    this.formRef.current.validate(async () => {
      const jsonData = await store.getPipelineStepTempleJenkins(
        activeTask.name,
        { ...initData, ...formData }
      )
      onAddStep(safeParseJSON(jsonData, {}))
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
