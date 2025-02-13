


import { useModal } from '../../context/modal';

function OpenModalMenuItem({
  modalComponent, 
  itemText,
  onItemClick, 
  onModalClose 
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === "function") onItemClick();
  };

  return (
    <div onClick={onClick} className='modal-menu-item'>{itemText}</div>
  );
}

export default OpenModalMenuItem;