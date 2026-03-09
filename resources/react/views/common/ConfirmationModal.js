import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

export default function ConfirmationModal({ resource, visible, setVisible, onYes }) {
  return (
    <>
      <CModal
        backdrop="static"
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="StaticBackdropExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">{resource}?</CModalTitle>
        </CModalHeader>
        <CModalBody>You are about to {resource}. Are you sure ?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={onYes}>
            Yes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}
