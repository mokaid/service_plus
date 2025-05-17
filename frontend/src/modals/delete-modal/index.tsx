import React, {type FC, useState } from 'react';
import { Button, Modal } from 'antd';
type Props = {
    dataTestId?: string;
    alarmRecord?: boolean;
    Show: boolean;
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  };
  
const DeleteModal: FC<Props> = ({Show,setDeleteModal}) => {
 
  const handleOk = () => {
    setDeleteModal(false)
  };

  const handleCancel = () => {
    setDeleteModal(false)
  };

  return (
    <>
      <Modal title="Basic Modal" open={Show} onOk={handleOk} onCancel={handleCancel} className='delete_modal'>
       
      </Modal>
    </>
  );
};

export default DeleteModal;