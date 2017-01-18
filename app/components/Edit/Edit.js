/* @flow */
import React, { Component, PropTypes } from 'react'
import { ipcRenderer } from 'electron'
import { Button, Card, CardBlock, CardTitle, CardSubtitle, Col, Input, Form, FormGroup, Label, Popover, PopoverTitle, PopoverContent } from 'reactstrap'
import ConfirmRejectModal from '../ConfirmRejectModal/ConfirmRejectModal'
import EditBar from '../EditBar/EditBar'
import styles from './Edit.css'

class Edit extends Component {
  static propTypes = {
    dataDir: PropTypes.string.isRequired,
    products: PropTypes.array.isRequired,
    editedProduct: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  state = {
    fieldname: '',
    saveModalOpen: false,
    backModalOpen: false,
    popoverOpen: false
  }

  toggleSaveModal = () => {
    this.setState({
      saveModalOpen: !this.state.saveModalOpen
    })
  }

  toggleBackModal = () => {
    this.setState({
      backModalOpen: !this.state.backModalOpen
    })
  }

  togglePopover = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    })
  }

  handleSaveConfirmClick = () => {
    this.props.actions.mergeEditedToProducts()
    ipcRenderer.send(
      'save-products',
      this.props.dataDir,
      this.props.products,
      this.props.editedProduct
    )
    ipcRenderer.on('products-saved', () => this.toggleSaveModal())
  }

  handleBackConfirmClick = () => {
    this.props.actions.clearSearchInput()
    this.props.actions.changeLocation('/')
  }

  handleInputChange = (e: Object) => {
    this.props.actions.updateEditedProduct(e.target.id, e.target.value)
  }

  handleFieldnameInput = (e: Object) => {
    this.setState({
      fieldname: e.target.value
    })
  }

  handleCreateFieldClick = () => {
    const fieldname = this.state.fieldname
    this.props.actions.updateEditedProduct(fieldname, '')
    this.togglePopover()
    this.setState({
      fieldname: ''
    })
  }

  renderFormGroup = () => {
    return Object.keys(this.props.editedProduct).map(key => {
      const renderInputs = () => {
        switch (key) {
          case 'filename':
            return <Input
              type='text'
              id={key}
              readOnly
              value={this.props.editedProduct[key]} />

          case 'id':
            return <Input
              type='text'
              id={key}
              readOnly
              value={this.props.editedProduct[key]} />

          case 'processes':
            return <Input
              type='text'
              id={key}
              readOnly
              value={'processes array not editable'} />

          default:
            return <Input
              type='text'
              id={key}
              onKeyUp={(e) => this.handleInputChange(e)}
              placeholder={this.props.editedProduct[key]} />
        }
      }

      return (
        <FormGroup key={key} row>
          <Label
            for={key}
            sm={4}>
            {key}
          </Label>
          <Col sm={8}>
            {renderInputs()}
          </Col>
        </FormGroup>
      )
    })
  }

  renderEditView = () => {
    return (
      <div className={styles.container}>
        <Card>
          <CardBlock>
            <CardTitle>{this.props.editedProduct.name}</CardTitle>
            <CardSubtitle>{this.props.editedProduct.filename}</CardSubtitle>
          </CardBlock>
          <CardBlock>
            <Form>
              {this.renderFormGroup()}
            </Form>
          </CardBlock>
          <CardBlock>
            <div className={styles.editBtnGroup}>
              <Col sm={2}>
                <Button
                  onClick={() => this.togglePopover()}
                  outline
                  id='addField'
                  color='warning'
                  block >
                  Add field
                </Button>
                <Popover
                  placement='top'
                  isOpen={this.state.popoverOpen}
                  target='addField'
                  toggle={this.togglePopover}>
                  <PopoverTitle>
                    Enter field name
                  </PopoverTitle>
                  <PopoverContent>
                    <Input
                      type='text'
                      onKeyUp={(e) => this.handleFieldnameInput(e)}
                      placeholder='fieldname' />
                  </PopoverContent>
                  <PopoverContent className={styles.popoverBtn}>
                    <Button
                      onClick={() => this.handleCreateFieldClick()}
                      size='sm'
                      color='success'>
                      Create field
                    </Button>
                  </PopoverContent>
                </Popover>
              </Col>
              <Col sm={3}>
                <Button
                  onClick={() => this.toggleSaveModal()}
                  outline
                  color='success'>
                  Save changes
                </Button>
                <ConfirmRejectModal
                  isOpen={this.state.saveModalOpen}
                  toggle={this.toggleSaveModal}
                  onConfirmClick={this.handleSaveConfirmClick}
                  onRejectClick={this.toggleSaveModal}
                  header='Saving will overwrite file!'
                  body={`Clicking save will overwrite ${this.props.editedProduct.filename}! Are you sure?`}
                  confirmBtnText='Save!'
                  rejectBtnText='Cancel'
                  />
              </Col>
            </div>
          </CardBlock>
        </Card>
      </div>
    )
  }

  render () {
    return (
      <div>
        <EditBar
          actions={this.props.actions}
          filename={this.props.editedProduct.filename}
          saveModalOpen={this.state.saveModalOpen}
          backModalOpen={this.state.backModalOpen}
          toggleSaveModal={this.toggleSaveModal}
          toggleBackModal={this.toggleBackModal}
          handleSaveConfirmClick={this.handleSaveConfirmClick}
          handleBackConfirmClick={this.handleBackConfirmClick}
          handleSaveRejectClick={this.toggleSaveModal}
          handleBackRejectClick={this.toggleBackModal} />
        {this.renderEditView()}
      </div>
    )
  }
}

export default Edit