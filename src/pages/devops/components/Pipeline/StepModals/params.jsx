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
  Alert,
} from '@kube-design/components'
import { NumberInput } from 'components/Inputs'
import { pick, set, isEmpty } from 'lodash'
import { Modal, CodeEditor } from 'components/Base'
import { safeParseJSON } from 'utils'

import styles from './index.scss'

export default class Params extends React.Component {
  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = { formData: {}, value: '' }
  }

  static getDerivedStateFromProps(nextProps) {
    if (isEmpty(nextProps.edittingData)) {
      return {
        formData: {},
      }
    }
    const codeParameters = nextProps.activeTask?.parameters?.filter(
      p => p.type === 'code'
    )
    if (codeParameters.length) {
      return {
        value: nextProps.edittingData.value[codeParameters[0].name],
      }
    }
    const formData = nextProps.edittingData.data.reduce((prev, arg) => {
      prev[arg.key] = arg.value.value
      return prev
    }, {})
    return { formData }
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

  handleCodeEditorChange = name => value => {
    const { formData } = this.state
    set(formData, name, value)
  }

  renderFormItem(option) {
    const { credentialsList } = this.props.store
    const defaultFormItemProps = {
      key: option.name,
      label: option.name,
      desc: option.display,
      rules: [
        {
          required: option.required ?? false,
          message: t('PARAM_REQUIRED'),
        },
      ],
    }

    switch (option.type) {
      case 'secret':
        return (
          <Form.Item
            {...{
              ...defaultFormItemProps,
              desc: (
                <p>
                  {t('SELECT_CREDENTIAL_DESC')}
                  <span
                    className={styles.clickable}
                    onClick={this.props.showCredential}
                  >
                    {t('CREATE_CREDENTIAL')}
                  </span>
                </p>
              ),
            }}
          >
            <Select
              name={option.name}
              options={this.getCredentialsList()}
              pagination={pick(credentialsList, ['page', 'limit', 'total'])}
              isLoading={credentialsList.isLoading}
              onFetch={this.getCredentialsListData}
              optionRenderer={this.optionRender}
              valueRenderer={this.optionRender}
              searchable
              clearable
              {...(option.props || {})}
            />
          </Form.Item>
        )
      case 'number':
        return (
          <Form.Item {...defaultFormItemProps}>
            <NumberInput
              name={option.name}
              defaultValue={option.defaultValue || ''}
              {...(option.props || {})}
            />
          </Form.Item>
        )
      case 'text':
        return (
          <Form.Item {...defaultFormItemProps}>
            <TextArea
              name={option.name}
              defaultValue={option.defaultValue || ''}
              rows={8}
              {...(option.props || {})}
            />
          </Form.Item>
        )
      case 'enum':
        return (
          <Form.Item {...defaultFormItemProps}>
            <Select
              name={option.name}
              options={option.options || []}
              defaultValue={option.defaultValue || ''}
              {...(option.props || {})}
            />
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
            {...(option.props || {})}
          />
        )
      case 'bool':
        return (
          <Form.Item {...{ ...defaultFormItemProps, label: '', desc: '' }}>
            <Checkbox
              name={option.name}
              defaultValue={option.defaultValue || ''}
              {...(option.props || {})}
            >
              {option.display}
            </Checkbox>
          </Form.Item>
        )
      case 'string':
      default:
        return (
          <Form.Item {...defaultFormItemProps}>
            <Input
              name={option.name}
              defaultValue={option.defaultValue || ''}
              {...(option.props || {})}
            />
          </Form.Item>
        )
    }
  }

  handleOk = () => {
    const formData = this.formRef.current.getData()
    const initData = this.props.activeTask.parameters.reduce(
      (pre, { name }) => ({
        ...pre,
        [name]: '',
      }),
      {}
    )
    this.formRef.current.validate(async () => {
      const jsonData = await this.props.store.getPipelineStepTempleJenkins(
        this.props.activeTask.name,
        { ...initData, ...formData }
      )
      this.props.onAddStep(safeParseJSON(jsonData, {}))
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
        {activeTask.tips && (
          <Alert
            type="info"
            icon="information"
            className={styles.info}
            message={t(`${activeTask.tips}`)}
          />
        )}
        <Form data={this.state.formData} ref={this.formRef}>
          {activeTask.parameters.map(option => this.renderFormItem(option))}
        </Form>
      </Modal>
    )
  }
}
